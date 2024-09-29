import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Authentication uchun import qiling
import { getFirestore } from 'firebase/firestore';

// Firebase loyihangizning konfiguratsiyasi
const firebaseConfig = {
  apiKey: "AIzaSyCHLKNwCVm4YX6kR9T9F2vfunsyKaJdhtw",
  authDomain: "collaborative-presentati-1615a.firebaseapp.com",
  projectId: "collaborative-presentati-1615a",
  storageBucket: "collaborative-presentati-1615a.appspot.com",
  messagingSenderId: "883883119065",
  
};



// Firestore'ni boshlash
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Auth instance
const db = getFirestore(app);

export { auth, db };


