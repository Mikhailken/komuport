// =========================================
// penyelesaian.js — bukti penyelesaian laporan (penghubung ke Firestore)
// Disimpan di subkoleksi: laporan/{id}/penyelesaian/bukti
// =========================================
import { db } from "./firebase-config.js";
import {
  doc, writeBatch, serverTimestamp, onSnapshot
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

function refBukti(laporanId) {
  return doc(db, "laporan", laporanId, "penyelesaian", "bukti");
}

// Admin: simpan bukti + ubah status menjadi "Selesai" sekaligus
export async function selesaikanLaporan(laporanId, data, profil) {
  const batch = writeBatch(db);
  batch.set(refBukti(laporanId), {
    catatan: data.catatan,
    foto: data.foto,
    adminUid: profil.uid,
    adminNama: profil.nama,
    dibuatPada: serverTimestamp()
  });
  batch.update(doc(db, "laporan", laporanId), {
    status: "Selesai",
    diperbaruiPada: serverTimestamp()
  });
  await batch.commit();
}

// Pantau bukti penyelesaian (real-time)
export function pantauBukti(laporanId, callback) {
  return onSnapshot(refBukti(laporanId), (snap) => {
    callback(snap.exists() ? snap.data() : null);
  });
}