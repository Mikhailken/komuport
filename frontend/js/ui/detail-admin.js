// =========================================
// detail-admin.js — logika Detail Laporan (admin)
// =========================================
import { cekLogin, keluar } from "../services/auth.js";
import { pantauLaporan, ubahStatus, hapusLaporan } from "../services/laporan.js";
import { pantauKomentar, tambahKomentar, hapusKomentar } from "../services/komentar.js";
import { selesaikanLaporan, pantauBukti } from "../services/penyelesaian.js";
import { kompresFoto } from "../utils/kompres-foto.js";
import { buat, formatTanggal, formatWaktu, kelasBadge, buatBlokBukti } from "../utils/tampilan.js";

const profil = await cekLogin("admin");
const id = new URLSearchParams(window.location.search).get("id");

const el = {
  judul: document.getElementById("judul-laporan"),
  meta: document.getElementById("meta-laporan"),
  foto: document.getElementById("foto-laporan"),
  status: document.getElementById("status-laporan"),
  kategori: document.getElementById("kategori-laporan"),
  area: document.getElementById("area-laporan"),
  deskripsi: document.getElementById("deskripsi-laporan"),
  tombolStatus: document.querySelectorAll(".pilihan-status button"),
  tombolHapus: document.getElementById("hapus-laporan"),
  formBukti: document.getElementById("form-bukti"),
  catatan: document.getElementById("catatan-bukti"),
  inputFoto: document.getElementById("foto-bukti"),
  pratinjau: document.getElementById("pratinjau-bukti"),
  teksUpload: document.getElementById("teks-upload-bukti"),
  pesanBukti: document.getElementById("pesan-bukti"),
  blokBukti: document.getElementById("blok-bukti"),
  wadahBukti: document.getElementById("wadah-bukti"),
  komentar: document.getElementById("daftar-komentar"),
  formKomentar: document.getElementById("form-komentar"),
  isiKomentar: document.getElementById("isi-komentar")
};

let laporanSekarang = null;
let fotoBukti = "";
let sedangProsesFoto = false;

// ----- Logout -----
document.getElementById("tombol-logout").addEventListener("click", async (e) => {
  e.preventDefault();
  await keluar();
  window.location.href = "login.html";
});

// ----- Tampilkan laporan -----
function tampilkanLaporan(lap) {
  laporanSekarang = lap;
  if (!lap) {
    el.judul.textContent = "Laporan tidak ditemukan";
    el.meta.textContent = "Laporan mungkin sudah dihapus.";
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

  // Tandai tombol status yang sedang berlaku
  el.tombolStatus.forEach((t) => t.classList.toggle("terpilih", t.dataset.status === lap.status));
}

// ----- Ubah status -----
el.tombolStatus.forEach((tombol) => {
  tombol.addEventListener("click", async () => {
    if (!laporanSekarang) return;
    const baru = tombol.dataset.status;
    const lama = laporanSekarang.status;
    if (baru === lama) return;

    // "Selesai" wajib bukti -> buka form
    if (baru === "Selesai") {
      el.formBukti.hidden = false;
      el.catatan.focus();
      return;
    }

    const tanya = lama === "Selesai"
      ? `Ubah status menjadi "${baru}"? Bukti penyelesaian akan dihapus.`
      : `Ubah status menjadi "${baru}"?`;
    if (!confirm(tanya)) return;

    try {
      await ubahStatus(id, baru);
      tutupFormBukti();
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status. Coba lagi.");
    }
  });
});

// ----- Form bukti penyelesaian -----
function tampilkanPesanBukti(teks, jenis) {
  el.pesanBukti.textContent = teks;
  el.pesanBukti.className = "pesan pesan-" + jenis;
}

function tutupFormBukti() {
  el.formBukti.reset();
  el.formBukti.hidden = true;
  fotoBukti = "";
  el.pratinjau.hidden = true;
  el.teksUpload.textContent = "Klik untuk upload foto bukti";
  tampilkanPesanBukti("", "info");
}

document.getElementById("batal-bukti").addEventListener("click", tutupFormBukti);

el.inputFoto.addEventListener("change", async () => {
  const file = el.inputFoto.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    tampilkanPesanBukti("Ukuran foto maksimal 10 MB.", "error");
    el.inputFoto.value = "";
    return;
  }
  sedangProsesFoto = true;
  el.teksUpload.textContent = "Memproses foto...";
  try {
    fotoBukti = await kompresFoto(file);
    el.pratinjau.src = fotoBukti;
    el.pratinjau.hidden = false;
    el.teksUpload.textContent = "Klik untuk ganti foto";
    tampilkanPesanBukti("", "info");
  } catch (err) {
    fotoBukti = "";
    el.pratinjau.hidden = true;
    el.teksUpload.textContent = "Klik untuk upload foto bukti";
    el.inputFoto.value = "";
    tampilkanPesanBukti("Foto tidak dapat dibaca. Gunakan foto JPG atau PNG.", "error");
  } finally {
    sedangProsesFoto = false;
  }
});

