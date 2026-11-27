// =========================================
// login.js — logika halaman login
// =========================================
import { masuk, pesanError } from "../services/auth.js";

const form = document.getElementById("form-login");
const pesan = document.getElementById("pesan");
const tombol = form.querySelector("button[type='submit']");

function tampilkan(teks, jenis) {
  pesan.textContent = teks;
  pesan.className = "pesan pesan-" + jenis;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  tombol.disabled = true;
  tampilkan("Memeriksa akun...", "info");

  try {
    const profil = await masuk(form.email.value.trim(), form.password.value);
    // Arahkan sesuai peran
    if (profil.role === "admin") {
      window.location.href = "dashboardadmin.html";
    } else {
      window.location.href = "dashboarduser.html";
    }
  } catch (err) {
    tampilkan(pesanError(err), "error");
    tombol.disabled = false;
  }
});