import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login.jsx';
import Signup from './pages/signup/SignUp.jsx';
import Home from './pages/home/Home.jsx';

function App() {
  const [showLogin, setShowLogin] = useState(true);  // State to toggle views

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={showLogin ? 
            <Login onSignUpClick={() => setShowLogin(false)} /> : 
            <Signup onLoginClick={() => setShowLogin(true)} />
          } />
          <Route path="/chat" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
