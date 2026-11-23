// =====================================================================
// Komuport - koneksi ke Firebase
// File ini di-import oleh semua halaman yang butuh Firebase.
// GANTI isi firebaseConfig dengan punyamu dari Firebase Console:
// Project settings > General > Your apps > SDK setup and configuration > Config
// (apiKey Firebase memang boleh terlihat di kode website; keamanan data
//  dijaga oleh Firestore Security Rules, bukan oleh apiKey.)
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

// Dipakai di file lain, contoh:
// import { auth, db } from "./js/firebase-config.js";
export const auth = getAuth(app);
export const db = getFirestore(app);
