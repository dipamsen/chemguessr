// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn_E9L9JYJeM0caKYBLJdGAk7bL-mSClc",
  authDomain: "fun-planet-95e02.firebaseapp.com",
  databaseURL: "https://fun-planet-95e02-default-rtdb.firebaseio.com",
  projectId: "fun-planet-95e02",
  storageBucket: "fun-planet-95e02.appspot.com",
  messagingSenderId: "881612924662",
  appId: "1:881612924662:web:09a44ee7f5c6c7150a6ed7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
