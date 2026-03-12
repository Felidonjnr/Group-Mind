// ─── FIREBASE CONFIGURATION ───────────────────────────────────────────────────
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (e.g. "groupmind")
// 3. Click "Web" to add a web app
// 4. Copy your config values below
// 5. Go to Firestore Database → Create database → Start in test mode

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAM_q9pw3x18u0MNvKXQTW-G07zA4loXQE",
  authDomain: "group-mind-13c6c.firebaseapp.com",
  projectId: "group-mind-13c6c",
  storageBucket: "group-mind-13c6c.firebasestorage.app",
  messagingSenderId: "326553782516",
  appId: "1:326553782516:web:a70fcfea87baed503736a1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auto sign-in anonymously so data can be saved per user
export const initAuth = () => new Promise((resolve) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      resolve(user.uid);
    } else {
      const result = await signInAnonymously(auth);
      resolve(result.user.uid);
    }
  });
});
                                          
