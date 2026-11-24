# Komuport

Website Pelaporan untuk Warga Martinez — proyek skripsi Mikhail Keene Grady (Universitas Pelita Harapan).

## Pembagian frontend dan backend

```
komuport/
├── frontend/                  ← FRONTEND: semua yang dijalankan di browser pengguna
│   ├── index.html             halaman awal
│   ├── tes-koneksi.html       halaman tes koneksi ke backend
│   ├── css/style.css          tampilan (warna, ukuran, tata letak)
│   └── js/
│       ├── ui/                interaksi tampilan saja (tanpa Firebase)
│       └── services/          penghubung frontend ke backend (Firebase)
│
├── backend/                   ← BACKEND: aturan dan logika di sisi server
│   ├── firestore.rules        aturan keamanan database (dipasang di Firebase Console)
│   └── netlify/functions/     kode Node.js untuk email otomatis
│
└── netlify.toml               pengaturan Netlify (folder website & folder fungsi)
```

| Lapisan | Teknologi | Berjalan di |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Browser pengguna (dihosting Netlify) |
| Penghubung | Firebase JavaScript SDK (`js/services/`) | Browser pengguna |
| Backend | Firebase Authentication, Cloud Firestore + Security Rules | Server Google (Firebase) |
| Backend | Node.js (Netlify Functions) | Server Netlify |

## Struktur database (Cloud Firestore)

### Koleksi `users` — ID dokumen = UID dari Firebase Authentication
| Field | Tipe | Keterangan |
|---|---|---|
| nama | string | nama lengkap |
| email | string | email akun |
| blok | string | contoh "C" |
| noRumah | string | contoh "12" |
| role | string | "warga" atau "admin" |
| status | string | "menunggu", "aktif", atau "ditolak" |
| dibuatPada | timestamp | waktu daftar |

### Koleksi `laporan` — ID dokumen otomatis
| Field | Tipe | Keterangan |
|---|---|---|
| judul | string | judul laporan |
| deskripsi | string | detail kejadian |
| kategori | string | Barang Hilang, Barang Ditemukan, Hewan Hilang, Hewan Ditemukan, Kerusakan Fasilitas, Kebersihan, Keamanan, Kendaraan Mencurigakan |
| area | string | contoh "Blok C" |
| foto | string | foto terkompresi (data URL), boleh kosong |
| status | string | "Dilaporkan", "Diproses", atau "Selesai" |
| pelaporUid | string | UID pembuat laporan |
| pelaporNama | string | disalin dari users |
| pelaporRumah | string | contoh "C-12" |
| dibuatPada | timestamp | waktu laporan dibuat |
| diperbaruiPada | timestamp | waktu status terakhir diubah |

### Sub-koleksi `laporan/{idLaporan}/komentar`
| Field | Tipe | Keterangan |
|---|---|---|
| isi | string | isi komentar |
| penulisUid | string | UID penulis |
| penulisNama | string | nama penulis |
| dibuatPada | timestamp | waktu komentar dibuat |
