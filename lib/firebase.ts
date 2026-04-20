import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAbdosgXJhWVI_XDS6PifH6RkpdNZijkoQ",
  authDomain: "tribia-fb08c.firebaseapp.com",
  projectId: "tribia-fb08c",
  storageBucket: "tribia-fb08c.firebasestorage.app",
  messagingSenderId: "1095585601912",
  appId: "1:1095585601912:web:094b11fc85b13dcc1fd08d",
  measurementId: "G-ZC03DCMZKD"
};

// Initialize Firebase (solo una vez)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (solo en cliente)
export const getAnalyticsInstance = () => {
  if (typeof window !== "undefined") {
    return getAnalytics(app);
  }
  return null;
};

export default app;
