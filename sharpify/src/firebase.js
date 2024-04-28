// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBu6TdQkJSeqLdm_1EvodP3n1tr8tB91c8",
  authDomain: "sharpify-2c8fc.firebaseapp.com",
  projectId: "sharpify-2c8fc",
  storageBucket: "sharpify-2c8fc.appspot.com",
  messagingSenderId: "887619258069",
  appId: "1:887619258069:web:1a81245296d9bc77de045c",
  measurementId: "G-WBZ5NFQ3V2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);