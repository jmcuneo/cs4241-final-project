import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function TopButtons() {
  const navigate = useNavigate()
  const handleProfile = async (event) => {
    event.preventDefault();
    navigate("/profile");
  };

  const onLogout = async (event) => {
    event.preventDefault();
    navigate("/login");
  };

  return(
    <div className='top-right-buttons' style={{ display: 'flex' }}>
        <button
          style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}}
          className="btn waves-effect waves-light"
          type="button"
          id="profilePageButton"
          onClick={handleProfile}
        >
          <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
          Profile
        </button>
        <button
          style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(240, 91, 58)', color: 'black', fontWeight: 'bold'}}
          className="btn waves-effect waves-light"
          type="button"
          id="logoutButton"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
  );
}

export default TopButtons;
