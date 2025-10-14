// Import des SDK Firebase nécessaires
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuration Firebase (⚠️ attention : storageBucket corrigé)
const firebaseConfig = {
  apiKey: "AIzaSyAvhvaq8qUMtloi56YIESv7qATdDLDJYco",
  authDomain: "myyogiapp-578f9.firebaseapp.com",
  projectId: "myyogiapp-578f9",
  storageBucket: "myyogiapp-578f9.appspot.com", 
  appId: "1:350181487945:web:699f269d0892f6d7595698",
};

// Initialisation unique de l’app Firebase
const app = initializeApp(firebaseConfig);

// Export des modules pour le reste de ton code
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
