import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { X, ZoomIn, Camera } from 'lucide-react';
import './App.css';

const photos = [
  { id: 1, src: '/fotokegiatan/Artur Project.jpeg', title: 'Artur Project', category: 'Proyek & Event' },
  { id: 2, src: '/fotokegiatan/Bukber X-6.jpeg', title: 'Buka Bersama X-6', category: 'Sosial & Amal' },
  { id: 3, src: '/fotokegiatan/Exprada.jpeg', title: 'Exprada', category: 'Proyek & Event' },
  { id: 4, src: '/fotokegiatan/Felisia.jpeg', title: 'Felisia', category: 'Kelas & Outdoor' },
  { id: 5, src: '/fotokegiatan/Inagurasi angkatan 18 (2).jpeg', title: 'Inagurasi Angkatan 18', category: 'Seremoni' },
  { id: 6, src: '/fotokegiatan/Mandala Charity Day.jpeg', title: 'Mandala Charity', category: 'Sosial & Amal' },
  { id: 7, src: '/fotokegiatan/Outbound Tarbawi.jpeg', title: 'Outbound Tarbawi', category: 'Kelas & Outdoor' },
  { id: 8, src: '/fotokegiatan/Pramuka Mingguan.jpeg', title: 'Pramuka Mingguan', category: 'Ekstrakurikuler' },
  { id: 9, src: '/fotokegiatan/Teachers Day.jpeg', title: 'Hari Guru', category: 'Seremoni' },
  { id: 10, src: '/fotokegiatan/Teater Chroma.jpeg', title: 'Teater Chroma', category: 'Ekstrakurikuler' },
];

const categories = ['Semua Foto', ...new Set(photos.map(p => p.category))];



// 3D Tilt Card Component
const PhotoCard = ({ photo, onClick, onMouseEnter, onMouseLeave }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if(onMouseLeave) onMouseLeave();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      className="photo-card-wrapper"
    >
      <motion.div
        className="photo-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={onMouseEnter}
        onClick={() => onClick(photo)}
        style={{
          rotateX,
          rotateY,
        }}
      >
        <img src={photo.src} alt={photo.title} loading="lazy" />
        <div className="photo-overlay">
          <div className="photo-info">
            <h3>{photo.title}</h3>
            <p>{photo.category}</p>
          </div>
          <ZoomIn color="#d4af37" size={24} />
        </div>
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua Foto');
  const [cursorHovered, setCursorHovered] = useState(false);

  // Custom Cursor state
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedPhoto]);

  const filteredPhotos = activeCategory === 'Semua Foto' 
    ? photos 
    : photos.filter(photo => photo.category === activeCategory);

  return (
    <div className="app-container">
      {/* Custom Cursor */}
      <motion.div 
        className={`custom-cursor ${cursorHovered ? 'hovering' : ''}`}
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      <motion.div 
        className="custom-cursor-dot"
        style={{ x: cursorX, y: cursorY }}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Camera size={48} className="hero-logo-icon" />
          <h1 className="hero-title">Memori <span>Lensa</span></h1>
          <p className="hero-subtitle">
            Koleksi Eksklusif Mengabadikan Momen Berharga
          </p>
        </motion.div>

        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span>Jelajahi</span>
          <motion.div 
            className="scroll-line"
            animate={{ 
              height: ["0px", "60px", "60px"],
              opacity: [0, 1, 0],
              y: [0, 0, 60]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <motion.div 
          className="gallery-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2>Arsip <span>Kegiatan</span></h2>
          <div className="divider"></div>
        </motion.div>

        {/* Filters */}
        <div className="filter-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="custom-gallery-grid">
          <AnimatePresence>
            {filteredPhotos.map((photo) => (
              <PhotoCard 
                key={photo.id}
                photo={photo}
                onClick={setSelectedPhoto}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div 
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              <button 
                className="close-btn"
                onClick={() => setSelectedPhoto(null)}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <X size={24} />
              </button>
              <img 
                src={selectedPhoto.src} 
                alt={selectedPhoto.title} 
                className="lightbox-img" 
              />
              <motion.div 
                className="lightbox-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3>{selectedPhoto.title}</h3>
                <p>{selectedPhoto.category}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
