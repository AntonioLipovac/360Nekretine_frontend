// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nekretnine360-7638c.firebaseapp.com",
  projectId: "nekretnine360-7638c",
  storageBucket: "nekretnine360-7638c.appspot.com",
  messagingSenderId: "746987447674",
  appId: "1:746987447674:web:97a088a7b362830d8f22c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };