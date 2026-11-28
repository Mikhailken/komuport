// =========================================
// dashboard-admin.js — logika Dashboard Admin
// =========================================
import { cekLogin, keluar } from "../services/auth.js";
import { pantauSemuaLaporan } from "../services/laporan.js";
import { buat, buatKartuLaporan } from "../utils/tampilan.js";
import { tampilkanToast } from "../utils/toast.js";

await cekLogin("admin");

const wadah = document.getElementById("daftar-laporan");
const inputCari = document.getElementById("cari");
const stat = {
  total: document.getElementById("stat-total"),
  belum: document.getElementById("stat-belum"),
  proses: document.getElementById("stat-proses"),
  selesai: document.getElementById("stat-selesai")
};

let semuaLaporan = [];

// Logout
document.getElementById("tombol-logout").addEventListener("click", async (e) => {
  e.preventDefault();
  await keluar();
  window.location.href = "login.html";
});

// Hitung statistik
function hitungStatistik() {
  const jumlah = (s) => semuaLaporan.filter((l) => l.status === s).length;
  stat.total.textContent = semuaLaporan.length;
  stat.belum.textContent = jumlah("Belum Selesai");
  stat.proses.textContent = jumlah("Diproses");
  stat.selesai.textContent = jumlah("Selesai");
}

// Tampilkan daftar sesuai kata pencarian
function tampilkan() {
  const kata = inputCari.value.trim().toLowerCase();
  const daftar = kata
    ? semuaLaporan.filter((l) =>
        [l.judul, l.kategori, l.area, l.deskripsi, l.pelaporNama, l.pelaporRumah, l.status]
          .join(" ").toLowerCase().includes(kata))
    : semuaLaporan;

  wadah.innerHTML = "";
  if (daftar.length === 0) {
    wadah.append(buat("p", "kosong", kata ? "Tidak ada laporan yang cocok." : "Belum ada laporan."));
    return;
  }
  daftar.forEach((lap) => wadah.append(buatKartuLaporan(lap, "detail-laporan-admin.html")));
}

// Cari saat mengetik
inputCari.addEventListener("input", tampilkan);

// Real-time: laporan baru langsung muncul, statistik ikut berubah, + notifikasi
pantauSemuaLaporan((daftar, perubahan, pertama) => {
  semuaLaporan = daftar;
  hitungStatistik();
  tampilkan();

  if (pertama) return;
  perubahan
    .filter((p) => p.jenis === "added")
    .forEach((p) => tampilkanToast(
      `Laporan baru dari ${p.pelaporNama}`,
      `${p.judul} · ${p.area}`,
      `detail-laporan-admin.html?id=${p.id}`
    ));
});