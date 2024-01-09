// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0enJmwD4wGudAjAATH6AXrH9ibBu_6iw",
  authDomain: "ranci-chess.firebaseapp.com",
  projectId: "ranci-chess",
  storageBucket: "ranci-chess.appspot.com",
  messagingSenderId: "73254110730",
  appId: "1:73254110730:web:43b1e12d70a37f52df81f3",
  measurementId: "G-ZWQ9PXRFXY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, db };