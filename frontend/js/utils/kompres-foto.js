// =========================================
// kompres-foto.js — perkecil foto sebelum disimpan (frontend)
// =========================================
export function kompresFoto(file, lebarMaks = 1000, kualitas = 0.6) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("bukan-gambar"));
        return;
      }
  
      const gambar = new Image();
      const url = URL.createObjectURL(file);
  
      gambar.onload = () => {
        // Perkecil ukuran (lebar maksimal 1000 px)
        const skala = Math.min(1, lebarMaks / gambar.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(gambar.width * skala);
        canvas.height = Math.round(gambar.height * skala);
        canvas.getContext("2d").drawImage(gambar, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
  
        // Ubah ke JPEG; turunkan kualitas kalau masih terlalu besar
        let q = kualitas;
        let hasil = canvas.toDataURL("image/jpeg", q);
        while (hasil.length > 700000 && q > 0.2) {
          q -= 0.1;
          hasil = canvas.toDataURL("image/jpeg", q);
        }
        resolve(hasil);
      };
  
      gambar.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("gagal-baca-foto"));
      };
  
      gambar.src = url;
    });
  }