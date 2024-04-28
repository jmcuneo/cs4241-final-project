import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";
import UserGuestListComponent from "./UserGuestListComponent.jsx";
import Navbar from "./Navbar.jsx";
import PropTypes from "prop-types";
import EventTitle from "./EventTitle.jsx";

function EventPage({ isAdmin, onLogout }) {
  const { eventId } = useParams();

  return (
    <>
      <Navbar
        onLogout={onLogout}
        showBackButton={true}
        showProfileButton={true}
      ></Navbar>
      <div className="min-w-screen mx-auto">
        <div>
          <EventTitle eventId={eventId} isAdmin={isAdmin} />
        </div>
        <div className="userguestlistwrapper">
          <UserGuestListComponent
            manage={false}
          />
        </div>
      </div>
    </>
  );
}

EventPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default EventPage;
