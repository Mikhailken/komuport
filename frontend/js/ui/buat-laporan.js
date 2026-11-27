// =========================================
// buat-laporan.js — logika halaman Buat Laporan (warga)
// =========================================
import { cekLogin, keluar } from "../services/auth.js";
import { buatLaporan } from "../services/laporan.js";
import { kompresFoto } from "../utils/kompres-foto.js";

// Hanya warga yang sudah aktif boleh membuka halaman ini
const profil = await cekLogin("warga");

const form = document.getElementById("form-laporan");
const pesan = document.getElementById("pesan");
const tombol = form.querySelector("button[type='submit']");
const inputFoto = document.getElementById("foto");
const pratinjau = document.getElementById("pratinjau");
const teksUpload = document.getElementById("teks-upload");

let fotoSiap = "";          // hasil kompres (data URL)
let sedangProsesFoto = false;

function tampilkan(teks, jenis) {
  pesan.textContent = teks;
  pesan.className = "pesan pesan-" + jenis;
}

// Logout
document.getElementById("tombol-logout").addEventListener("click", async (e) => {
  e.preventDefault();
  await keluar();
  window.location.href = "login.html";
});

// Saat foto dipilih: kompres lalu tampilkan pratinjau
inputFoto.addEventListener("change", async () => {
  const file = inputFoto.files[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    tampilkan("Ukuran foto maksimal 10 MB.", "error");
    inputFoto.value = "";
    return;
  }

  sedangProsesFoto = true;
  teksUpload.textContent = "Memproses foto...";

  try {
    fotoSiap = await kompresFoto(file);
    pratinjau.src = fotoSiap;
    pratinjau.hidden = false;
    teksUpload.textContent = "Klik untuk ganti foto";
    tampilkan("", "info");
  } catch (err) {
    fotoSiap = "";
    pratinjau.hidden = true;
    teksUpload.textContent = "Klik untuk upload foto";
    inputFoto.value = "";
    tampilkan("Foto tidak dapat dibaca. Gunakan foto JPG atau PNG.", "error");
  } finally {
    sedangProsesFoto = false;
  }
});

// Kirim laporan
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (sedangProsesFoto) {
    tampilkan("Tunggu, foto masih diproses...", "info");
    return;
  }

  const data = {
    judul: form.judul.value.trim(),
    kategori: form.kategori.value,
    area: form.area.value.trim(),
    deskripsi: form.deskripsi.value.trim(),
    foto: fotoSiap
  };

  tombol.disabled = true;
  tampilkan("Mengirim laporan...", "info");

  try {
    await buatLaporan(data, profil);
    tampilkan("Laporan berhasil dikirim!", "sukses");
    setTimeout(() => (window.location.href = "dashboarduser.html"), 1200);
  } catch (err) {
    console.error(err);
    tampilkan("Gagal mengirim laporan. Coba lagi.", "error");
    tombol.disabled = false;
  }
});