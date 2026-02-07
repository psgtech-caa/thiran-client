import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileInput, setShowMobileInput] = useState(false);

  // Extract roll number from email (e.g., 25mx114@psgtech.ac.in -> 25MX114)
  const extractRollNumber = (email) => {
    if (!email) return null;
    const match = email.match(/^([0-9]{2}[a-zA-Z]{2}[0-9]{3})@psgtech\.ac\.in$/i);
    return match ? match[1].toUpperCase() : null;
  };
  
  // Extract name from displayName (e.g., "25MX114 - KAVIN M" -> "KAVIN M")
  const extractName = (displayName) => {
    if (!displayName) return 'Unknown';
    
    // Check if format is "ROLLNUMBER - NAME"
    const match = displayName.match(/^[0-9]{2}[a-zA-Z]{2}[0-9]{3}\s*-\s*(.+)$/i);
    if (match) {
      return match[1].trim();
    }
    
    // Otherwise return as is
    return displayName.trim();
  };
  
  // Check if user is admin
  const isAdmin = (email) => {
    const adminEmailsString = import.meta.env.VITE_ADMIN_EMAILS || '25mx114@psgtech.ac.in,25mx336@psgtech.ac.in';
    const adminEmails = adminEmailsString.split(',').map(e => e.trim().toLowerCase());
    return adminEmails.includes(email?.toLowerCase());
  };

  // Validate email is from @psgtech.ac.in
  const validateEmail = (email) => {
    return typeof email === 'string' && email.endsWith('@psgtech.ac.in');
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Validate email domain
      if (!validateEmail(user.email)) {
        await firebaseSignOut(auth);
        throw new Error('Please use your @psgtech.ac.in email address');
      }

      const rollNumber = extractRollNumber(user.email);
      if (!rollNumber) {
        await firebaseSignOut(auth);
        throw new Error('Invalid email format. Please use your college email (e.g., 25mx114@psgtech.ac.in)');
      }
      
      const extractedName = extractName(user.displayName);

      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // New user - need to collect mobile number
        setShowMobileInput(true);
        return { user: { ...user, name: extractedName }, isNewUser: true, rollNumber };
      } else {
        // Existing user
        const userData = userDoc.data();
        setUser({ ...user, ...userData, rollNumber, name: extractedName });
        return { user: { ...user, ...userData, rollNumber, name: extractedName }, isNewUser: false };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // Complete profile with mobile number
  const completeProfile = async (mobileNumber) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }

      const rollNumber = extractRollNumber(auth.currentUser.email);
      const extractedName = extractName(auth.currentUser.displayName);
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      const userData = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        name: extractedName,
        rollNumber,
        mobileNumber,
        photoURL: auth.currentUser.photoURL,
        isAdmin: isAdmin(auth.currentUser.email),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(userDocRef, userData);
      setUser({ ...auth.currentUser, ...userData });
      setShowMobileInput(false);

      return userData;
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Validate email
        if (!validateEmail(firebaseUser.email)) {
          await firebaseSignOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }

        // Get user data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const rollNumber = extractRollNumber(firebaseUser.email);
          const extractedName = extractName(firebaseUser.displayName);
          setUser({ ...firebaseUser, ...userData, rollNumber, name: extractedName });
        } else {
          // User signed in but hasn't completed profile
          setShowMobileInput(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    showMobileInput,
    signInWithGoogle,
    completeProfile,
    signOut,
    setShowMobileInput,
    isAdmin: user ? isAdmin(user.email) : false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
