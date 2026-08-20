/**
 * LifeProof - Firebase & Cloud Firestore Initialization Module
 * 
 * Initializes Firebase Authentication, Cloud Firestore, and provides
 * functions to save, update, and retrieve user profiles in the 'users' collection.
 */

// Import official Firebase v10 Modular SDK from Google CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration placeholder
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Cloud Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Google Auth Provider with account selection prompt
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

/**
 * Saves or updates user document in Firestore 'users' collection using Firebase UID.
 * Ensures no duplicate documents are created.
 * 
 * @param {Object} user - Firebase User object
 * @param {'student'|'recruiter'|'faculty'} selectedRole - Portal role selected by user
 * @returns {Promise<Object>} Stored user profile data
 */
export async function saveOrUpdateUserProfile(user, selectedRole = 'student') {
  if (!user || !user.uid) {
    throw new Error("Invalid user object provided to Firestore.");
  }

  // Validate allowed roles
  const validRoles = ['student', 'recruiter', 'faculty'];
  const sanitizedRole = validRoles.includes(selectedRole) ? selectedRole : 'student';

  const userDocRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    // User exists -> Update profile information and retrieve existing role
    const existingData = userSnapshot.data();
    const finalRole = validRoles.includes(existingData.role) ? existingData.role : sanitizedRole;

    const updatePayload = {
      name: user.displayName || existingData.name || 'LifeProof Member',
      email: user.email || existingData.email || '',
      photoURL: user.photoURL || existingData.photoURL || '',
      role: finalRole,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userDocRef, updatePayload);
    console.info(`[LifeProof Firestore] Profile updated for UID: ${user.uid} with role: ${finalRole}`);

    return {
      uid: user.uid,
      name: updatePayload.name,
      email: updatePayload.email,
      photoURL: updatePayload.photoURL,
      role: finalRole,
      isNew: false
    };
  } else {
    // New user -> Create document in 'users' collection with Firebase UID
    const newUserData = {
      name: user.displayName || 'LifeProof Member',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: sanitizedRole,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(userDocRef, newUserData);
    console.info(`[LifeProof Firestore] New user document created for UID: ${user.uid} as ${sanitizedRole}`);

    return {
      uid: user.uid,
      ...newUserData,
      isNew: true
    };
  }
}

/**
 * Retrieves a user's profile document from Firestore 'users' collection
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<Object|null>}
 */
export async function getUserProfile(uid) {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      return {
        uid,
        ...userSnapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error('[LifeProof Firestore] Error fetching user profile:', error);
    return null;
  }
}

// Export initialized instances and official Firebase functions
export {
  firebaseConfig,
  app,
  auth,
  db,
  googleProvider,
  initializeApp,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
};
