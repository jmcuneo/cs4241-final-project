import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";
import UserGuestListComponent from "./UserGuestListComponent.jsx";
import Navbar from "./Navbar.jsx";
import PropTypes from "prop-types";
import EventTitle from "./EventTitle.jsx";

function EventPage({ isAdmin, onLogout }) {
  const { eventId } = useParams();
  const [guestList, setGuestList] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
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

  const getProfile = async () => {
    try {
      const response = await fetch("//localhost:3000/api/getProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      });

      let profile = await response.json();
      return profile;
    } catch (error) {
      console.error("Error getting profile: " + error);
      return null;
    }
  };

  const handleUpdate = (guestName, action) => {
    if (action === "add")
      setGuestList((currentGuests) => [
        ...currentGuests,
        {
          guestName: guestName,
          invitedBy: userProfile.firstName + " " + userProfile.lastName,
        },
      ]);
    else
      setGuestList((currentGuests) =>
        currentGuests.filter((guest) => guest.guestName !== guestName)
      );
  };

  useEffect(() => {
    getGuestList();
    getProfile()
      .then((profile) => {
        setUserProfile(profile);
      })
      .catch((error) => {
        console.error("Error getting profile:", error);
      });
    // if (userProfile && userProfile.accountType === "Admin") setIsAdmin(true);
  }, [eventId]);

  return (
    <>
      <Navbar
        onLogout={onLogout}
        showBackButton={true}
        showProfileButton={true}
      ></Navbar>
      <div className="main-page-container">
        <div>
          <EventTitle eventId={eventId} isAdmin={isAdmin} />
        </div>
        <div className="relative grid grid-cols-2 justify-start mt-3 w-screen">
          <div className="ml-1">
            <GuestListComponent guestList={guestList} />
          </div>
          <div>
            <UserGuestListComponent onUpdate={handleUpdate} manage={false} />
          </div>
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
