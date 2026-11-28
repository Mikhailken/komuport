// =========================================
// toast.js — kotak notifikasi kecil di pojok layar (frontend)
// =========================================
let wadah = null;
let belumDibaca = 0;
const judulAsli = document.title;

// Tampilkan satu notifikasi. link (opsional) dibuka saat diklik.
export function tampilkanToast(judul, isi, link) {
  if (!wadah) {
    wadah = document.createElement("div");
    wadah.className = "toast-wadah";
    wadah.setAttribute("aria-live", "polite");
    document.body.append(wadah);
  }

  const toast = document.createElement(link ? "a" : "div");
  toast.className = "toast";
  if (link) toast.href = link;

  const teksJudul = document.createElement("strong");
  teksJudul.textContent = "🔔 " + judul;
  const teksIsi = document.createElement("span");
  teksIsi.textContent = isi;

  toast.append(teksJudul, teksIsi);
  wadah.append(toast);

  // Hilang sendiri setelah 5 detik
  setTimeout(() => toast.classList.add("toast-hilang"), 5000);
  setTimeout(() => toast.remove(), 5600);

  // Kalau tab sedang tidak dilihat, tampilkan jumlah di judul tab
  if (document.hidden) {
    belumDibaca++;
    document.title = `(${belumDibaca}) ${judulAsli}`;
  }
}

// Saat tab dibuka lagi, judul kembali normal
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    belumDibaca = 0;
    document.title = judulAsli;
  }
});