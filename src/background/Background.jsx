import React, { useEffect, useState } from 'react';
import './Background.css'; 
import { motion } from 'framer-motion';



const fetchSVGs = async () => {
  try {
    const svgContext = await import.meta.glob('../assets/background/*.svg');
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
  top: `${(window.innerHeight/2) + (Math.random() * window.innerHeight/4) - 100}px`,
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
      {SVGList.map(({ filename, url }, index) => {
        const coordinates = getRandomCoordinate();
        console.log(coordinates)
        return (
          <motion.div 
            key={index} 
            className="svg-container" 
            style={{ position: 'absolute', left: coordinates.left, top: coordinates.top }}
            animate={{ y: [100, 200, 100] }} 
            transition={{ duration: 20, repeat: Infinity }} 
          >
            <img src={url} alt={filename} />
          </motion.div>
        );
      })}
    </div>
  );
}

export default Background;
