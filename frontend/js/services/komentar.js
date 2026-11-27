// =========================================
// komentar.js — layanan data komentar (penghubung ke Firestore)
// Komentar disimpan di subkoleksi: laporan/{id}/komentar
// =========================================
import { db } from "./firebase-config.js";
import {
  collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

// Pantau komentar satu laporan (terlama di atas)
export function pantauKomentar(laporanId, callback) {
  const q = query(
    collection(db, "laporan", laporanId, "komentar"),
    orderBy("dibuatPada", "asc")
  );
  return onSnapshot(q, (snap) => {
    const daftar = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(daftar);
  });
}

// Tambah komentar
export async function tambahKomentar(laporanId, isi, profil) {
  await addDoc(collection(db, "laporan", laporanId, "komentar"), {
    isi: isi,
    penulisUid: profil.uid,
    penulisNama: profil.nama,
    dibuatPada: serverTimestamp()
  });
}

// Hapus komentar (khusus admin, dipakai nanti di detail admin)
export async function hapusKomentar(laporanId, komentarId) {
  await deleteDoc(doc(db, "laporan", laporanId, "komentar", komentarId));
}