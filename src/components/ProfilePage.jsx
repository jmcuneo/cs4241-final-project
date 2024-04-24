import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"
import TopButtons from './TopButtons';

function ProfilePage({ onLogout }) {
  const navigate = useNavigate()
  const handleMainPage = async (event) => {
    event.preventDefault();
    navigate("/main");
  }


  return(
    <div className='main-page-container'>
      <div>
        <h1 className='header-section'>Profile</h1>
      </div>
      <TopButtons onLogout={onLogout} showBackButton={true}></TopButtons>
    </div>
  );
}

export default ProfilePage;
