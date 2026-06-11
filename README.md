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

Berikut adalah *pseudocode* tingkat tinggi yang menjelaskan bagaimana logika utama (Filter Kategori dan Efek Tilt 3D) bekerja di dalam komponen aplikasi ini.

### 1. Logika Komponen Utama (App) & Sistem Filter

```pseudocode
// INISIALISASI DATA
Konstanta PHOTOS = Daftar Objek Foto { id, src, title, category }
Konstanta CATEGORIES = Daftar Unik Kategori dari PHOTOS (ditambah 'Semua Foto')

// KOMPONEN UTAMA (App)
Fungsi App():
    // State Management
    State activeCategory = 'Semua Foto'
    State selectedPhoto = Null (Untuk Lightbox)
    State cursorPosition = Titik Koordinat Mouse Saat Ini

    // Effect: Update Posisi Kursor
    Saat Mouse Bergerak (event):
        Set cursorPosition ke event.X, event.Y

    // Logic: Filtering
    Fungsi getFilteredPhotos():
        Jika activeCategory == 'Semua Foto':
            Kembalikan semua PHOTOS
        Lainnya:
            Kembalikan PHOTOS yang memiliki category == activeCategory

    filteredPhotos = getFilteredPhotos()

    RENDER:
        Tampilkan CustomCursor pada posisi (cursorPosition)
        Tampilkan HeroSection dengan Animasi Masuk

        // Bagian Galeri
        Tampilkan TombolFilter(CATEGORIES):
            Saat Tombol Di-klik -> Set activeCategory = Kategori Terpilih
        
        // Grid Galeri
        Tampilkan GridGaleri:
            Untuk setiap photo di dalam filteredPhotos:
                Tampilkan Komponen PhotoCard(photo)

        // Lightbox
        Jika selectedPhoto TIDAK Null:
            Tampilkan Modal Lightbox dengan selectedPhoto
            Saat Tombol Close Di-klik -> Set selectedPhoto = Null
```

### 2. Logika Komponen Kartu 3D (*3D Tilt Card*)

```pseudocode
// KOMPONEN KARTU FOTO (PhotoCard)
Fungsi PhotoCard(photo):
    // Nilai rotasi fisik (Motion Values)
    Nilai rotasiX = 0
    Nilai rotasiY = 0

    // Effect: Kalkulasi Kemiringan Kartu
    Fungsi handleMouseMove(event):
        Hitung Lebar dan Tinggi Kartu
        Kalkulasi titik X (mouse) relatif terhadap pusat Kartu (persentase)
        Kalkulasi titik Y (mouse) relatif terhadap pusat Kartu (persentase)
        
        // Membalik sumbu untuk efek pergerakan menentang kursor
        Set rotasiY = persentase X * DerajatMaksimum (misal 10 derajat)
        Set rotasiX = persentase Y * DerajatMaksimum (dibalik)

    Fungsi handleMouseLeave():
        Reset rotasiX ke 0
        Reset rotasiY ke 0
        // (Framer Motion 'useSpring' membuat reset ini teranimasi seperti pegas)

    RENDER:
        Bungkus dalam Div dengan Perspective = 1000px
        Div Kontainer Kartu dengan Gaya:
            transform: rotasi(rotasiX, rotasiY)
        
        Isi Kontainer:
            Gambar Asli
            Overlay Gradien + Teks (Muncul saat Hover)
```

### 3. Logika Custom Cursor Emas

```pseudocode
// SISTEM KURSOR KUSTOM
// Terdiri dari 2 elemen: Lingkaran Luar (spring) + Titik Dalam (instant)

State cursorHovered = False
Nilai cursorX = -100   // Awal di luar layar
Nilai cursorY = -100

// Spring Config untuk efek "mengejar" yang lembut
springX = Spring(cursorX, kekakuan=300, redaman=25)
springY = Spring(cursorY, kekakuan=300, redaman=25)

// Event Listener Global
Saat Mouse Bergerak di Window (event):
    Set cursorX = event.clientX
    Set cursorY = event.clientY

RENDER:
    // Lingkaran Luar — mengikuti mouse dengan delay (spring)
    Div.custom-cursor:
        posisi = (springX, springY)
        Jika cursorHovered == True:
            ukuran = 60px, background = emas transparan
        Lainnya:
            ukuran = 30px, border = emas solid

    // Titik Dalam — mengikuti mouse secara instan
    Div.custom-cursor-dot:
        posisi = (cursorX, cursorY)   // tanpa spring
        ukuran = 6px, background = emas solid
```

### 4. Logika Hero Section & Animasi Scroll Indicator

```pseudocode
// HERO SECTION
RENDER HeroSection:
    // Layer 1: Pola Geometris SVG (opacity rendah)
    Div.hero-bg-pattern:
        background = Pola SVG diagonal emas (opacity 3%)

    // Layer 2: Konten Utama dengan Animasi Masuk
    motion.Div.hero-content:
        animasi_awal = { opacity: 0, y: +50px }
        animasi_akhir = { opacity: 1, y: 0 }
        durasi = 1.5 detik, easing = easeOut

        Tampilkan Ikon Kamera (warna emas, glow effect)
        Tampilkan Judul "MEMORI LENSA" (kata "Lensa" = gradient emas)
        Tampilkan Subtitle

    // Layer 3: Indikator Scroll (muncul setelah delay)
    motion.Div.scroll-indicator:
        animasi_muncul = delay 1.5 detik

        Teks "JELAJAHI"
        motion.Div.scroll-line:
            // Animasi loop tak terbatas
            LOOP Selamanya:
                tinggi: 0px → 60px (fade in)
                posisi Y: 0 → +60px (turun)
                opacity: 0 → 1 → 0 (fade out)
                durasi = 2 detik, easing = easeInOut
```

