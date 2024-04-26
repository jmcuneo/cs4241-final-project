import React, { useState, useProps, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";
import PropTypes from 'prop-types';
import Navbar from "./Navbar.jsx"

function ManageEventPage({ onLogout }) {
  const navigate = useNavigate();
  const { eventName } = useProps();
  const handleMainPage = async (event) => {
    event.preventDefault();
    navigate("/main");
  }

  const handleEventPage = async (event) => {
    event.preventDefault();
    navigate("/event/:eventName");
  }
  return (
    <div className="main-page-container">
      <div className="header-section">
        <h1>Manage Event Page</h1>
      </div>
      <Navbar
        onLogout={onLogout}
        showBackButton={true}
        showProfileButton={true}
      ></Navbar>
      
      <GuestListComponent />
    </div>
  );
}

ManageEventPage.propTypes = {
  onLogout: PropTypes.func.isRequired
};

export default ManageEventPage;
