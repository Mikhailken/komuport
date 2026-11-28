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

// Timestamp Firestore -> "27 Nov 2026, 15.48"
export function formatWaktu(ts) {
    if (!ts) return "Baru saja";
    return ts.toDate().toLocaleString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }
  
// Kartu laporan (dipakai di Dashboard, Profil, dan Dashboard Admin)
// halamanDetail: "detail-laporanuser.html" atau "detail-laporan-admin.html"
export function buatKartuLaporan(lap, halamanDetail) {
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
    link.href = `${halamanDetail}?id=${lap.id}`;
  
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
  
// Kotak "Bukti Penyelesaian" (dipakai di detail admin & detail warga)
export function buatBlokBukti(bukti) {
  const kotak = buat("div", "bukti");
  if (bukti.foto) {
    const img = buat("img", "bukti-foto");
    img.src = bukti.foto;
    img.alt = "Foto bukti penyelesaian";
    kotak.append(img);
  }
  kotak.append(
    buat("p", "", bukti.catatan),
    buat("p", "bukti-meta", `Diselesaikan oleh ${bukti.adminNama} · ${formatWaktu(bukti.dibuatPada)}`)
  );
  return kotak;
}