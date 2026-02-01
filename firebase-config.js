/// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeVcB0fS3ae8A7DiTZa5dd8iQ-btHcHMM",
  authDomain: "central-de-ofertas-6c475.firebaseapp.com",
  projectId: "central-de-ofertas-6c475",
  storageBucket: "central-de-ofertas-6c475.firebasestorage.app",
  messagingSenderId: "239733975406",
  appId: "1:239733975406:web:c361eb3018f843a62c797f",
  measurementId: "G-9XVZZYV3EK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
