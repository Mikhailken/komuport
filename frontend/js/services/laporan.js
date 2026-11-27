// =========================================
// laporan.js — layanan data laporan (penghubung ke Firestore)
// =========================================
import { db } from "./firebase-config.js";
import {
  collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, where
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

// Simpan laporan baru dengan status awal "Belum Selesai"
export async function buatLaporan(data, profil) {
  const ref = await addDoc(collection(db, "laporan"), {
    judul: data.judul,
    kategori: data.kategori,
    area: data.area,
    deskripsi: data.deskripsi,
    foto: data.foto || "",
    status: "Belum Selesai",
    pelaporUid: profil.uid,
    pelaporNama: profil.nama,
    pelaporRumah: `${profil.blok} No. ${profil.noRumah}`,
    dibuatPada: serverTimestamp(),
    diperbaruiPada: serverTimestamp()
  });
  return ref.id;
}

// Pantau semua laporan secara real-time (terbaru di atas)
export function pantauSemuaLaporan(callback) {
  const q = query(collection(db, "laporan"), orderBy("dibuatPada", "desc"));
  return onSnapshot(q, (snap) => {
    const daftar = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(daftar);
  });
}

// Pantau satu laporan berdasarkan ID (real-time, misal saat status diubah admin)
export function pantauLaporan(id, callback) {
  return onSnapshot(doc(db, "laporan", id), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

// Pantau laporan milik satu warga (untuk halaman Profil)
export function pantauLaporanSaya(uid, callback) {
  const q = query(collection(db, "laporan"), where("pelaporUid", "==", uid));
  return onSnapshot(q, (snap) => {
    const daftar = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Urutkan di browser (terbaru di atas)
    daftar.sort((a, b) => (b.dibuatPada?.seconds || 0) - (a.dibuatPada?.seconds || 0));
    callback(daftar);
  });
}