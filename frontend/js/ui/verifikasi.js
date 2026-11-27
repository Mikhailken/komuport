// =========================================
// verifikasi.js — logika halaman Verifikasi Akun (admin)
// =========================================
import { cekLogin, keluar } from "../services/auth.js";
import { pantauAkunMenunggu, ubahStatusAkun } from "../services/users.js";

const wadah = document.getElementById("daftar-akun");
const jumlah = document.getElementById("jumlah-menunggu");

// Tombol logout
document.getElementById("tombol-logout").addEventListener("click", async (e) => {
  e.preventDefault();
  await keluar();
  window.location.href = "login.html";
});

// Ubah Timestamp Firestore menjadi "27 November 2026"
function formatTanggal(ts) {
  if (!ts) return "-";
  return ts.toDate().toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });
}

// Pembuat elemen kecil: isi teks pakai textContent (aman dari kode jahil)
function buat(tag, kelas, teks) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks) el.textContent = teks;
  return el;
}

// Satu kartu akun
function buatKartu(akun) {
  const kartu = buat("article", "akun-item");

  const data = buat("div", "akun-data");
  data.append(
    buat("h3", "", akun.nama),
    buat("p", "", akun.email),
    buat("p", "akun-rumah",
      `${akun.blok} No. ${akun.noRumah} · Daftar ${formatTanggal(akun.dibuatPada)}`)
  );

  const aksi = buat("div", "akun-aksi");
  const tombolSetuju = buat("button", "tombol", "Setujui");
  const tombolTolak = buat("button", "tombol-tolak", "Tolak");
  tombolSetuju.type = "button";
  tombolTolak.type = "button";

  tombolSetuju.addEventListener("click", () => proses(akun.uid, "aktif", tombolSetuju, tombolTolak));
  tombolTolak.addEventListener("click", () => {
    if (confirm(`Tolak pendaftaran ${akun.nama}?`)) {
      proses(akun.uid, "ditolak", tombolSetuju, tombolTolak);
    }
  });

  aksi.append(tombolSetuju, tombolTolak);
  kartu.append(data, aksi);
  return kartu;
}

// Kirim perubahan status ke Firestore
async function proses(uid, statusBaru, ...tombol) {
  tombol.forEach((t) => (t.disabled = true));
  try {
    await ubahStatusAkun(uid, statusBaru);
    // Tidak perlu hapus kartu manual: listener real-time akan memperbarui daftar
  } catch (err) {
    alert("Gagal memperbarui status akun. Coba lagi.");
    tombol.forEach((t) => (t.disabled = false));
  }
}

// Tampilkan seluruh daftar
function tampilkan(daftar) {
  daftar.sort((a, b) => (a.dibuatPada?.seconds || 0) - (b.dibuatPada?.seconds || 0));
  jumlah.textContent = daftar.length;
  wadah.innerHTML = "";

  if (daftar.length === 0) {
    wadah.append(buat("p", "kosong", "Tidak ada akun yang menunggu verifikasi."));
    return;
  }
  daftar.forEach((akun) => wadah.append(buatKartu(akun)));
}

// Jalankan: pastikan admin, lalu pantau data secara real-time
await cekLogin("admin");
pantauAkunMenunggu(tampilkan);