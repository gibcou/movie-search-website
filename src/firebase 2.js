// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_Xe-kDzmD-g-GdDRdFuerJG7rByF6LHs",
  authDomain: "movie-search-52431.firebaseapp.com",
  projectId: "movie-search-52431",
  storageBucket: "movie-search-52431.firebasestorage.app",
  messagingSenderId: "909605100212",
  appId: "1:909605100212:web:fcd84230dcf46bd39855e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;