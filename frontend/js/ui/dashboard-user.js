// =========================================
// dashboard-user.js — logika Dashboard Warga
// =========================================
import { cekLogin, keluar } from "../services/auth.js";
import { pantauSemuaLaporan } from "../services/laporan.js";
import { buat, formatTanggal, kelasBadge } from "../utils/tampilan.js";

await cekLogin("warga");

const wadah = document.getElementById("daftar-laporan");
const tombolFilter = document.querySelectorAll(".filter-item");

let semuaLaporan = [];
let filterAktif = "Semua";

// Logout
document.getElementById("tombol-logout").addEventListener("click", async (e) => {
  e.preventDefault();
  await keluar();
  window.location.href = "login.html";
});

// Satu kartu laporan
function buatKartu(lap) {
  const kartu = buat("article", "kartu");

  const foto = buat("div", "kartu-foto");
  if (lap.foto) {
    const img = buat("img");
    img.src = lap.foto;
    img.alt = lap.judul;
    img.loading = "lazy";
    foto.append(img);
  }

  const link = buat("a", "", "Lihat Detail →");
  link.href = `detail-laporanuser.html?id=${lap.id}`;

  const bawah = buat("div", "kartu-bawah");
  bawah.append(buat("span", "badge " + kelasBadge(lap.status), lap.status), link);

  const isi = buat("div", "kartu-isi");
  isi.append(
    buat("p", "kartu-tanggal", formatTanggal(lap.dibuatPada)),
    buat("h3", "", lap.judul),
    buat("p", "kartu-lokasi", "Lokasi: " + lap.area),
    bawah
  );

  kartu.append(foto, isi);
  return kartu;
}

// Tampilkan sesuai filter
function tampilkan() {
  const daftar = filterAktif === "Semua"
    ? semuaLaporan
    : semuaLaporan.filter((l) => l.status === filterAktif);

  wadah.innerHTML = "";
  if (daftar.length === 0) {
    const teks = filterAktif === "Semua"
      ? "Belum ada laporan."
      : `Tidak ada laporan berstatus "${filterAktif}".`;
    wadah.append(buat("p", "kosong", teks));
    return;
  }
  daftar.forEach((lap) => wadah.append(buatKartu(lap)));
}

// Klik filter
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", () => {
    tombolFilter.forEach((t) => t.classList.remove("aktif"));
    tombol.classList.add("aktif");
    filterAktif = tombol.dataset.filter;
    tampilkan();
  });
});

// Real-time: setiap ada laporan baru/berubah, daftar diperbarui otomatis
pantauSemuaLaporan((daftar) => {
  semuaLaporan = daftar;
  tampilkan();
});