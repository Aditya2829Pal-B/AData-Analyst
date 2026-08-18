import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "original-loop-c8chg",
  appId: "1:1030667469642:web:c6f5d1fcf04f7619b977b3",
  apiKey: "AIzaSyDznbuZT5hEINiB9SiXprk4wxudU3t_PCw",
  authDomain: "original-loop-c8chg.firebaseapp.com",
  // Ignore firestoreDatabaseId if it's the default '(default)', otherwise wait, AI Studio Firebase uses custom database ID.
  // Wait, let's look at firebase-applet-config.json again. It has firestoreDatabaseId
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-remixaidataanaly-17d288bc-2782-4489-903c-013fe60105df"); // the DB ID from config
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Ensure user doc exists
    const userRef = doc(db, 'users', result.user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: result.user.email,
        name: result.user.displayName,
        subscriptionTier: 'free',
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
