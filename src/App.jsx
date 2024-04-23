import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import EventPage from './components/EventPage';
import ManageEventPage from './components/ManageEventPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';

function App() {
  const [token, setToken] = useState();

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
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
        {/* Redirect to login page if not authenticated */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
