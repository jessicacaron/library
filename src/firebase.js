// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'; // For Realtime Database
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_0ZJb1yD-sg3BXA3N-AS3Nvc-Qbyn77c",
  authDomain: "library-db1a2-default-rtdb.firebaseio.com/",
  projectId: "library-db1a2",
  storageBucket: "library-db1a2.firebasestorage.app",
  messagingSenderId: "535830631714",
  appId: "1:535830631714:web:9fc7cf67953fb1777e417b",
  measurementId: "G-2851PDDRVD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { auth, provider, database, signInWithPopup, signOut };