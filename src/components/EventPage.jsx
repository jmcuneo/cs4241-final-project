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
      <div className="min-w-screen mx-auto">
        <div>
          <EventTitle eventId={eventId} isAdmin={isAdmin} />
        </div>
        <div className="userguestlistwrapper">
          <UserGuestListComponent
            onUpdate={handleUpdate}
            manage={false}
            passedGuestList={guestList}
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
