const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');

const photoCardStart = content.indexOf('// 3D Tilt Card Component');
const luxuryLinesStart = content.indexOf('// Animated Luxury Lines Background');
const appStart = content.indexOf('function App() {');

const photoCardCode = content.substring(photoCardStart, luxuryLinesStart);
const luxuryLinesCode = content.substring(luxuryLinesStart, appStart);

const newAppJsx = `import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, ZoomIn, Camera, Heart, Users, Send } from 'lucide-react';
import './App.css';

const photos = [
  { id: 1, src: '/fotokegiatan/Artur Project.jpeg', title: 'Artur Project', category: 'Proyek & Event' },
  { id: 2, src: '/fotokegiatan/Bukber X-6.jpeg', title: 'Buka Bersama X-6', category: 'Kelas & Outdoor' },
  { id: 3, src: '/fotokegiatan/Exprada.jpeg', title: 'Exprada', category: 'Proyek & Event' },
  { id: 4, src: '/fotokegiatan/Felisia.jpeg', title: 'Felisia', category: 'Kelas & Outdoor' },
  { id: 5, src: '/fotokegiatan/Inagurasi angkatan 18 (2).jpeg', title: 'Inagurasi Angkatan 18', category: 'Angkatan 18' },
  { id: 6, src: '/fotokegiatan/Mandala Charity Day.jpeg', title: 'Mandala Charity', category: 'Proyek & Event' },
  { id: 7, src: '/fotokegiatan/Outbound Tarbawi.jpeg', title: 'Outbound Tarbawi', category: 'Kelas & Outdoor' },
  { id: 8, src: '/fotokegiatan/Pramuka Mingguan.jpeg', title: 'Pramuka Mingguan', category: 'Ekstrakurikuler' },
  { id: 9, src: '/fotokegiatan/Teachers Day.jpeg', title: 'Hari Guru', category: 'Kelas & Outdoor' },
  { id: 10, src: '/fotokegiatan/Teater Chroma.jpeg', title: 'Teater Chroma', category: 'Ekstrakurikuler' },
];

const categories = ['Semua Foto', ...new Set(photos.map(p => p.category))];

const WelcomeScreen = ({ onEnter }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onEnter(name.trim());
    }
  };

  return (
    <motion.div 
      className="welcome-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="welcome-bg-pattern" />
      <motion.div 
        className="welcome-card"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Camera size={48} className="hero-logo-icon" style={{margin: '0 auto 1.5rem', display: 'block'}} />
        <h2 style={{fontFamily: 'Cinzel, serif', color: '#d4af37', marginBottom: '1rem'}}>Selamat Datang</h2>
        <p style={{marginBottom: '2rem', color: '#a8a8a8'}}>Silakan masukkan nama Anda untuk menjelajahi memori kami</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nama Anda..." 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="welcome-input"
            autoFocus
          />
          <button type="submit" className="welcome-btn">Masuk</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

${photoCardCode}

${luxuryLinesCode}

function App() {
  const [visitorName, setVisitorName] = useState('');
  const [hasEntered, setHasEntered] = useState(false);
  const [showVisitors, setShowVisitors] = useState(false);
  
  const [visitorsLog, setVisitorsLog] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua Foto');
  const [cursorHovered, setCursorHovered] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const savedName = localStorage.getItem('visitorName');
    const savedLogs = JSON.parse(localStorage.getItem('visitorsLog')) || [];
    const savedLikes = JSON.parse(localStorage.getItem('photoLikes')) || {};
    const savedComments = JSON.parse(localStorage.getItem('photoComments')) || {};
    
    if (savedName) {
      setVisitorName(savedName);
      setHasEntered(true);
    }
    setVisitorsLog(savedLogs);
    setLikes(savedLikes);
    setComments(savedComments);

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    if (selectedPhoto || !hasEntered || showVisitors) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedPhoto, hasEntered, showVisitors]);

  const handleEnter = (name) => {
    setVisitorName(name);
    setHasEntered(true);
    localStorage.setItem('visitorName', name);
    
    const newLog = [...visitorsLog, { name, time: new Date().toLocaleString() }];
    setVisitorsLog(newLog);
    localStorage.setItem('visitorsLog', JSON.stringify(newLog));
  };

  const handleLike = (photoId) => {
    const newLikes = { ...likes, [photoId]: (likes[photoId] || 0) + 1 };
    setLikes(newLikes);
    localStorage.setItem('photoLikes', JSON.stringify(newLikes));
  };

  const handleAddComment = (photoId) => {
    if (!commentText.trim()) return;
    const newComment = { name: visitorName, text: commentText.trim() };
    const photoComments = comments[photoId] || [];
    const newComments = { ...comments, [photoId]: [...photoComments, newComment] };
    setComments(newComments);
    localStorage.setItem('photoComments', JSON.stringify(newComments));
    setCommentText('');
  };

  const filteredPhotos = activeCategory === 'Semua Foto' 
    ? photos 
    : photos.filter(photo => photo.category === activeCategory);

  return (
    <div className="app-container">
      <LuxuryLines />

      <motion.div 
        className={\`custom-cursor \${cursorHovered ? 'hovering' : ''}\`}
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      <motion.div 
        className="custom-cursor-dot"
        style={{ x: cursorX, y: cursorY }}
      />

      <AnimatePresence>
        {!hasEntered && (
          <WelcomeScreen key="welcome" onEnter={handleEnter} />
        )}
      </AnimatePresence>

      {hasEntered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <header className="app-header">
            <div className="user-greeting">
              Halo, <span>{visitorName}</span>
            </div>
            <button 
              className="visitors-btn" 
              onClick={() => setShowVisitors(true)}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              <Users size={18} />
              <span>Log Pengunjung</span>
            </button>
          </header>

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

            <div className="filter-container">
              {categories.map((category) => (
                <button
                  key={category}
                  className={\`filter-btn \${activeCategory === category ? 'active' : ''}\`}
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

          <AnimatePresence>
            {showVisitors && (
              <motion.div 
                className="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowVisitors(false)}
              >
                <motion.div 
                  className="visitors-modal"
                  onClick={e => e.stopPropagation()}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                >
                  <button className="close-btn" onClick={() => setShowVisitors(false)}
                    onMouseEnter={() => setCursorHovered(true)}
                    onMouseLeave={() => setCursorHovered(false)}
                  >
                    <X size={24} />
                  </button>
                  <h3>Siapa saja yang sudah pernah kesini?</h3>
                  <div className="visitors-list">
                    {visitorsLog.map((v, i) => (
                      <div key={i} className="visitor-item">
                        <span className="visitor-name">{v.name}</span>
                        <span className="visitor-time">{v.time}</span>
                      </div>
                    ))}
                    {visitorsLog.length === 0 && <p style={{textAlign: 'center', color: '#a8a8a8'}}>Belum ada pengunjung</p>}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {selectedPhoto && (
              <motion.div
                className="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPhoto(null)}
              >
                <motion.div 
                  className="lightbox-layout"
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
                  
                  <div className="lightbox-main">
                    <img 
                      src={selectedPhoto.src} 
                      alt={selectedPhoto.title} 
                      className="lightbox-img" 
                    />
                    <div className="lightbox-info">
                      <h3 style={{fontFamily: 'Cinzel, serif', color: '#d4af37', fontSize: '1.5rem'}}>{selectedPhoto.title}</h3>
                      <p style={{color: '#a8a8a8', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase'}}>{selectedPhoto.category}</p>
                      <button 
                        className="like-btn" 
                        onClick={() => handleLike(selectedPhoto.id)}
                        onMouseEnter={() => setCursorHovered(true)}
                        onMouseLeave={() => setCursorHovered(false)}
                      >
                        <Heart 
                          fill={likes[selectedPhoto.id] ? "#d4af37" : "transparent"} 
                          color="#d4af37" 
                          size={18}
                        />
                        <span>{likes[selectedPhoto.id] || 0} Suka</span>
                      </button>
                    </div>
                  </div>

                  <div className="lightbox-sidebar">
                    <h4>Komentar</h4>
                    <div className="comments-list">
                      {(comments[selectedPhoto.id] || []).map((c, i) => (
                        <div key={i} className="comment-item">
                          <strong>{c.name}:</strong> <span>{c.text}</span>
                        </div>
                      ))}
                      {(!comments[selectedPhoto.id] || comments[selectedPhoto.id].length === 0) && (
                        <p style={{textAlign: 'center', color: '#a8a8a8', marginTop: '1rem'}}>Belum ada komentar.</p>
                      )}
                    </div>
                    <div className="comment-input-area">
                      <input 
                        type="text" 
                        placeholder="Tambahkan komentar..." 
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => {
                          if(e.key === 'Enter') handleAddComment(selectedPhoto.id);
                        }}
                      />
                      <button onClick={() => handleAddComment(selectedPhoto.id)}
                        onMouseEnter={() => setCursorHovered(true)}
                        onMouseLeave={() => setCursorHovered(false)}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default App;
`;