el.formBukti.addEventListener("submit", async (e) => {
  e.preventDefault();
  const catatan = el.catatan.value.trim();

  if (sedangProsesFoto) return tampilkanPesanBukti("Tunggu, foto masih diproses...", "info");
  if (!catatan) return tampilkanPesanBukti("Catatan penyelesaian wajib diisi.", "error");
  if (!fotoBukti) return tampilkanPesanBukti("Foto bukti wajib diunggah.", "error");

  const tombol = el.formBukti.querySelector("button[type='submit']");
  tombol.disabled = true;
  tampilkanPesanBukti("Menyimpan bukti...", "info");
  try {
    await selesaikanLaporan(id, { catatan, foto: fotoBukti }, profil);
    tutupFormBukti();
  } catch (err) {
    console.error(err);
    tampilkanPesanBukti("Gagal menyimpan bukti. Coba lagi.", "error");
  } finally {
    tombol.disabled = false;
  }
});

// ----- Tampilkan bukti (real-time) -----
function tampilkanBukti(bukti) {
  el.wadahBukti.innerHTML = "";
  el.blokBukti.hidden = !bukti;
  if (bukti) el.wadahBukti.append(buatBlokBukti(bukti));
}

// ----- Hapus laporan -----
el.tombolHapus.addEventListener("click", async () => {
  if (!laporanSekarang) return;
  const yakin = confirm(
    `Hapus laporan "${laporanSekarang.judul}"?\nSemua komentar dan bukti ikut terhapus dan tidak bisa dikembalikan.`
  );
  if (!yakin) return;

  el.tombolHapus.disabled = true;
  try {
    await hapusLaporan(id);
    window.location.href = "dashboardadmin.html";
  } catch (err) {
    console.error(err);
    alert("Gagal menghapus laporan. Coba lagi.");
    el.tombolHapus.disabled = false;
  }
});

// ----- Komentar (dengan tombol hapus khusus admin) -----
function tampilkanKomentar(daftar) {
  el.komentar.innerHTML = "";
  if (daftar.length === 0) {
    el.komentar.append(buat("p", "komentar-kosong", "Belum ada komentar."));
    return;
  }
  daftar.forEach((k) => {
    const tombolHapus = buat("button", "hapus-komentar", "Hapus");
    tombolHapus.type = "button";
    tombolHapus.addEventListener("click", async () => {
      if (!confirm(`Hapus komentar dari ${k.penulisNama}?`)) return;
      try {
        await hapusKomentar(id, k.id);
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus komentar.");
      }
    });

    const atas = buat("div", "komentar-atas");
    atas.append(buat("p", "komentar-penulis", `${k.penulisNama} · ${formatWaktu(k.dibuatPada)}`), tombolHapus);

    const kotak = buat("div", "komentar");
    kotak.append(atas, buat("p", "", k.isi));
    el.komentar.append(kotak);
  });
}

el.formKomentar.addEventListener("submit", async (e) => {
  e.preventDefault();
  const isi = el.isiKomentar.value.trim();
  if (!isi) return;
  const tombol = el.formKomentar.querySelector("button");
  tombol.disabled = true;
  try {
    await tambahKomentar(id, isi, profil);
    el.formKomentar.reset();
  } catch (err) {
    console.error(err);
    alert("Gagal mengirim komentar.");
  } finally {
    tombol.disabled = false;
  }
});

// ----- Mulai -----
if (!id) {
  window.location.href = "dashboardadmin.html";
} else {
  pantauLaporan(id, tampilkanLaporan);
  pantauBukti(id, tampilkanBukti);
  pantauKomentar(id, tampilkanKomentar);
}