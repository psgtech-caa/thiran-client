import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { UserProfile, parseUserProfile, isAdmin } from '@/lib/userUtils';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateMobileNumber: (mobile: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        if (!user.email?.endsWith('@psgtech.ac.in')) {
          toast.error('Only @psgtech.ac.in emails are allowed');
          await firebaseSignOut(auth);
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          return;
        }

        const profile = parseUserProfile(user.email, user.displayName);
        if (profile) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile({ ...profile, photoURL: user.photoURL || undefined, ...userDoc.data() } as UserProfile);
          } else {
            setUserProfile({ ...profile, photoURL: user.photoURL || undefined });
          }
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email?.endsWith('@psgtech.ac.in')) {
        toast.error('Only @psgtech.ac.in emails are allowed');
        await firebaseSignOut(auth);
        return;
      }

      // Save user profile with photoURL
      const profile = parseUserProfile(user.email, user.displayName);
      if (profile) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // First time sign in - create profile
          await setDoc(userDocRef, {
            ...profile,
            photoURL: user.photoURL,
          });
        } else {
          // Update photoURL if changed
          await setDoc(userDocRef, {
            photoURL: user.photoURL,
          }, { merge: true });
        }
      }

      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  const updateMobileNumber = async (mobile: string) => {
    if (!user || !userProfile) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const updatedProfile = { ...userProfile, mobile };
      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      setUserProfile(updatedProfile);
      toast.success('Mobile number updated successfully');
    } catch (error: any) {
      console.error('Update mobile error:', error);
      toast.error(error.message || 'Failed to update mobile number');
    }
  };

  const value = {
    user,
    userProfile,
    isAdmin: user?.email ? isAdmin(user.email) : false,
    loading,
    signInWithGoogle,
    signOut,
    updateMobileNumber,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
