/**
 * LifeProof - Firebase & Google Authentication Service
 * Initializes Firebase App, Auth, Firestore, and handles Google OAuth flow.
 */

// Import official Firebase v10 Modular SDK from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration provided for LifeProof
export const firebaseConfig = {
  apiKey: "xxxxxxxx",
  authDomain: "lifeproof-xxxxx.firebaseapp.com",
  projectId: "lifeproof-xxxxx",
  storageBucket: "lifeproof-xxxxx.firebasestorage.app",
  messagingSenderId: "xxxxxxxx",
  appId: "xxxxxxxx"
};

// Initialize Firebase Services
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Ensure account chooser prompt on Google Sign-In
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Saves or updates user document in Firestore 'users' collection
 * @param {Object} user - Firebase User object
 * @param {string} role - Selected role ('student' | 'recruiter' | 'faculty')
 * @returns {Promise<Object>} userProfile
 */
export async function saveOrUpdateUserInFirestore(user, role = 'student') {
  if (!user || !user.uid) {
    throw new Error('Invalid user object provided to Firestore save.');
  }

  const userDocRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDocRef);

  let finalRole = role;

  if (userSnapshot.exists()) {
    const existingData = userSnapshot.data();
    // Maintain existing role if already set, or update with newly selected role
    finalRole = existingData.role || role;

    await updateDoc(userDocRef, {
      name: user.displayName || existingData.name || 'LifeProof Member',
      email: user.email,
      photoURL: user.photoURL || existingData.photoURL || '',
      updatedAt: serverTimestamp()
    });

    console.info(`[LifeProof Firebase] Existing user profile updated for UID: ${user.uid} with role: ${finalRole}`);
    return {
      uid: user.uid,
      name: user.displayName || existingData.name,
      email: user.email,
      photoURL: user.photoURL || existingData.photoURL,
      role: finalRole,
      isNew: false
    };
  } else {
    // Create new user document in 'users' collection
    const newUserData = {
      uid: user.uid,
      name: user.displayName || 'LifeProof Member',
      email: user.email,
      photoURL: user.photoURL || '',
      role: role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(userDocRef, newUserData);
    console.info(`[LifeProof Firebase] New user document created in Firestore for UID: ${user.uid} as ${role}`);
    return {
      ...newUserData,
      isNew: true
    };
  }
}

/**
 * Retrieves user profile data from Firestore
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<Object|null>}
 */
export async function getUserProfileFromFirestore(uid) {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    }
    return null;
  } catch (error) {
    console.error('[LifeProof Firebase] Error fetching user profile:', error);
    return null;
  }
}

/**
 * Authenticates user via Google OAuth Popup and syncs with Firestore
 * @param {string} selectedRole - 'student' | 'recruiter' | 'faculty'
 * @returns {Promise<{user: Object, profile: Object}>}
 */
export async function loginWithGoogle(selectedRole = 'student') {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.info('[LifeProof Firebase] Google Auth successful:', {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });

    // Save/Update user profile in Firestore
    const profile = await saveOrUpdateUserInFirestore(user, selectedRole);

    return { user, profile };
  } catch (error) {
    console.error('[LifeProof Firebase] Google Sign-In error code:', error.code, error.message);
    throw error;
  }
}

/**
 * Authenticates user via Email & Password
 * @param {string} email 
 * @param {string} password 
 * @param {string} selectedRole 
 */
export async function loginWithEmailPassword(email, password, selectedRole = 'student') {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const profile = await saveOrUpdateUserInFirestore(user, selectedRole);
    return { user, profile };
  } catch (error) {
    console.error('[LifeProof Firebase] Email sign-in error:', error.code, error.message);
    throw error;
  }
}

/**
 * Signs out current authenticated user
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    console.info('[LifeProof Firebase] User signed out successfully.');
  } catch (error) {
    console.error('[LifeProof Firebase] Sign out error:', error);
    throw error;
  }
}

/**
 * Listens to Firebase Authentication state change
 * @param {Function} callback 
 */
export function onAuthStateListener(callback) {
  return onAuthStateChanged(auth, callback);
}
