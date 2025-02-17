import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // ✅ For autentisering (hvis du skal bruke det)
import { getFirestore } from "firebase/firestore";  // ✅ For Firestore database
import Constats from "expo-constants"; 

const firebaseConfig = {
  apiKey: "AIzaSyBuPmfUoq3qQvKp3q1c2Pxtmlp4cjZ0eak",
  authDomain: "fitplus-6d6ab.firebaseapp.com",
  projectId: "fitplus-6d6ab",
  storageBucket: "fitplus-6d6ab.appspot.com",  // ✅ Korrigert feil URL (bruk `.appspot.com`)
  messagingSenderId: "981549255848",
  appId: "1:981549255848:web:5e996dbeba8f0bf3ed469d",
  measurementId: "G-B2B77NNNYQ"
};

// ✅ Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // ✅ Brukes hvis du implementerer autentisering
export const db = getFirestore(app);  // ✅ Firestore database
export default app;
