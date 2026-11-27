// =========================================
// register.js — logika halaman register
// =========================================
import { daftar, pesanError } from "../services/auth.js";

const form = document.getElementById("form-register");
const pesan = document.getElementById("pesan");
const tombol = form.querySelector("button[type='submit']");

function tampilkan(teks, jenis) {
  pesan.textContent = teks;
  pesan.className = "pesan pesan-" + jenis;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nama: form.nama.value.trim(),
    email: form.email.value.trim(),
    blok: form.blok.value.trim(),
    noRumah: form.noRumah.value.trim(),
    password: form.password.value
  };

  if (data.password !== form.konfirmasi.value) {
    tampilkan("Konfirmasi kata sandi tidak sama.", "error");
    return;
  }

  tombol.disabled = true;
  tampilkan("Memproses pendaftaran...", "info");

  try {
    await daftar(data);
    form.reset();
    tampilkan("Pendaftaran berhasil! Akun Anda menunggu persetujuan admin.", "sukses");
  } catch (err) {
    tampilkan(pesanError(err), "error");
  } finally {
    tombol.disabled = false;
  }
});