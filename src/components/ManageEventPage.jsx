import  { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import UserGuestListComponent from "./UserGuestListComponent.jsx";
import PropTypes from "prop-types";
import Navbar from "./Navbar.jsx";
import EventTitleManager from "./EventTitleManager.jsx";

function ManageEventPage({ onLogout }) {
  const { eventId } = useParams();
  const [guestList, setGuestList] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const totalLimitUpdate = useRef(null);
  const userLimitUpdate = useRef(null);

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

  const handleUpdateTotalLimit = async (event) => {
    event.preventDefault();
    totalLimitUpdate.current.value = null;
  };

  const handleUpdateUserLimit = async (event) => {
    event.preventDefault();
    userLimitUpdate.current.value = null;
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
  }, [eventId]);

  return (
    <>
      <Navbar
        onLogout={onLogout}
        showBackButton={true}
        showProfileButton={true}
      />

      <div>
        <div>
          <EventTitleManager eventId={eventId}/>
        </div>
        <div style={{display:"flex", flexDirection:"row"}}>
          <UserGuestListComponent onUpdate={handleUpdate} manage={true} passedGuestList={guestList} />
          <div className="flex flex-col ml-30 mt-10" style={{marginLeft: "40rem"}}>
            <div className="flex flex-row ml-30 mt-4" >
              <div className="flex flex-col ml-30 mt-4" >
                <label className="text-lg text-slate-50 ml-3" htmlFor="totalLimitInput" >
                  Total Guest Limit
                </label>
                <input
                  className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent ml-2"
                  type="number"
                  id="totalLimitInput"
                  name="totalLimitInput"
                  ref={totalLimitUpdate}
                />
              </div>
              <button 
                type="button"
                className="btn btn-square bg-green-400 text-black px-10 hover:bg-green-500"
                style={{marginLeft:"1rem", marginTop:"2.4rem"}}
                onClick={handleUpdateTotalLimit}
              >Update</button>
            </div>
            <div className="flex flex-row ml-30 mt-4" >
              <div className="flex flex-col ml-30 mt-4" >
                <label className="text-lg text-slate-50 ml-3" htmlFor="userLimitInput" >
                  User Guest Limit
                </label>
                <input
                  className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent ml-2"
                  type="number"
                  id="userLimitInput"
                  name="userLimitInput"
                  ref={userLimitUpdate}
                />
              </div>
              <button 
                type="submit"
                className="btn btn-square bg-green-400 text-black px-10 hover:bg-green-500"
                style={{marginLeft:"1rem", marginTop:"2.4rem"}}
                onClick={handleUpdateUserLimit}
              >Update</button>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

ManageEventPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ManageEventPage;
