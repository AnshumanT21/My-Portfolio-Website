import React, { useRef, useEffect, useState } from 'react';
import { Home, Briefcase, Heart, Mail } from 'lucide-react';
import HomeScreen from '../Components/HomeScreen';
import ProjectsScreen from '../Components/ProjectsScreen';
import HobbiesScreen from '../Components/HobbiesScreen';
import ContactScreen from '../Components/ContactScreen';
import GlassSurface from '../components/GlassSurface';
import Footer from '../Components/Footer';

// ============================================
// STYLES
// ============================================
const styles = `
/* Particles */
.particles-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.particles-container canvas {
  width: 100% !important;
  height: 100% !important;
}

/* Chroma Grid */
.chroma-grid {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(var(--cols, 3), 320px);
  grid-auto-rows: auto;
  justify-content: center;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
  --x: 50%;
  --y: 50%;
  --r: 280px;
}

@media (max-width: 1124px) {
  .chroma-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 320px));
    gap: 1rem;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .chroma-grid {
    grid-template-columns: 1fr;
    max-width: 340px;
    gap: 1rem;
    padding: 1rem;
  }
}

.chroma-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--card-gradient);
  backdrop-filter: blur(20px);
  --mouse-x: 50%;
  --mouse-y: 50%;
  --spotlight-color: rgba(255, 255, 255, 0.15);
}

.chroma-card:hover {
  border-color: var(--card-border);
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.chroma-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 60%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2;
}

.chroma-card:hover::before {
  opacity: 1;
}

.chroma-img-wrapper {
  position: relative;
  z-index: 1;
  padding: 16px;
  box-sizing: border-box;
  aspect-ratio: 16/10;
}

.chroma-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  display: block;
}

.chroma-info {
  position: relative;
  z-index: 1;
  padding: 1rem 1.25rem 1.5rem;
  color: #fff;
  font-family: 'Inter', system-ui, sans-serif;
}

.chroma-info .name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em;
}

.chroma-info .role {
  color: rgba(255,255,255,0.6);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.chroma-info .handle {
  color: var(--card-border);
  font-size: 0.8rem;
  font-weight: 500;
}

.chroma-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  backdrop-filter: grayscale(1) brightness(0.7);
  -webkit-backdrop-filter: grayscale(1) brightness(0.7);
  background: rgba(0, 0, 0, 0.001);
  mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    transparent 0%,
    transparent 20%,
    rgba(0, 0, 0, 0.15) 35%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.5) 70%,
    white 100%
  );
  -webkit-mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    transparent 0%,
    transparent 20%,
    rgba(0, 0, 0, 0.15) 35%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.5) 70%,
    white 100%
  );
}

.chroma-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  backdrop-filter: grayscale(1) brightness(0.7);
  -webkit-backdrop-filter: grayscale(1) brightness(0.7);
  background: rgba(0, 0, 0, 0.001);
  mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    white 0%,
    white 20%,
    rgba(255, 255, 255, 0.85) 35%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 0.5) 70%,
    transparent 100%
  );
  -webkit-mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    white 0%,
    white 20%,
    rgba(255, 255, 255, 0.85) 35%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 0.5) 70%,
    transparent 100%
  );
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* Glass Cursor */
.glass-cursor {
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s, background 0.3s;
  mix-blend-mode: difference;
}

.glass-cursor.hovering {
  width: 60px;
  height: 60px;
  background: rgba(139, 92, 246, 0.3);
}

/* Custom Scrollbar - UPDATED TO CREAM */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #421F16; /* Matches Body Background */
}

::-webkit-scrollbar-thumb {
  background: #FFFDD0; /* Cream */
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #fcf8b5; /* Slightly brighter cream */
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(82, 39, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(82, 39, 255, 0.6); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #a78bfa 50%, #5227ff 100%);
  background-size: 200% 200%;
  animation: gradient-shift 5s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Particle Canvas Background */
.canvas-particles {
  position: absolute;
  inset: 0;
  z-index: 0;
}
`;

// ============================================
// GLASS CURSOR
// ============================================
const GlassCursor = () => {
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let animationId;

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      cursor.style.left = `${pos.current.x}px`;
      cursor.style.top = `${pos.current.y}px`;
      animationId = requestAnimationFrame(animate);
    };

    const move = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, .chroma-card')) {
        setHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('button, a, .chroma-card')) {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`glass-cursor hidden lg:block ${hovering ? 'hovering' : ''}`}
    />
  );
};

// ============================================
// HEADER COMPONENT
// ============================================
const Header = ({ activePage, setActivePage, scrolled }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'hobbies', label: 'Hobbies', icon: Heart },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 py-2 mx-4 mt-2 rounded-2xl"
    >
      <div className="flex justify-center">
          <GlassSurface
            width="90%"
            height="80px"
            borderRadius={24}
            className="shadow-2xl"
            blur={15}
            borderWidth={0.05}
            opacity={0.8}
          >
            <div className="w-full px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* LOGO with Glow like Avatar */}
                <div className="relative">
                   {/* The Glow Layer: Blurred background with gradient */}
                   <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFFDD0]/40 to-[#421F16]/40 blur-md" />
                   
                   {/* The Logo Box */}
                   <div className="relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFFDD0] to-[#421F16] flex items-center justify-center">
                     <span className="text-[#421F16] font-bold text-lg">AT</span>
                   </div>
                </div>
                
                <span className="font-semibold text-white text-sm transition-all duration-300">
                  Anshuman Tyagi
                </span>
              </div>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActivePage(id)}
                    className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 group ${
                      activePage === id 
                        ? 'bg-white/10 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${activePage === id ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="text-sm font-medium hidden lg:inline">{label}</span>
                    {/* Removed the purple dot below active item */}
                  </button>
                ))}
              </nav>

              <div className="md:hidden flex items-center gap-2">
                {navItems.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActivePage(id)}
                    className={`p-2 rounded-lg transition-all ${
                      activePage === id ? 'bg-white/10 text-white' : 'text-white/60'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </GlassSurface>
      </div>
    </header>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function Portfolio() {
  const [activePage, setActivePage] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'projects': return <ProjectsScreen />;
      case 'hobbies': return <HobbiesScreen />;
      case 'contact': return <ContactScreen />;
      default: return <HomeScreen setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="bg-black min-h-screen font-sans">
      <style>{styles}</style>
      
      <Header activePage={activePage} setActivePage={setActivePage} scrolled={scrolled} />
      <GlassCursor />
      
      <main className="relative z-10">
        {renderPage()}
      </main>
      <Footer setActivePage={setActivePage}/>
    </div>
  );
}