### 5. Logika Lightbox (Modal Layar Penuh)

```pseudocode
// LIGHTBOX MODAL
// Dipicu saat pengguna mengklik salah satu PhotoCard

Saat foto diklik:
    Set selectedPhoto = objek foto yang diklik
    Set document.body.overflow = 'hidden'  // Kunci scroll halaman

Saat selectedPhoto TIDAK Null:
    RENDER AnimatePresence:
        // Backdrop gelap dengan blur
        motion.Div.lightbox:
            animasi_masuk  = { opacity: 0 → 1 }
            animasi_keluar = { opacity: 1 → 0 }
            onClick = tutup lightbox

            // Konten Foto
            motion.Div.lightbox-content:
                animasi_masuk  = { scale: 0.9, opacity: 0, y: +20 }
                animasi_akhir  = { scale: 1.0, opacity: 1, y: 0 }
                tipe_animasi   = spring (damping=25, stiffness=300)
                onClick        = stopPropagation  // Cegah penutupan

                // Tombol Close (X) — pojok kanan atas
                Button.close-btn:
                    onClick = Set selectedPhoto = Null
                    hover   = rotate(90deg), warna terbalik

                // Gambar Resolusi Penuh
                Img.lightbox-img:
                    src = selectedPhoto.src
                    max-height = 75vh, object-fit = contain

                // Info Foto (muncul dengan delay)
                motion.Div.lightbox-info:
                    animasi = { opacity: 0→1, y: 10→0, delay: 0.3s }
                    Tampilkan selectedPhoto.title (font Cinzel, emas)
                    Tampilkan selectedPhoto.category (huruf kapital)

Saat lightbox ditutup:
    Set selectedPhoto = Null
    Set document.body.overflow = 'unset'  // Buka kunci scroll
```

### 6. Logika Bento-Box Grid Layout (CSS)

```pseudocode
// BENTO-BOX GRID — Asymmetrical Layout via CSS Grid

.custom-gallery-grid:
    tipe_layout    = CSS Grid
    kolom          = repeat(auto-fill, min 320px, max 1fr)
    baris_otomatis = tinggi 350px per baris
    jarak_antar    = 30px

// ATURAN UKURAN DINAMIS (hanya layar >= 1024px):
Untuk setiap kartu ke-N dalam grid:
    Jika N mod 4 == 1 (kartu ke-1, 5, 9, ...):
        → Perbesar: span 2 kolom DAN span 2 baris (700px tinggi)
        → Menjadi "Foto Unggulan" berukuran 4x lipat
    
    Jika N mod 7 == 0 (kartu ke-7, 14, ...):
        → Lebarkan: span 2 kolom (tetap 1 baris)
        → Menjadi "Foto Panoramik" berukuran 2x lipat

// EFEK VISUAL KARTU
Setiap .photo-card:
    Default:
        gambar = grayscale 80%, kontras 1.1
        border = emas transparan (opacity 15%)
        bayangan = hitam pekat (35px blur)
    
    Saat Hover:
        gambar → grayscale 0% (warna penuh) + scale 1.05x
        border emas bercahaya muncul (gradient 135°)
        overlay teks naik dari bawah (translateY: 20→0)
```

### 7. Logika Styling Tema Luxury (CSS Variables)

```pseudocode
// SISTEM TEMA BLACK & GOLD

VARIABEL GLOBAL (:root):
    --bg-color      = #080808    // Hitam sangat gelap
    --bg-color-alt  = #121212    // Abu gelap (untuk kontras)
    --text-primary  = #f9f9f9   // Putih lembut
    --text-secondary= #a8a8a8   // Abu terang
    --accent        = #d4af37   // Emas murni (Rich Gold)
    --accent-light  = #f8e5a0   // Emas terang (highlight)
    --accent-dark   = #8c7322   // Emas gelap (shadow)
    --card-bg       = #111111   // Latar kartu
    --border-gold   = gradient(135°, emas → terang → gelap)

LATAR BELAKANG HALAMAN (body):
    Layer 1 = Overlay gelap semi-transparan (opacity 85%)
    Layer 2 = Gambar background.png (cover, fixed, centered)
    → Efek parallax: gambar diam saat halaman di-scroll

TIPOGRAFI:
    Judul (h1-h6) = Font 'Cinzel' (Serif klasik, tebal 700)
    Body text     = Font 'Montserrat' (Sans-serif modern, tipis 300-600)

SCROLLBAR KUSTOM:
    Track  = hitam + garis emas tipis di kiri
    Thumb  = emas gelap → emas terang saat hover

KURSOR:
    Kursor default browser = disembunyikan (cursor: none)
    Diganti dengan elemen React kustom (lihat Pseudocode #3)
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
