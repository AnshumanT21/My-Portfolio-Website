import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const css = `
.focus-container {
  position: relative;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.focus-word {
  position: relative;
  z-index: 1;
  cursor: default;
  display: inline-block;
  padding: 0.2rem 0.5rem;
}

.focus-word.manual {
  cursor: pointer;
}

.focus-frame {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  box-shadow: 0 0 4px var(--glow-color), inset 0 0 4px var(--glow-color);
  border-radius: 4px;
}

.corner {
  position: absolute;
  width: 6px;
  height: 6px;
  border-color: var(--border-color);
  border-style: solid;
}

.top-left { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.top-right { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.bottom-left { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.bottom-right { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
`;

const TrueFocus = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex(prev => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;

    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = index => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="focus-container" ref={containerRef}>
        {words.map((word, index) => {
          const isActive = index === currentIndex;
          return (
            <span
              key={index}
              ref={el => (wordRefs.current[index] = el)}
              className={`focus-word ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'active' : ''}`}
              style={{
                filter: manualMode
                  ? isActive
                    ? `blur(0px)`
                    : `blur(${blurAmount}px)`
                  : isActive
                    ? `blur(0px)`
                    : `blur(${blurAmount}px)`,
                '--border-color': borderColor,
                '--glow-color': glowColor,
                transition: `filter ${animationDuration}s ease`
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {word}
            </span>
          );
        })}

        <motion.div
          className="focus-frame"
          animate={{
            x: focusRect.x,
            y: focusRect.y,
            width: focusRect.width,
            height: focusRect.height,
            opacity: currentIndex >= 0 ? 1 : 0
          }}
          transition={{
            duration: animationDuration
          }}
          style={{
            '--border-color': borderColor,
            '--glow-color': glowColor
          }}
        >
          <span className="corner top-left"></span>
          <span className="corner top-right"></span>
          <span className="corner bottom-left"></span>
          <span className="corner bottom-right"></span>
        </motion.div>
      </div>
    </>
  );
};

export default TrueFocus;