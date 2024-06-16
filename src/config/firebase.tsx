import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAOgtBewy9a3SNheAVUaCqMNoee3VR2UIA",
  authDomain: "tgfotet.firebaseapp.com",
  projectId: "tgfotet",
  storageBucket: "tgfotet.appspot.com",
  messagingSenderId: "551245447834",
  appId: "1:551245447834:web:4b4f1a03adf9a2dc7c1523",
  measurementId: "G-6GW2MVFBVN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
//const analytics = getAnalytics(app);



