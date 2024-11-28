import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AlzaSyDPuMU63cpNG6Yg4a6HLbqGFHJb6I3Q484",
  authDomain: "integrador-a519f.firebaseapp.com",
  projectId: "integrador-a519f",
  storageBucket: "integrador-a519f.appspot.com",
  messagingSenderId: "52571677766",
  appId: "1:52571677766:android:6a88d674617dddcfe4d647"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore (app);