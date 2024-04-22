import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

//I think we can keep one main page and add in the 2 buttons if the user is an admin

function MainPage() {
  const navigate = useNavigate()
  const handleProfile = async (event) => {
    event.preventDefault();
    navigate("/profile");
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    navigate("/");
  }

  const handleEventPage = async (event) => {
    event.preventDefault();
    navigate("/event");
  }


  return(
      <div>
        <h1>Main Page</h1>
        <button style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="profilePageButton" onClick={handleProfile}>Profile</button>
        <button style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="logoutButton" onClick={handleLogout}>Logout</button>
        <button style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="eventPageButton" onClick={handleEventPage}>View Event Page</button>
      </div>
  );
}

export default MainPage;
