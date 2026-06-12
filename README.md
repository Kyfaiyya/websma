# Memori Lensa - Interactive Gallery Website ✨

Sebuah website galeri interaktif eksklusif yang dirancang dengan tema *Black & Gold* mewah ala Captain Barbershop. Website ini dibangun untuk menampilkan koleksi dokumentasi kegiatan dengan sentuhan animasi dinamis, *bento-box grid layout*, dan efek visual kelas atas.

## Fitur Utama 🌟

1. **Luxurious Black & Gold Theme**: Menggunakan palet warna gelap berkelas dengan gradien emas, dipadukan dengan tipografi mewah (Cinzel & Montserrat) dan latar belakang gambar *custom* (`background.png`).
2. **Asymmetrical Bento-Box Grid**: Mengabaikan susunan standar dengan memanfaatkan CSS Grid responsif di mana gambar tertentu memiliki proporsi lebih besar secara otomatis.
3. **Interactive 3D Photo Cards**: Setiap kartu foto dilengkapi dengan efek kemiringan 3D (*3D Tilt Effect*) yang merespons posisi kursor *mouse*, transisi *grayscale* ke warna, dan bingkai emas bercahaya.
4. **Custom Glowing Cursor**: Kursor bawaan *browser* diganti dengan titik emas interaktif yang akan membesar saat diarahkan ke elemen yang dapat diklik.
5. **Seamless Category Filtering**: Kemampuan untuk memfilter foto berdasarkan kegiatan secara dinamis dengan animasi pergeseran halus (*layout animations*) menggunakan `framer-motion`.
6. **Cinematic Lightbox**: Mode layar penuh saat foto diklik dengan latar belakang efek *blur* elegan.

## Teknologi yang Digunakan 💻

- **React.js** (Vite)
- **Framer Motion** (Untuk fisika pergerakan kursor, animasi *layout*, dan *spring animations*)
- **Lucide React** (Untuk ikonografi elegan)
- **Vanilla CSS** (Untuk *grid layout*, efek *glassmorphism*, dan variabel tema *luxury*)

## Cara Menjalankan Proyek 🚀

1. Pastikan Node.js sudah terinstal.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:5174/` (atau port yang tertera) di browser kamu.

---

## Arsitektur & Pseudocode 🧠

Berikut adalah *pseudocode* tingkat tinggi yang menjelaskan bagaimana logika utama (Sistem Filter, Efek Tilt 3D, Kursor Kustom, Canvas Background, Sistem Masuk & Interaksi Komentar/Likes) bekerja di dalam komponen aplikasi ini.

### 1. Logika Komponen Utama (App), Sistem Masuk, & Persistensi

```pseudocode
// DATA INTI
Konstanta PHOTOS = Daftar Objek Foto { id, src, title, category, description }
Konstanta CATEGORIES = ['Semua Foto', ...kategori unik dari PHOTOS]

