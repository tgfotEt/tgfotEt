import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAIIXIO2wwKjN-5wpo4GlZEa0bnQfz4n7s",
  authDomain: "tgfotet-dev.firebaseapp.com",
  projectId: "tgfotet-dev",
  storageBucket: "tgfotet-dev.appspot.com",
  messagingSenderId: "46298626497",
  appId: "1:46298626497:web:4d47b63de642d560fa9740",
  measurementId: "G-RV93EV0F93"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
//const analytics = getAnalytics(app);



