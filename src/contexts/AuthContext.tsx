import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { UserProfile, UserRole, parseUserProfile, isAdmin, isCoordinator, getUserRole } from '@/lib/userUtils';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userRole: UserRole;
  isAdmin: boolean;
  isCoordinator: boolean;
  loading: boolean;
  needsProfileSetup: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateMobileNumber: (mobile: string) => Promise<void>;
  completeProfile: (data: { mobile: string; department: string; year: number }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    try {
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
            // Determine role from environment config
            const role = getUserRole(user.email);
            profile.role = role;

            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                const data = userDoc.data();
                const merged = { ...profile, photoURL: user.photoURL || undefined, ...data, role } as UserProfile;
                setUserProfile(merged);
                setNeedsProfileSetup(!data.profileComplete);
              } else {
                setUserProfile({ ...profile, photoURL: user.photoURL || undefined });
                setNeedsProfileSetup(true);
              }
            } catch (err: any) {
              console.warn('Could not fetch user doc (possibly offline):', err.message);
              setUserProfile({ ...profile, photoURL: user.photoURL || undefined });
            }
          }
        } else {
          setUserProfile(null);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error: any) {
      console.error('Firebase Auth initialization error:', error);
      setLoading(false);
    }
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

      const profile = parseUserProfile(user.email, user.displayName);
      if (profile) {
        const role = getUserRole(user.email);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          setNeedsProfileSetup(true);
        } else {
          const data = userDoc.data();
          // Update photoURL and role if changed
          await setDoc(userDocRef, { photoURL: user.photoURL, role }, { merge: true });
          if (!data.profileComplete) {
            setNeedsProfileSetup(true);
          }
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

  const completeProfile = async (data: { mobile: string; department: string; year: number }) => {
    if (!user || !userProfile) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const role = getUserRole(user.email || '');
      const updatedProfile = {
        ...userProfile,
        mobile: data.mobile,
        department: data.department,
        year: data.year,
        photoURL: user.photoURL,
        profileComplete: true,
        role,
      };
      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      setUserProfile(updatedProfile as UserProfile);
      setNeedsProfileSetup(false);
      toast.success('Profile completed!');
    } catch (error: any) {
      console.error('Complete profile error:', error);
      toast.error(error.message || 'Failed to save profile');
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    userRole: userProfile?.role || (user?.email ? getUserRole(user.email) : 'student') as UserRole,
    isAdmin: user?.email ? isAdmin(user.email) : false,
    isCoordinator: user?.email ? isCoordinator(user.email) : false,
    loading,
    needsProfileSetup,
    signInWithGoogle,
    signOut,
    updateMobileNumber,
    completeProfile,
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
