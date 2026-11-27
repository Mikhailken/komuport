// =========================================
// auth.js — layanan autentikasi (backend)
// =========================================
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

// Daftar akun baru: buat akun di Authentication + simpan profil di Firestore
export async function daftar(data) {
  const hasil = await createUserWithEmailAndPassword(auth, data.email, data.password);
  await setDoc(doc(db, "users", hasil.user.uid), {
    nama: data.nama,
    email: data.email,
    blok: data.blok,
    noRumah: data.noRumah,
    role: "warga",
    status: "menunggu",
    dibuatPada: serverTimestamp()
  });
  // Belum boleh masuk sebelum disetujui admin
  await signOut(auth);
}

// Masuk: cek email/kata sandi, lalu cek status akun
export async function masuk(email, password) {
  const hasil = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", hasil.user.uid));

  if (!snap.exists()) {
    await signOut(auth);
    throw new Error("profil-tidak-ada");
  }

  const profil = snap.data();
  if (profil.status !== "aktif") {
    await signOut(auth);
    throw new Error("status-" + profil.status);
  }
  return profil;
}

export async function keluar() {
  await signOut(auth);
}

// Ubah kode error menjadi pesan bahasa Indonesia
export function pesanError(err) {
  const kode = err.code || err.message;
  const daftarPesan = {
    "auth/email-already-in-use": "Email sudah terdaftar.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/weak-password": "Kata sandi minimal 6 karakter.",
    "auth/invalid-credential": "Email atau kata sandi salah.",
    "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti.",
    "auth/network-request-failed": "Koneksi internet bermasalah.",
    "status-menunggu": "Akun Anda masih menunggu persetujuan admin.",
    "status-ditolak": "Pendaftaran akun Anda ditolak. Hubungi pengurus perumahan.",
    "profil-tidak-ada": "Data akun tidak ditemukan."
  };
  return daftarPesan[kode] || "Terjadi kesalahan. Silakan coba lagi.";
}
// Pelindung halaman: wajib login, status aktif, dan (opsional) peran tertentu
export function cekLogin(roleWajib) {
  return new Promise((resolve) => {
    const berhenti = onAuthStateChanged(auth, async (user) => {
      berhenti();

      if (!user) {
        window.location.href = "login.html";
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists() || snap.data().status !== "aktif") {
        await signOut(auth);
        window.location.href = "login.html";
        return;
      }

      const profil = { uid: user.uid, ...snap.data() };

      // Salah halaman? Kembalikan ke dashboard yang sesuai
      if (roleWajib && profil.role !== roleWajib) {
        window.location.href = profil.role === "admin"
          ? "dashboardadmin.html"
          : "dashboarduser.html";
        return;
      }

      resolve(profil);
    });
  });
}