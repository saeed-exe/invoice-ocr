// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCXCqWsuXflSW-YQbVqwVrywawa8Z4Y3Gs",
    authDomain: "invoice-ocr-ff51e.firebaseapp.com",
    projectId: "invoice-ocr-ff51e",
    storageBucket: "invoice-ocr-ff51e.firebasestorage.app",
    messagingSenderId: "308080206577",
    appId: "1:308080206577:web:0907232a92d3583b987f50"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);