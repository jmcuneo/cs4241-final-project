import  { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserGuestListComponent from "./UserGuestListComponent.jsx";
import PropTypes from "prop-types";
import Navbar from "./Navbar.jsx";
import EventTitle from "./EventTitle.jsx";

function ManageEventPage({ onLogout }) {
  const navigate = useNavigate();
  const { eventName } = useParams();
  const [guestList, setGuestList] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  const handleManageEventPage = async (event) => {
    event.preventDefault();
    navigate("/event/manage/" + encodeURI(eventName));
  };

  const getGuestList = async () => {
    try {
      const response = await fetch("//localhost:3000/api/getGuestList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventName: eventName,
        }),
      });

      const guests = await response.json();
      setGuestList(guests);
    } catch (error) {
      console.error("Error getting guests:", error);
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
      console.log(profile);
      return profile;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  };

  const handleUpdate = (guestName, action) => {
    if (action == "add")
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
  }, [eventName]);

  return (
    <>
      <Navbar
        onLogout={onLogout}
        showBackButton={true}
        showProfileButton={true}
      />

      <div className="main-page-container">
        <div className="header-section">
          <EventTitle eventName={eventName}/>
        </div>
        <UserGuestListComponent onUpdate={handleUpdate} manage={true} />
      </div>
    </>
  );
}

ManageEventPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ManageEventPage;
