import React, { useEffect, useState } from 'react';
import './Background.css'; 
import { motion } from 'framer-motion';

const numCopies = 30
const fetchSVGs = async () => {
  try {
    const svgContext = await import.meta.glob('../assets/background/*.png');
    const keys = Object.keys(svgContext);
    const svgImports = keys.map(async (key) => {
      const module = await svgContext[key]();
      return { filename: key, url: module.default };
    });
    const svgComponents = await Promise.all(svgImports);
    return svgComponents;
  } catch (error) {
    console.error('Error loading SVGs:', error);
    return [];
  }
};

const getRandomCoordinate = () => ({
  left: `${Math.random() * (window.innerWidth - 100)}px`,
  top: `${window.innerHeight}px`,
});

const Background = () => {
  const [SVGList, setSVGList] = useState([]);

  useEffect(() => {
    const fetchAndSetSVGs = async () => {
      const svgComponents = await fetchSVGs();
      setSVGList(svgComponents);
    };
    fetchAndSetSVGs();
  }, []);

  
  return (
    <div className="Background">
      {Array.from({ length: numCopies }).map((_, index) => (
        <React.Fragment key={index}>
          {SVGList.map(({ filename, url }, svgIndex) => {
            const coordinates = getRandomCoordinate();
            const initialLeft = coordinates.left;
            return (
              <motion.div 
                key={`${index}-${svgIndex}`} 
                className="svg-container" 
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
