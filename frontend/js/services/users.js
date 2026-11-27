// =========================================
// users.js — layanan data akun (backend)
// =========================================
import { db } from "./firebase-config.js";
import {
  collection, query, where, onSnapshot, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

// Pantau akun berstatus "menunggu" secara real-time
export function pantauAkunMenunggu(callback) {
  const q = query(collection(db, "users"), where("status", "==", "menunggu"));
  return onSnapshot(q, (snap) => {
    const daftar = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    callback(daftar);
  });
}

// Admin menyetujui ("aktif") atau menolak ("ditolak") akun
export async function ubahStatusAkun(uid, statusBaru) {
  await updateDoc(doc(db, "users", uid), { status: statusBaru });
}