fs.writeFileSync(appJsxPath, newAppJsx);

const appCssPath = path.join(__dirname, 'src', 'App.css');
const newCss = `
/* New Styles */
.welcome-screen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--bg-color);
  background-image: 
    linear-gradient(rgba(8, 8, 8, 0.9), rgba(8, 8, 8, 0.9)),
    url('/background.png');
  background-size: cover;
  background-position: center;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-card {
  background: var(--card-bg);
  padding: 3rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0,0,0,0.8);
  max-width: 400px;
  width: 90%;
  position: relative;
  overflow: hidden;
}

.welcome-input {
  width: 100%;
  padding: 1rem;
  margin: 1.5rem 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text-primary);
  font-family: 'Montserrat', sans-serif;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
}

.welcome-input:focus {
  border-color: var(--accent);
}

.welcome-btn {
  width: 100%;
  padding: 1rem;
  background: var(--accent);
  color: #000;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  cursor: none;
}

.welcome-btn:hover {
  background: var(--accent-light);
  transform: translateY(-2px);
}

/* App Header */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(8, 8, 8, 0.9) 0%, transparent 100%);
  pointer-events: auto;
}

.user-greeting {
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.user-greeting span {
  color: var(--accent);
}

.visitors-btn {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  transition: all 0.3s ease;
  pointer-events: auto;
}

.visitors-btn:hover {
  background: var(--accent);
  color: #000;
}

/* Visitors Modal */
.visitors-modal {
  background: var(--bg-color-alt);
  border: 1px solid var(--accent);
  padding: 2.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.visitors-modal h3 {
  color: var(--accent);
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: 'Cinzel', serif;
}

.visitors-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 10px;
}

.visitor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.visitor-name {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.1rem;
}

.visitor-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Lightbox Layout for Comments */
.lightbox-layout {
  display: flex;
  background: var(--bg-color-alt);
  border: 1px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 0 50px rgba(212, 175, 55, 0.1);
  width: 95vw;
  max-width: 1200px;
  height: 85vh;
  position: relative;
}

.lightbox-main {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #050505;
  position: relative;
}

.lightbox-img {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

.lightbox-info {
  margin-top: 1.5rem;
  text-align: center;
  width: 100%;
}

.like-btn {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.like-btn:hover {
  background: rgba(212, 175, 55, 0.1);
}

.lightbox-sidebar {
  flex: 1;
  min-width: 320px;
  border-left: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
}

.lightbox-sidebar h4 {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  color: var(--accent);
  text-align: center;
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

.comments-list {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  font-size: 0.9rem;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  border-radius: 6px;
  border-left: 2px solid var(--accent);
}

.comment-item strong {
  color: var(--accent-light);
  margin-right: 0.5rem;
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.comment-input-area {
  padding: 1rem;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  gap: 0.5rem;
}

.comment-input-area input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: var(--text-primary);
  padding: 0.8rem;
  border-radius: 4px;
  outline: none;
  font-family: 'Montserrat', sans-serif;
}

.comment-input-area input:focus {
  border-color: var(--accent);
}

.comment-input-area button {
  background: var(--accent);
  color: #000;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.comment-input-area button:hover {
  background: var(--accent-light);
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  .lightbox-layout {
    flex-direction: column;
    height: 90vh;
  }
  .lightbox-main {
    flex: 1;
    min-height: 50vh;
  }
  .lightbox-sidebar {
    border-left: none;
    border-top: 1px solid rgba(212, 175, 55, 0.2);
    flex: 1;
  }
  .welcome-card {
    padding: 2rem;
  }
}
`;

let cssContent = fs.readFileSync(appCssPath, 'utf8');
fs.writeFileSync(appCssPath, cssContent + newCss);

console.log('Update successful');