// KOMPONEN UTAMA (App)
Fungsi App():
    // State Management
    State visitorName = ""
    State hasEntered = False
    State showVisitors = False
    State visitorsLog = []
    State likes = {}          // Format: { photoId: jumlah_like }
    State comments = {}       // Format: { photoId: [{ name, text }] }
    State commentText = ""
    State selectedPhoto = Null
    State activeCategory = "Semua Foto"
    State cursorHovered = False

    // Kursor Kustom (Motion Values)
    cursorX = MotionValue(-100)
    cursorY = MotionValue(-100)
    springX = Spring(cursorX, damping=25, stiffness=300)
    springY = Spring(cursorY, damping=25, stiffness=300)

    // Efek Samping 1: Memuat Data dari LocalStorage pada Mount
    EfekPadaMount():
        Set visitorName = LocalStorage.getItem('visitorName')
        Jika visitorName ada:
            Set hasEntered = True
        Set visitorsLog = LocalStorage.getItem('visitorsLog') atau []
        Set likes = LocalStorage.getItem('photoLikes') atau {}
        Set comments = LocalStorage.getItem('photoComments') atau {}

        Saat Mouse Bergerak di Window (event):
            Set cursorX = event.clientX
            Set cursorY = event.clientY

    // Efek Samping 2: Kunci Scroll Halaman
    EfekPadaState(selectedPhoto, hasEntered, showVisitors):
        Jika selectedPhoto aktif ATAU hasEntered bernilai False ATAU showVisitors aktif:
            Kunci scroll halaman (document.body.style.overflow = 'hidden')
        Lainnya:
            Buka kunci scroll halaman (document.body.style.overflow = 'unset')

    // Penanganan Masuk Pengunjung (Welcome Screen)
    Fungsi handleEnter(name):
        Set visitorName = name
        Set hasEntered = True
        Simpan visitorName ke LocalStorage
        
        logBaru = { name: name, time: waktu_sekarang_string() }
        visitorsLogBaru = [...visitorsLog, logBaru]
        Set visitorsLog = visitorsLogBaru
        Simpan visitorsLogBaru ke LocalStorage

    // Penanganan Keluar (Logout)
    Fungsi handleLogout():
        Set visitorName = ""
        Set hasEntered = False
        Hapus 'visitorName' dari LocalStorage

    // Penanganan Suka (Like)
    Fungsi handleLike(photoId):
        likesBaru = objek salinan dari likes
        likesBaru[photoId] = (likesBaru[photoId] atau 0) + 1
        Set likes = likesBaru
        Simpan likesBaru ke LocalStorage ('photoLikes')

    // Penanganan Tambah Komentar
    Fungsi handleAddComment(photoId):
        Jika commentText yang di-trim kosong: kembalikan
        komentarBaru = { name: visitorName, text: commentText.trim() }
        daftarKomentarFoto = comments[photoId] atau []
        commentsBaru = objek salinan dari comments dengan daftarKomentarFoto diperbarui
        Set comments = commentsBaru
        Simpan commentsBaru ke LocalStorage ('photoComments')
        Set commentText = ""

    // Pemfilteran Foto
    Fungsi getFilteredPhotos():
        Jika activeCategory == 'Semua Foto':
            Kembalikan semua PHOTOS
        Lainnya:
            Kembalikan PHOTOS yang memiliki category == activeCategory
```

### 2. Logika Komponen Selamat Datang (WelcomeScreen)

```pseudocode
// KOMPONEN WELCOME SCREEN (WelcomeScreen)
Fungsi WelcomeScreen({ onEnter }):
    State name = ""

    Fungsi handleSubmit(event):
        Cegah default submit browser
        Jika name setelah di-trim tidak kosong:
            Panggil onEnter(name)

    RENDER:
        Div Kontainer Utama (dengan transisi fade-out saat keluar):
            Tampilkan Pola Latar Belakang (glowing lines)
            Card Form Masuk (dengan transisi masuk scale-up & slide-up):
                Tampilkan Ikon Kamera (Emas, Glow)
                Tampilkan Judul "Selamat Datang" & Deskripsi
                Form Input:
                    Input Teks (value = name, placeholder = "Nama Anda...", autofocus)
                    Tombol type="submit" teks "Masuk"
```

### 3. Logika Komponen Kartu 3D (*3D Tilt Card*)

```pseudocode
// KOMPONEN KARTU FOTO (PhotoCard)
Fungsi PhotoCard(photo):
    // Nilai rotasi fisik (Motion Values)
    Nilai x = 0
    Nilai y = 0
    mouseXSpring = Spring(x, stiffness=300, damping=30)
    mouseYSpring = Spring(y, stiffness=300, damping=30)

    // Transformasi posisi ke rotasi derajat (-10 sampai +10 derajat)
    rotateX = Transform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
    rotateY = Transform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

    Fungsi handleMouseMove(event):
        Hitung batas kotak elemen (getBoundingClientRect)
        Kalkulasi mouseX, mouseY relatif terhadap kiri atas kartu
        Kalkulasi persentase posisi mouse relatif dari pusat kartu:
            xPct = (mouseX / lebar_kartu) - 0.5
            yPct = (mouseY / tinggi_kartu) - 0.5
        Set x = xPct
        Set y = yPct

    Fungsi handleMouseLeave():
        Reset x ke 0
        Reset y ke 0
        Panggil onMouseLeave() untuk reset kursor kustom

    RENDER:
        Bungkus dalam Div dengan layout animatif (Framer Motion)
        Div Kartu 3D dengan style: rotateX, rotateY
            Dengarkan event: MouseMove, MouseLeave, MouseEnter, Click
            Gambar (src = photo.src, lazy loading)
            Overlay Gradien Hover (Zoom icon + detail judul/kategori)
