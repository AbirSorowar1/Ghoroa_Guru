// src/firebase.js
// ⚠️ IMPORTANT: Replace these values with your own Firebase project credentials
// Go to https://console.firebase.google.com → Create Project → Add Web App → Copy config

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBqDXvKvEsjio0HUItBiV6q4F6xnZ6b7GU",
  authDomain: "ghoroyaguru.firebaseapp.com",
  projectId: "ghoroyaguru",
  storageBucket: "ghoroyaguru.firebasestorage.app",
  messagingSenderId: "659314345889",
  appId: "1:659314345889:web:792b1e7f89c3b3474dade0",
  measurementId: "G-3NKQ8SXZXP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);

export default app;
