import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import EventPage from './components/EventPage';
import ManageEventPage from './components/ManageEventPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import Background from './background/Background';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  console.log(token)
  
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); // Store token in localStorage
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <Router>
      <Background />{}
      <Routes>
        {/*LOGIN AND REGISTER*/}
        {!token && <Route exact path="/login" element={<LoginPage onLogin={handleLogin} />} />}
        <Route exact path="/register" element={<RegisterPage onRegister={handleLogin}/>} />

        {/*PROTECTED ROUTES*/}
        {token && (
          <>
            <Route exact path="/main" element={<MainPage onLogout={handleLogout}/>} />
            <Route exact path="/event" element={<EventPage />} />
            <Route exact path="/event/manage" element={<ManageEventPage />} />
            <Route exact path="/profile" element={<ProfilePage />} />
          </>
        )}
        {/* Redirect to main page if authenticated */}
        {token && <Route path="*" element={<Navigate to="/main" />} />}
        {/* Redirect to login page if not authenticated */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
