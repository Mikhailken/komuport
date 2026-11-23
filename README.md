# Komuport

Website Pelaporan untuk Warga Martinez — proyek skripsi Mikhail Keene Grady (Universitas Pelita Harapan).

Warga dapat melaporkan kejadian di lingkungan (barang/hewan hilang atau ditemukan, kerusakan fasilitas,
kebersihan, keamanan, kendaraan mencurigakan) beserta foto, menambahkan komentar, dan memantau status laporan.
Admin/Satpam memverifikasi akun warga, memperbarui status laporan, dan menghapus konten yang tidak sesuai.

## Teknologi
- HTML, CSS, JavaScript
- Firebase Authentication (email & password)
- Cloud Firestore (database)
- Netlify (hosting), GitHub (version control)

## Struktur folder
```
komuport/
├── index.html            halaman awal
├── css/style.css         style dasar (mobile-first)
├── js/firebase-config.js koneksi ke Firebase
└── firestore.rules       aturan keamanan database (salinan dari Firebase Console)
```

## Struktur database (Cloud Firestore)

### Koleksi `users` — ID dokumen = UID dari Firebase Authentication
| Field        | Tipe      | Contoh / keterangan                      |
|--------------|-----------|------------------------------------------|
| nama         | string    | "Budi Santoso"                           |
| email        | string    | "budi@gmail.com"                         |
| blok         | string    | "C"                                      |
| noRumah      | string    | "12"                                     |
| role         | string    | "warga" atau "admin"                     |
| status       | string    | "menunggu", "aktif", atau "ditolak"      |
| dibuatPada   | timestamp | waktu daftar                             |

### Koleksi `laporan` — ID dokumen otomatis
| Field          | Tipe      | Contoh / keterangan                                       |
|----------------|-----------|-----------------------------------------------------------|
| judul          | string    | "Kucing oranye hilang"                                    |
| deskripsi      | string    | detail kejadian                                           |
| kategori       | string    | salah satu dari daftar kategori di bawah                  |
| area           | string    | "Blok C"                                                  |
| foto           | string    | foto yang sudah dikompres (format data URL), boleh kosong |
| status         | string    | "Dilaporkan", "Diproses", atau "Selesai"                  |
| pelaporUid     | string    | UID pembuat laporan                                       |
| pelaporNama    | string    | disalin dari users supaya cepat ditampilkan               |
| pelaporRumah   | string    | "C-12"                                                    |
| dibuatPada     | timestamp | waktu laporan dibuat                                      |
| diperbaruiPada | timestamp | waktu status terakhir diubah                              |

Kategori: Barang Hilang, Barang Ditemukan, Hewan Hilang, Hewan Ditemukan, Kerusakan Fasilitas,
Kebersihan, Keamanan, Kendaraan Mencurigakan.

### Sub-koleksi `laporan/{idLaporan}/komentar`
| Field       | Tipe      | Keterangan                 |
|-------------|-----------|----------------------------|
| isi         | string    | isi komentar               |
| penulisUid  | string    | UID penulis                |
| penulisNama | string    | nama penulis               |
| dibuatPada  | timestamp | waktu komentar dibuat      |
