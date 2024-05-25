import firebase from 'firebase/compat/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO0ifKlBCdyRC6tG4ZVSar3JVFt7zOR_0",
  authDomain: "todo-60aa5.firebaseapp.com",
  projectId: "todo-60aa5",
  storageBucket: "todo-60aa5.appspot.com",
  messagingSenderId: "728860306110",
  appId: "1:728860306110:web:14b9cfb2dd0d60e3b64cef",
  measurementId: "G-GMFK39D7Z9",
};
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
