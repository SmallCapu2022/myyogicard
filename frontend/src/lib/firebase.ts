// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvhvaq8qUMtloi56YIESv7qATdDLDJYco",
  authDomain: "myyogiapp-578f9.firebaseapp.com",
  projectId: "myyogiapp-578f9",
  storageBucket: "myyogiapp-578f9.appspot.com", 
  appId: "1:350181487945:web:699f269d0892f6d7595698",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
