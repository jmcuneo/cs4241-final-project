import React, { useState, useProps, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";
import TopButtons from './TopButtons.jsx';
import PropTypes from 'prop-types';

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
    <div className='main-page-container'>
      <div className='header-section'>
        <h1>Manage Event Page</h1>
      </div>
      <TopButtons onLogout={onLogout} showBackButton={true} showProfileButton={true}></TopButtons>
      <GuestListComponent />
    </div>
  );
}

ManageEventPage.propTypes = {
  onLogout: PropTypes.func.isRequired
};

export default ManageEventPage;
