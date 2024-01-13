import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  connectAuthEmulator
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA4BocYfYj85wY9HGpXUSXsCb1VELfLtEc",
  authDomain: "semver-517cc.firebaseapp.com",
  projectId: "semver-517cc",
  storageBucket: "semver-517cc.appspot.com",
  messagingSenderId: "686168416891",
  appId: "1:686168416891:web:a4c3d7c0b173b45b1a38de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099");
connectFirestoreEmulator(db, '127.0.0.1', 8080);


export { db, auth };
