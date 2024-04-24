import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";
import TopButtons from './TopButtons.jsx';

function ManageEventPage({ onLogout }) {
    const navigate = useNavigate()
    const handleMainPage = async (event) => {
        event.preventDefault();
        navigate("/main");
    }

    const handleEventPage = async (event) => {
        event.preventDefault();
        navigate("/event");
    }
  return(
    <div className='main-page-container'>
    <div className='header-section'>
        <h1>Manage Event Page</h1>
    </div>
      <TopButtons onLogout={onLogout} showBackButton={true} showProfileButton={true}></TopButtons>
      <GuestListComponent/>
  </div>
  );
}

export default ManageEventPage;
