// =====================================================================
// PENGHUBUNG FRONTEND -> BACKEND (Firebase)
// File ini adalah "jembatan": dijalankan di browser (frontend),
// tetapi tugasnya menyambungkan website ke backend (Firebase).
// Semua file di folder js/services/ berperan sebagai penghubung ini.
// =====================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCd2uWjpDlzY-G-H3MSzAtU8BTj8GAnxfQ",
  authDomain: "komuport-a21a9.firebaseapp.com",
  projectId: "komuport-a21a9",
  storageBucket: "komuport-a21a9.firebasestorage.app",
  messagingSenderId: "464176826092",
  appId: "1:464176826092:web:c6606977ee7e836b46c7c9",
  measurementId: "G-T7G0CMEJR4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