```

### 4. Logika Canvas Background Garis Mewah (*Luxury Lines Background*)

```pseudocode
// KOMPONEN CANVASS BACKGROUND (LuxuryLines)
Fungsi LuxuryLines():
    Ref canvasRef

    Fungsi draw():
        Inisialisasi 12 objek garis acak:
            { x, y, panjang, kecepatan, sudut, transparansi, lebar, drift, fase }
        
        Fungsi resizer():
            Sesuaikan lebar canvas ke window.innerWidth
            Sesuaikan tinggi canvas ke scrollHeight dokumen

        Fungsi animate():
            Bersihkan canvas dengan clearRect
            Perbarui variabel waktu (time)
            Untuk setiap garis:
                Hitung kerlipan (shimmer) berbasis sin(time + fase)
                Hitung pergeseran gelombang horizontal (waveOffset)
                
                Buat Gradien Linear 2D (ujung 1 -> tengah -> ujung 2)
                Tambahkan titik warna emas (rgba 212, 175, 55) dengan opasitas dinamis
                
                Gambar path garis dari (x1, y1) ke (x2, y2)
                Kurangi koordinat y (garis melayang ke atas) berdasarkan kecepatan
                Tambahkan sedikit drift horizontal pada koordinat x
                
                Jika garis keluar di atas layar:
                    Pindahkan koordinat y ke bawah layar
                    Acak ulang koordinat x
            
            Panggil requestAnimationFrame(animate) untuk melanjutkan loop animasi

    PADA MOUNT:
        Jalankan draw() dan simpan ID animasi
        Tambahkan event listener window 'resize' ke resizer()
        Saat UNMOUNT:
            Batalkan requestAnimationFrame
            Hapus event listener window 'resize'
```

### 5. Logika Lightbox Interaktif (Komentar & Likes)

```pseudocode
// LIGHTBOX MODAL & SIDEBAR INTERAKTIF
Fungsi Lightbox({ selectedPhoto, onClose, likes, onLike, comments, onAddComment }):
    RENDER:
        Div Backdrop gelap dengan blur (AnimatePresence untuk keluar masuk mulus)
            Klik di Backdrop -> Panggil onClose()

            Div Kontainer Layout Utama Lightbox (scale & spring animation):
                Tombol Close (X) -> Panggil onClose()

                // Bagian Utama: Tampilan Foto & Info Detil
                Div Bagian Foto:
                    Tampilkan Gambar (selectedPhoto.src)
                    Tampilkan Detail Foto (Title, Category, Description)
                    Tombol Suka (Like):
                        Ikon Hati (diisi warna emas jika disukai, border emas jika belum)
                        Jumlah Suka = likes[selectedPhoto.id] atau 0
                        Saat Klik -> Panggil onLike(selectedPhoto.id)

                // Bagian Sidebar: Daftar & Input Komentar
                Div Bagian Sidebar:
                    Judul "Komentar"
                    Daftar Komentar:
                        Untuk setiap komentar di comments[selectedPhoto.id]:
                            Tampilkan Nama Komentator: Isi Teks Komentar
                        Jika kosong -> Tampilkan "Belum ada komentar"
                    Area Input Komentar:
                        Input Teks (value = commentText, placeholder="Tambahkan komentar...")
                        Tombol Kirim (Send) -> Panggil onAddComment(selectedPhoto.id)
                        (Mendukung pengiriman lewat tombol 'Enter')
```

### 6. Logika Custom Cursor Emas

```pseudocode
// SISTEM KURSOR KUSTOM
// Terdiri dari 2 elemen: Lingkaran Luar (spring) + Titik Dalam (instant)

RENDER:
    // Lingkaran Luar — mengikuti mouse dengan delay (spring)
    Div.custom-cursor:
        posisi = (springX, springY)
        Kelas tambahan = 'hovering' jika cursorHovered == True
        CSS Efek:
            Jika hovering: ukuran = 60px, background = emas transparan (glow)
            Jika biasa: ukuran = 30px, border = emas solid

    // Titik Dalam — mengikuti mouse secara instan
    Div.custom-cursor-dot:
        posisi = (cursorX, cursorY)   // tanpa spring
        ukuran = 6px, background = emas solid
```

### 7. Logika Bento-Box Grid Layout (CSS)

```pseudocode
// BENTO-BOX GRID — Asymmetrical Layout via CSS Grid

.custom-gallery-grid:
    tipe_layout    = CSS Grid
    kolom          = repeat(auto-fill, minmax(320px, 1fr))
    baris_otomatis = tinggi 350px per baris
    jarak_antar    = 30px

