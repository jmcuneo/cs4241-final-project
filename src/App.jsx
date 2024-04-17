import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import EventPage from './components/EventPage';
import ManageEventPage from './components/ManageEventPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
      <Route
        exact
        path="/login"
        element={<LoginPage />}
      />
      <Route
        exact
        path="/main"
        element={<MainPage />}
      />
      <Route
        exact
        path="/event"
        element={<EventPage />}
      />
      <Route
        exact
        path="/event/manage"
        element={<ManageEventPage />}
      />
      <Route
        exact
        path="/register"
        element={<RegisterPage />}
      />
      <Route
        exact
        path="/profile"
        element={<ProfilePage />}
      />
      <Route
        exact
        path="/"
        element={<LoginPage />}
      />
      </Routes>
    </Router>
  )
}

export default App
