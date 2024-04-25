import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function TopButtons({ onLogout, showProfileButton, showBackButton }) {
  const navigate = useNavigate()

  const handleProfile = async (event) => {
    event.preventDefault();
    navigate("/profile");
  };

  const handleBack = async (event) => {
    window.history.back(); // Go back in the browser history
  };


  return (
    <div className='top-right-buttons'>
      {showBackButton && (
        <button
          className="btn btn-accent"
          type="button"
          id="backButton"
          onClick={handleBack}
        >
          <i className={"fa fa-arrow-circle-o-left"} style={{ marginRight: "5px", fontSize: "20px" }}></i>
          Back
        </button>
      )}
      {showProfileButton && (
        <button
          className="btn btn-primary"
          type="button"
          id="profilePageButton"
          onClick={handleProfile}
        >
          <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
          Profile
        </button>
      )}
      <button
        className="btn btn-accent"
        type="button"
        id="logoutButton"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

TopButtons.propTypes = {
  onLogout: PropTypes.func.isRequired,
  showProfileButton: PropTypes.bool,
  showBackButton: PropTypes.bool
}

export default TopButtons;
