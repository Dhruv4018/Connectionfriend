// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "linkdin-4adb6.firebaseapp.com",
  projectId: "linkdin-4adb6",
  storageBucket: "linkdin-4adb6.firebasestorage.app",
  messagingSenderId: "257488896762",
  appId: "1:257488896762:web:1913f5970f12713798ff43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app,auth}