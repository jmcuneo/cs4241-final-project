import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import EventPage from './components/EventPage';
import ManageEventPage from './components/ManageEventPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import Background from './background/Background';
import "./App.css"


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('//localhost:3000/api/verifyToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        setAuthenticated(data.valid === true);
      } catch (error) {
        console.error('Error verifying token:', error);
        setAuthenticated(false);
      }
    };

    const verifyAdmin = async () => {
      try {
        const response = await fetch('//localhost:3000/api/verifyAdmin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        // console.log(data)
        setAdmin(data.valid === true);
      } catch (error) {
        console.error('Error verifying token:', error);
        setAdmin(false);
      }
    }

    verifyToken();
    verifyAdmin();
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); //Store token in localStorage
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token'); //Remove token from localStorage
  };

  return (
    <Router>
      <Background />{ }
      <Routes>
        {/*LOGIN AND REGISTER*/}
        {!authenticated && <Route exact path="/login" element={<LoginPage onLogin={handleLogin} />} />}
        <Route exact path="/register" element={<RegisterPage onRegister={handleLogin} />} />

        {/*PROTECTED ROUTES*/}
        {authenticated && (
          <>
            <Route exact path="/main" element={<MainPage onLogout={handleLogout} />} />
            <Route exact path="/profile" element={<ProfilePage onLogout={handleLogout} />} />
            <Route exact path="/event/:eventId" element={<EventPage isAdmin={admin} onLogout={handleLogout} />} />
          </>
        )}

        {authenticated && admin && <Route exact path="/event/manage/:eventId" element={<ManageEventPage onLogout={handleLogout} />} />}

        {/* Redirect to main page if authenticated */}
        {authenticated && <Route path="*" element={<Navigate to="/main" />} />}
        {/* Redirect to login page if not authenticated */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
