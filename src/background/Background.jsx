import React, { useEffect, useState } from 'react';
import './Background.css'; 
import { motion } from 'framer-motion';

const numCopies = 4
const fetchPNGs = async () => {
  try {
    const PNGContext = await import.meta.glob('../assets/background/*.png');
    const keys = Object.keys(PNGContext);
    const PNGImports = keys.map(async (key) => {
      const module = await PNGContext[key]();
      return { filename: key, url: module.default };
    });
    const PNGComponents = await Promise.all(PNGImports);
    return PNGComponents;
  } catch (error) {
    console.error('Error loading PNGs:', error);
    return [];
  }
};

const getRandomCoordinate = () => ({
  left: `${Math.random() * (window.innerWidth - 100)}px`,
  top: `${window.innerHeight}px`,
});

const Background = () => {
  const [PNGList, setPNGList] = useState([]);

  useEffect(() => {
    const fetchAndSetPNGs = async () => {
      const PNGComponents = await fetchPNGs();
      setPNGList(PNGComponents);
    };
    fetchAndSetPNGs();
  }, []);

  
  return (
    <div className="Background">
      {Array.from({ length: numCopies }).map((_, index) => (
        <React.Fragment key={index}>
          {PNGList.map(({ filename, url }, PNGIndex) => {
            const coordinates = getRandomCoordinate();
            const initialLeft = coordinates.left;
            return (
              <motion.div 
                key={`${index}-${PNGIndex}`} 
                className="PNG-container" 
                style={{ position: 'absolute', left: coordinates.left, top: coordinates.top }}
                animate={{ top: -100, left: [initialLeft, initialLeft + Math.random() * 50, initialLeft], x: [0,50,0] }} // Move beyond top of screen
                exit={{ opacity: 0 }} // Fade out and remove from DOM after animation completes
                transition={{ duration: 4, delay: Math.random() * 4 }}
              >
                <img src={url} alt={filename} />
              </motion.div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Background;
