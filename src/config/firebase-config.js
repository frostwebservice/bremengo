import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//GetAuth Method is used to Configure our app to use Firebase Authentication
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAKiPW-prVCWq2x3aGlYsvVP8O2ORbF0T8",
  authDomain: "bremengo-staging.firebaseapp.com",
  projectId: "bremengo-staging",
  storageBucket: "bremengo-staging.appspot.com",
  messagingSenderId: "242550789124",
  appId: "1:242550789124:web:fff6fd37081a6e5b07d151",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