// ATURAN UKURAN DINAMIS (menggunakan selektor :nth-child):
Untuk setiap kartu ke-N dalam grid:
    Jika N mod 4 == 1 (kartu ke-1, 5, 9, ...):
        → Perbesar: span 2 kolom DAN span 2 baris (tinggi sekitar 730px)
        → Menjadi "Foto Unggulan" berukuran 4x lipat
    
    Jika N mod 7 == 0 (kartu ke-7, 14, ...):
        → Lebarkan: span 2 kolom (tetap 1 baris, tinggi 350px)
        → Menjadi "Foto Panoramik" berukuran 2x lipat
```

### 8. Logika Styling Tema Luxury (CSS Variables)

```css
/* SISTEM VARIABEL CSS GLOBAL TEMA BLACK & GOLD */
:root {
  --bg-color: #080808;         /* Hitam sangat gelap */
  --bg-color-alt: #121212;     /* Latar header/modal kontras */
  --text-primary: #f9f9f9;     /* Putih lembut */
  --text-secondary: #a8a8a8;   /* Abu-abu terang */
  --accent: #d4af37;           /* Rich Gold */
  --accent-light: #f8e5a0;     /* Emas terang bercahaya */
  --accent-dark: #8c7322;      /* Emas gelap bayangan */
  --card-bg: #111111;          /* Latar belakang bento card */
}
```

---

## Struktur Direktori 📁
```
📦websiteazza
 ┣ 📂public
 ┃ ┣ 📂fotokegiatan          # File gambar dokumentasi asli
 ┃ ┃ ┣ 📜Artur Project.jpeg
 ┃ ┃ ┣ 📜Bukber X-6.jpeg
 ┃ ┃ ┣ 📜Exprada.jpeg
 ┃ ┃ ┣ 📜Felisia.jpeg
 ┃ ┃ ┣ 📜Inagurasi angkatan 18 (2).jpeg
 ┃ ┃ ┣ 📜Mandala Charity Day.jpeg
 ┃ ┃ ┣ 📜Outbound Tarbawi.jpeg
 ┃ ┃ ┣ 📜Pramuka Mingguan.jpeg
 ┃ ┃ ┣ 📜Teachers Day.jpeg
 ┃ ┃ ┗ 📜Teater Chroma.jpeg
 ┃ ┣ 📜background.png        # Latar belakang gelap premium
 ┃ ┗ 📜favicon.svg
 ┣ 📂src
 ┃ ┣ 📜App.jsx               # Komponen utama (Logika + UI)
 ┃ ┣ 📜App.css               # Styling komponen (Cards, Hero, Lightbox)
 ┃ ┣ 📜index.css             # Styling global (Tema, Font, Variabel)
 ┃ ┗ 📜main.jsx              # Entry point React
 ┣ 📜index.html              # HTML template
 ┣ 📜package.json
 ┣ 📜vite.config.js
 ┗ 📜README.md
```

---

## Alur Interaksi Pengguna 🎯

```
┌─────────────────────────────────────────────────┐
│                  HALAMAN DIBUKA                  │
│         Animasi Hero Section (1.5 detik)         │
│        Kursor emas mengikuti pergerakan          │
└──────────────────────┬──────────────────────────┘
                       │ scroll ke bawah
                       ▼
┌─────────────────────────────────────────────────┐
│              GALERI BENTO-BOX GRID               │
│  ┌──────┐ ┌──────┐ ┌──────┐                     │
│  │ BESAR│ │kecil │ │kecil │  ← Ukuran dinamis   │
│  │ 2x2  │ ├──────┤ ├──────┤                     │
│  │      │ │kecil │ │kecil │  ← 3D Tilt on hover │
│  └──────┘ └──────┘ └──────┘                     │
│  ← Grayscale → Warna saat hover                 │
└──────────────────────┬──────────────────────────┘
                       │ klik filter
                       ▼
┌─────────────────────────────────────────────────┐
│         FILTER KATEGORI AKTIF                    │
│  [Semua Foto] [Proyek] [Sosial] [Seremoni] ...  │
│  → Grid beranimasi ulang (layout animation)      │
└──────────────────────┬──────────────────────────┘
                       │ klik foto
                       ▼
┌─────────────────────────────────────────────────┐
│              LIGHTBOX MODAL                      │
│  ┌─────────────────────────────────────┐  [X]   │
│  │                                     │        │
│  │         FOTO RESOLUSI PENUH         │        │
│  │                                     │        │
│  └─────────────────────────────────────┘        │
│          Judul Foto — KATEGORI                   │
│    Klik di luar area / tombol X = Tutup          │
└─────────────────────────────────────────────────┘
```
