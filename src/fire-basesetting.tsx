// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOUhWhRVzu8WpQEs-y0M-ObOGFTigyZhs",
  authDomain: "chess-5559e.firebaseapp.com",
  projectId: "chess-5559e",
  storageBucket: "chess-5559e.appspot.com",
  messagingSenderId: "146137183938",
  appId: "1:146137183938:web:be9d1edaf24382521c6d5b",
  measurementId: "G-GT46BNB24W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const data = getFirestore(app);
