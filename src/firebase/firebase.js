import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_CHAT_API_KEY,
  authDomain: process.env.REACT_APP_CHAT_AUTHDOMAIN,
  projectId: process.env.REACT_APP_CHAT_PROJECTID,
  storageBucket: process.env.REACT_APP_CHAT_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_CHAT_MESSAGESENDERID,
  appId: process.env.REACT_APP_CHAT_APPID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);