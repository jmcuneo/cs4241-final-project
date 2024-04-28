import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";
import UserGuestListComponent from "./UserGuestListComponent.jsx";
import Navbar from "./Navbar.jsx";
import PropTypes from "prop-types";
import EventTitle from "./EventTitle.jsx";

function EventPage({ isAdmin, onLogout }) {
  const { eventId } = useParams();
  // const [isAdmin, setIsAdmin] = useState(false);

  const getGuestList = async () => {
    try {
      const response = await fetch("//localhost:3000/api/getGuestList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId,
        }),
      });

      const guests = await response.json();
      setGuestList(guests);
    } catch (error) {
      console.error("Error getting guests: " + error);
    }
  };

  useEffect(() => {
    getGuestList();
  }, [eventId]);

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
