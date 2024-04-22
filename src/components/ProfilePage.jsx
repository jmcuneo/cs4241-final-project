import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"

function ProfilePage() {
  const navigate = useNavigate()
  const handleMainPage = async (event) => {
    event.preventDefault();
    navigate("/main");
  }

  return(
      <div>
        <h1>Profile Page</h1>
        <button style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="mainPageButton" onClick={handleMainPage}>Main Page</button>

      </div>
  );
}

export default ProfilePage;
