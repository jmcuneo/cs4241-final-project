import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";
import Navbar from "./Navbar.jsx";
import PropTypes from "prop-types";

function EventPage({ onLogout }) {
  const navigate = useNavigate();
  const { eventName } = useParams();

  const handleManageEventPage = async (event) => {
    event.preventDefault();
    navigate("/event/manage/" + encodeURI(eventName));
  };

  return (
    <>
      <Navbar
        onLogout={onLogout}
        showBackButton={true}
        showProfileButton={true}
      ></Navbar>
      <div className="main-page-container main-page-container relative flex min-h-screen flex-col mt-10 mx-auto items-center prose">
        <div className="header-section">
          <h1>Event Page</h1>
          <button
            style={{
              marginLeft: "20px",
              backgroundColor: "rgb(178, 114, 238)",
              color: "black",
              fontWeight: "bold",
            }}
            className="btn waves-effect waves-light"
            type="button"
            id="manageEventPageButton"
            onClick={handleManageEventPage}
          >
            Manage Event
          </button>
        </div>

        <GuestListComponent />
      </div>
    </>
  );
}

EventPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default EventPage;
