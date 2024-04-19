import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";

function EventPage() {
  

  return(
    <div>
      <GuestListComponent/>
    </div>
  );
}

export default EventPage;
