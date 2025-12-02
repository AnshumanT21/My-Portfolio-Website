import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ 
  children, 
  animation = 'fadeUp', 
  delay = 0, 
  duration = 600,
  threshold = 0.1,
  className = ''
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const animations = {
    fadeUp: {
      hidden: { opacity: 0, transform: 'translateY(60px)' },
      visible: { opacity: 1, transform: 'translateY(0)' }
    },
    fadeDown: {
      hidden: { opacity: 0, transform: 'translateY(-60px)' },
      visible: { opacity: 1, transform: 'translateY(0)' }
    },
    fadeLeft: {
      hidden: { opacity: 0, transform: 'translateX(-60px)' },
      visible: { opacity: 1, transform: 'translateX(0)' }
    },
    fadeRight: {
      hidden: { opacity: 0, transform: 'translateX(60px)' },
      visible: { opacity: 1, transform: 'translateX(0)' }
    },
    scale: {
      hidden: { opacity: 0, transform: 'scale(0.8)' },
      visible: { opacity: 1, transform: 'scale(1)' }
    },
    rotate: {
      hidden: { opacity: 0, transform: 'rotate(-10deg) scale(0.9)' },
      visible: { opacity: 1, transform: 'rotate(0deg) scale(1)' }
    },
    blur: {
      hidden: { opacity: 0, filter: 'blur(10px)', transform: 'scale(1.05)' },
      visible: { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }
    },
    slideUp: {
      hidden: { opacity: 0, transform: 'translateY(100px) rotateX(10deg)' },
      visible: { opacity: 1, transform: 'translateY(0) rotateX(0deg)' }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  const anim = animations[animation] || animations.fadeUp;
  const currentStyle = isVisible ? anim.visible : anim.hidden;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...currentStyle,
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;