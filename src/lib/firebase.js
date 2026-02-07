import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics only if online to avoid errors
export let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Analytics disabled - network unavailable:', error.message);
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider with a preferred @psgtech.ac.in hosted domain (UI hint only)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  hd: 'psgtech.ac.in', // Hosted domain hint; actual domain restriction is enforced via email checks in authContext
  prompt: 'select_account'
});

export default app;
