// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";      // ✅ Import getAuth
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ9hU4UMdP6LGJgKxkuhUcWeS0toQ4HqY",
  authDomain: "jwt-auth-782ea.firebaseapp.com",
  projectId: "jwt-auth-782ea",
  storageBucket: "jwt-auth-782ea.appspot.com",
  messagingSenderId: "1049676598289",
  appId: "1:1049676598289:web:3cfd838df787525496f5b0",
  measurementId: "G-RNZQ85STKK",
   "functions": {
    "source": "functions",
    "runtime": "nodejs16"
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const db = getFirestore(app);
