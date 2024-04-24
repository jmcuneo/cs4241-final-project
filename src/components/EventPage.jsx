import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";
import TopButtons from './TopButtons.jsx';

function EventPage({ onLogout }) {
    const navigate = useNavigate()
    const handleMainPage = async (event) => {
        event.preventDefault();
        navigate("/main");
    }

    const handleManageEventPage = async (event) => {
        event.preventDefault();
        navigate("/event/manage");
    }

  return(
      <div className='main-page-container'>
        <div className='header-section'>
            <h1>Event Page</h1>
            <button style={{marginLeft: '20px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="manageEventPageButton" onClick={handleManageEventPage}>Manage Event</button>
        </div>
          
          <TopButtons onLogout={onLogout} showBackButton={true} showProfileButton={true}></TopButtons>
          <GuestListComponent/>
      </div>
  );
}

export default EventPage;
