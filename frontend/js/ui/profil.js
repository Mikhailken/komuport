// =========================================
// profil.js — logika halaman Profil (warga)
// =========================================
import { cekLogin, keluar } from "../services/auth.js";
import { pantauLaporanSaya } from "../services/laporan.js";
import { buat, formatTanggal, buatKartuLaporan } from "../utils/tampilan.js";

const profil = await cekLogin("warga");

// Logout
document.getElementById("tombol-logout").addEventListener("click", async (e) => {
  e.preventDefault();
  await keluar();
  window.location.href = "login.html";
});

// Isi data akun (sudah didapat dari cekLogin, tidak perlu baca Firestore lagi)
document.getElementById("profil-nama").textContent = profil.nama;
document.getElementById("profil-email").textContent = profil.email;
document.getElementById("profil-rumah").textContent = `${profil.blok} No. ${profil.noRumah}`;
document.getElementById("profil-terdaftar").textContent = formatTanggal(profil.dibuatPada);

// Laporan milik akun ini (real-time)
const wadah = document.getElementById("laporan-saya");
const jumlah = document.getElementById("jumlah-laporan-saya");

pantauLaporanSaya(profil.uid, (daftar) => {
  jumlah.textContent = daftar.length;
  wadah.innerHTML = "";

  if (daftar.length === 0) {
    wadah.append(buat("p", "kosong", "Kamu belum pernah membuat laporan."));
    return;
  }
  daftar.forEach((lap) => wadah.append(buatKartuLaporan(lap, "detail-laporanuser.html")));
});