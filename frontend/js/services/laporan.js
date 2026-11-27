// =========================================
// laporan.js — layanan data laporan (backend)
// =========================================
import { db } from "./firebase-config.js";
import {
  collection, addDoc, serverTimestamp
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