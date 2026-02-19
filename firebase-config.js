import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDwmEeVZtw9qGNMmNbQyecLmA_ES7mBQQ8",
    authDomain: "todo-pro-860d0.firebaseapp.com",
    projectId: "todo-pro-860d0",
    storageBucket: "todo-pro-860d0.firebasestorage.app",
    messagingSenderId: "186725287652",
    appId: "1:186725287652:web:04dbea67d4651f04920ef1",
    measurementId: "G-TTTM0T04K5"
};

const app = initializeApp(firebaseConfig);
window.db = getFirestore(app);
window.fb = { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDocs };
window.dispatchEvent(new Event('firebaseReady'));