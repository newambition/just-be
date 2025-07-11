import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDmOYR-HeY_myGys0SLfL6t-c-ccZcYiuc",
  authDomain: "just-be-31b1b.firebaseapp.com",
  projectId: "just-be-31b1b",
  storageBucket: "just-be-31b1b.firebasestorage.app",
  messagingSenderId: "257339766317",
  appId: "1:257339766317:web:67358e88b87c52ab136aa4",
  measurementId: "G-5WG5FZZ4B1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
