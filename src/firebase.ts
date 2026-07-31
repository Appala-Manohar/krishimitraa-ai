import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBV_62ZqWCZfeXVhxLS_Njo5HzJgWjqcXg",
  authDomain: "krishimitraa-ai.firebaseapp.com",
  projectId: "krishimitraa-ai",
  storageBucket: "krishimitraa-ai.firebasestorage.app",
  messagingSenderId: "1074930442557",
  appId: "1:1074930442557:web:55b699873bf3d4d8dde554"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();