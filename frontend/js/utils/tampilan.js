// =========================================
// tampilan.js — fungsi bantu tampilan (frontend)
// =========================================

// Buat elemen HTML; teks diisi pakai textContent (aman dari kode jahil)
export function buat(tag, kelas, teks) {
    const el = document.createElement(tag);
    if (kelas) el.className = kelas;
    if (teks) el.textContent = teks;
    return el;
  }
  
  // Timestamp Firestore -> "27 November 2026"
  export function formatTanggal(ts) {
    if (!ts) return "Baru saja";
    return ts.toDate().toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    });
  }
  
  // Status laporan -> class badge (warna)
  export function kelasBadge(status) {
    if (status === "Selesai") return "badge-selesai";
    if (status === "Diproses") return "badge-proses";
    return "badge-belum";
  }
