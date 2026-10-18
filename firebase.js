import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB_3TN44ch2T1-zmOgV8xvlq7r-jR1M8xU",
  authDomain: "allena-admin.firebaseapp.com",
  databaseURL:
    "https://allena-admin-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "allena-admin",
  storageBucket: "allena-admin.firebasestorage.app",
  messagingSenderId: "529498448950",
  appId: "1:529498448950:web:6a836ae249353dcb796497",
  measurementId: "G-V8RJ0DB6HG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);

export default app;