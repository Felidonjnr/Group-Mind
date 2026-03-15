import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAM_q9pw3x18u0MNvKXQTW-G07zA4loXQE",
  authDomain: "group-mind-13c6c.firebaseapp.com",
  projectId: "group-mind-13c6c",
  storageBucket: "group-mind-13c6c.firebasestorage.app",
  messagingSenderId: "326553782516",
  appId: "1:326553782516:web:a70fcfea87baed503736a1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);

export const initAuth = () => new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    resolve(user || null);
  });
});