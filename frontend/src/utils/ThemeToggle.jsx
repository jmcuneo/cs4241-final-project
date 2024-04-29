// ThemeToggle.jsx
import React from 'react';
import kebabMenu from '../components/assets/kebabMenu.svg';  // Ensure the path is correct

function ThemeToggle() {
  // Function to toggle the theme
  const toggleTheme = () => {
    const html = document.documentElement;

    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Save theme preference
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Save theme preference
    }
  };

  return (
    <button onClick={toggleTheme} tabindex="0" className="ml-4 rounded focus:outline-none">
                <img src={kebabMenu} alt="Menu" className="w-6 h-6" draggable="false" />
            </button>
  );
}

export default ThemeToggle;
