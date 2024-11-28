import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVbDlRSyv_dgdASbimDIKHMbzucMqr0Bc",
  authDomain: "proyecto-api-77aef.firebaseapp.com",
  projectId: "proyecto-api-77aef",
  storageBucket: "proyecto-api-77aef.firebasestorage.app",
  messagingSenderId: "578062343413",
  appId: "1:578062343413:web:580467311524646bbdf9bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore (app);