// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import {} from "fire"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX-FrAHkAsCg3sm_pdbVKnXKVjLDBDPUI",
  authDomain: "woocommerce-project-379412.firebaseapp.com",
  projectId: "woocommerce-project-379412",
  storageBucket: "woocommerce-project-379412.appspot.com",
  messagingSenderId: "869848185834",
  appId: "1:869848185834:web:229b9fd84411426b5a9093",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export default db;

// FIREBASE CREDENTIALS FOR SKILLFLOWHQ
// const firebaseConfig = {
//   apiKey: "AIzaSyBDHP--iXLQeKF_BJllU2fcyJ-dRJnIWh4",
//   authDomain: "skillflowhq.firebaseapp.com",
//   projectId: "skillflowhq",
//   storageBucket: "skillflowhq.appspot.com",
//   messagingSenderId: "316382856358",
//   appId: "1:316382856358:web:f8da958f9eac4d518be067",
// };
