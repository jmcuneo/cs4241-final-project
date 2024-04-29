import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <React.StrictMode>
    
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    
  </React.StrictMode>
  </BrowserRouter>
  ,
);

const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark if nothing is set
document.documentElement.classList.add(currentTheme);
