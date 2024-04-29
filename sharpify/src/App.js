import { React, useState } from 'react';
import { useEffect } from "react";
import { useLocation, Navigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Login from "./login/Login";
import Register from "./register/Register";
import Navbar from './navbar/Navbar';
import Dashboard from './dashboard/Dashboard';
import MySavedImages from './savedimages/SavedImages';
import './App.css';
import WebFont from 'webfontloader';

export default function App() {
  WebFont.load({
    google: {
      families: ['Titillium Web:400,600,700']
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  const location = useLocation();
  useEffect(() => { }, [location]);
  useEffect(() => {
    if (['/login', '/register'].includes(location.pathname)) {
      document.body.classList.remove('custom-background');
    } else {
      document.body.classList.add('custom-background');
    }
  }, [location]);

  return (
    <div>
      {location.pathname != "/login" && location.pathname != "/register" ? <Navbar signedIn={signedIn} /> : null}
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path='/login' element={<Login email={email} setEmail={setEmail} password={password} setPassword={setPassword} setSignedIn={setSignedIn} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard email={email} password={password} signedIn={signedIn} />} />
        <Route path='/mysavedimages' element={<MySavedImages email={email} password={password} signedIn={signedIn} />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </div>
  );
}