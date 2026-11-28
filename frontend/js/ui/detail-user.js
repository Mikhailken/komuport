// =========================================
// detail-user.js — logika halaman Detail Laporan (warga)
// =========================================
import { cekLogin, keluar } from "../services/auth.js";
import { pantauLaporan } from "../services/laporan.js";
import { pantauKomentar, tambahKomentar } from "../services/komentar.js";
import { pantauBukti } from "../services/penyelesaian.js";
import { buat, formatTanggal, formatWaktu, kelasBadge, buatBlokBukti } from "../utils/tampilan.js";

const profil = await cekLogin("warga");

// Ambil ID laporan dari alamat: detail-laporanuser.html?id=xxxx
const id = new URLSearchParams(window.location.search).get("id");

// Logout
document.getElementById("tombol-logout").addEventListener("click", async (e) => {
  e.preventDefault();
  await keluar();
  window.location.href = "login.html";
});

// Elemen halaman
const el = {
  judul: document.getElementById("judul-laporan"),
  meta: document.getElementById("meta-laporan"),
  foto: document.getElementById("foto-laporan"),
  status: document.getElementById("status-laporan"),
  kategori: document.getElementById("kategori-laporan"),
  area: document.getElementById("area-laporan"),
  deskripsi: document.getElementById("deskripsi-laporan"),
  komentar: document.getElementById("daftar-komentar"),
  form: document.getElementById("form-komentar"),
  isi: document.getElementById("isi-komentar")
};

// ----- Tampilkan isi laporan -----
function tampilkanLaporan(lap) {
  if (!lap) {
    el.judul.textContent = "Laporan tidak ditemukan";
    el.meta.textContent = "Laporan mungkin sudah dihapus oleh admin.";
    el.form.hidden = true;
    return;
  }

  el.judul.textContent = lap.judul;
  el.meta.textContent =
    `Tanggal ${formatTanggal(lap.dibuatPada)} · Pelapor: ${lap.pelaporNama} · ${lap.pelaporRumah}`;
  el.status.textContent = lap.status;
  el.status.className = "badge " + kelasBadge(lap.status);
  el.kategori.textContent = lap.kategori;
  el.area.textContent = lap.area;
  el.deskripsi.textContent = lap.deskripsi;

  el.foto.innerHTML = "";
  if (lap.foto) {
    const img = buat("img");
    img.src = lap.foto;
    img.alt = lap.judul;
    el.foto.append(img);
  } else {
    el.foto.append(buat("p", "kosong", "Tidak ada foto"));
  }
}

// ----- Tampilkan komentar -----
function tampilkanKomentar(daftar) {
  el.komentar.innerHTML = "";
  if (daftar.length === 0) {
    el.komentar.append(buat("p", "komentar-kosong", "Belum ada komentar."));
    return;
  }
  daftar.forEach((k) => {
    const kotak = buat("div", "komentar");
    kotak.append(
      buat("p", "komentar-penulis", `${k.penulisNama} · ${formatWaktu(k.dibuatPada)}`),
      buat("p", "", k.isi)
    );
    el.komentar.append(kotak);
  });
}

// ----- Kirim komentar -----
el.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const isi = el.isi.value.trim();
  if (!isi) return;

  const tombol = el.form.querySelector("button");
  tombol.disabled = true;
  try {
    await tambahKomentar(id, isi, profil);
    el.form.reset();
  } catch (err) {
    console.error(err);
    alert("Gagal mengirim komentar. Coba lagi.");
  } finally {
    tombol.disabled = false;
  }
});
// ----- Tampilkan bukti penyelesaian (real-time) -----
const blokBukti = document.getElementById("blok-bukti");
const wadahBukti = document.getElementById("wadah-bukti");

function tampilkanBukti(bukti) {
  wadahBukti.innerHTML = "";
  blokBukti.hidden = !bukti;
  if (bukti) wadahBukti.append(buatBlokBukti(bukti));
}
// ----- Mulai -----
if (!id) {
  window.location.href = "dashboarduser.html";
} else {
  pantauLaporan(id, tampilkanLaporan);
  pantauBukti(id, tampilkanBukti);        // BARU
  pantauKomentar(id, tampilkanKomentar);
}