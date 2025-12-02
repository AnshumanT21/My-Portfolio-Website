import React, { useRef, useEffect } from 'react';

const ChromaGrid = ({ items, radius = 280, columns = 3 }) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const projectData = [
    {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      title: 'Fintech Dashboard',
      subtitle: 'Real-time analytics platform with AI-powered insights for financial data visualization',
      handle: 'React • D3.js • Node.js',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg, rgba(79, 70, 229, 0.3), rgba(0,0,0,0.8))',
      url: '#'
    },
    {
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
      title: 'AI Image Generator',
      subtitle: 'Neural network powered creative tool for generating unique artwork and designs',
      handle: 'Python • TensorFlow • FastAPI',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg, rgba(16, 185, 129, 0.3), rgba(0,0,0,0.8))',
      url: '#'
    },
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      title: 'Social Graph',
      subtitle: 'Network visualization platform for mapping social connections and influence patterns',
      handle: 'Neo4j • GraphQL • Three.js',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg, rgba(245, 158, 11, 0.3), rgba(0,0,0,0.8))',
      url: '#'
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      title: 'E-Commerce Platform',
      subtitle: 'Scalable marketplace with headless CMS and seamless payment integration',
      handle: 'Next.js • Stripe • PostgreSQL',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(195deg, rgba(239, 68, 68, 0.3), rgba(0,0,0,0.8))',
      url: '#'
    },
    {
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop',
      title: 'Mobile Fitness App',
      subtitle: 'Cross-platform health tracking with personalized workout recommendations',
      handle: 'React Native • Firebase • ML Kit',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(225deg, rgba(139, 92, 246, 0.3), rgba(0,0,0,0.8))',
      url: '#'
    },
    {
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      title: 'Cloud Infrastructure',
      subtitle: 'Automated DevOps pipeline with containerized microservices architecture',
      handle: 'AWS • Kubernetes • Terraform',
      borderColor: '#06B6D4',
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(0,0,0,0.8))',
      url: '#'
    }
  ];

  const data = items?.length ? items : projectData;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    target.current = { x: width / 2, y: height / 2 };
    el.style.setProperty('--x', `${pos.current.x}px`);
    el.style.setProperty('--y', `${pos.current.y}px`);

    let animationId;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.1;
      pos.current.y += (target.current.y - pos.current.y) * 0.1;
      el.style.setProperty('--x', `${pos.current.x}px`);
      el.style.setProperty('--y', `${pos.current.y}px`);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleMove = e => {
    const r = rootRef.current.getBoundingClientRect();
    target.current.x = e.clientX - r.left;
    target.current.y = e.clientY - r.top;
    if (fadeRef.current) fadeRef.current.style.opacity = '0';
  };

  const handleLeave = () => {
    if (fadeRef.current) fadeRef.current.style.opacity = '1';
  };

  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  // NEW FUNCTION: Handles clicking the card (Modal vs URL)
  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick(); // Triggers the modal
    } else if (item.url && item.url !== '#') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      ref={rootRef}
      className="chroma-grid"
      style={{ '--r': `${radius}px`, '--cols': columns }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleItemClick(c)} // Updated onClick handler
          style={{
            '--card-border': c.borderColor || 'transparent',
            '--card-gradient': c.gradient,
            cursor: (c.url || c.onClick) ? 'pointer' : 'default' // Ensure pointer cursor shows
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" style={{ transition: 'opacity 0.6s ease' }} />
    </div>
  );
};

export default ChromaGrid;