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
  apiKey: "ISI_DARI_FIREBASE_CONSOLE",
  authDomain: "ISI_DARI_FIREBASE_CONSOLE",
  projectId: "ISI_DARI_FIREBASE_CONSOLE",
  storageBucket: "ISI_DARI_FIREBASE_CONSOLE",
  messagingSenderId: "ISI_DARI_FIREBASE_CONSOLE",
  appId: "ISI_DARI_FIREBASE_CONSOLE",
};

const app = initializeApp(firebaseConfig);

// Dipakai di file lain, contoh:
// import { auth, db } from "./js/firebase-config.js";
export const auth = getAuth(app);
export const db = getFirestore(app);
