// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCfsxylM-7-uBfud61Fw7k8gFJH93Chps",
  authDomain: "cctv-27f73.firebaseapp.com",
  projectId: "cctv-27f73",
  storageBucket: "cctv-27f73.firebasestorage.app",
  messagingSenderId: "188739774769",
  appId: "1:188739774769:web:a81b1911d8a6f31b156810",
  measurementId: "G-0GPRPTLECS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };