// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1_2sNFr94zNIhSfyHeZou0GLuEMpvYLU",
  authDomain: "restaurant-order-app-1637f.firebaseapp.com",
  projectId: "restaurant-order-app-1637f",
  storageBucket: "restaurant-order-app-1637f.appspot.com",
  messagingSenderId: "814400432083",
  appId: "1:814400432083:web:8f84d9722457a00080f126",
  measurementId: "G-LB68DLRN6Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;