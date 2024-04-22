import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";

function ManageEventPage() {
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
      <div>
          <GuestListComponent/>
          <button style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="mainPageButton" onClick={handleMainPage}>Main Page</button>
          <button style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="eventPageButton" onClick={handleEventPage}>Back to Event Page</button>
      </div>
  );
}

export default ManageEventPage;
