import React, { useEffect, useState } from 'react';
import './Background.css'; 

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
  top: `${Math.random() * (window.innerHeight - 100)}px`,
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
        const coordinates = getRandomCoordinate(); // Call getRandomCoordinate for each SVG
        console.log(coordinates)
        return (
          <div key={index} className="svg-container" style={{ position: 'absolute', left: coordinates.left, top: coordinates.top }}>
            <img src={url} alt={filename} />
          </div>
        );
      })}
    </div>
  );
}

export default Background;
