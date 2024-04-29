import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import UserGuestListComponent from "./UserGuestListComponent.jsx";
import PropTypes from "prop-types";
import Navbar from "./Navbar.jsx";
import EventTitleManager from "./EventTitleManager.jsx";
import UserListComponent from "./UserListComponent.jsx";

function ManageEventPage({ onLogout }) {
  const { eventId } = useParams();
  const [guestList, setGuestList] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const totalLimitUpdate = useRef(null);
  const userLimitUpdate = useRef(null);

  const getGuestList = useCallback(async () => {
    try {
      const response = await fetch("/api/getGuestList", {
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
  }, [eventId]);

  const getProfile = async () => {
    try {
      const response = await fetch("/api/getProfile", {
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

  const handleUpdateTotalLimit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/setGuestLimit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId,
          guestLimit: totalLimitUpdate.current.value
        }),
      });
      const success = await response.json();
      if (success.success) {
        // Yippee
      } else if (!success.success) {
        // Womp womp
        console.error(success.error);
      } else {
        console.error("Error changing guest limit");
      }
    } catch (error) {
      console.error("Error changing guest limit: " + error);
    }
  };

  const handleUpdateUserLimit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/setInviteLimit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId,
          inviteLimit: userLimitUpdate.current.value
        }),
      });
      const success = await response.json();
      if (success.success) {
        // Yippee
        
      } else if (!success.success) {
        // Womp womp
        console.error(success.error);
      } else {
        console.error("Error changing invite limit");
      }
    } catch (error) {
      console.error("Error changing invite limit: " + error);
    }
  };

  // Note: Mutilator
  const getLimits = useCallback(async () => {
    try {
      const response = await fetch("/api/getGuestAndInviteLimits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId
        }),
      });

      let limits = await response.json();
      if (limits.guestLimit !== undefined) {
        totalLimitUpdate.current.value = limits.guestLimit;
      } else {
        totalLimitUpdate.current.value = '';
      }

      if (limits.inviteLimit !== undefined) {
        userLimitUpdate.current.value = limits.inviteLimit;
      } else {
        userLimitUpdate.current.value = '';
      }

    } catch (error) {
      console.error("Error getting limits: " + error);
    }
  }, [eventId]);

  useEffect(() => {
    getGuestList();
    getProfile()
      .then((profile) => {
        setUserProfile(profile);
      })
      .catch((error) => {
        console.error("Error getting profile:", error);
      });
  }, [getGuestList]);

  useEffect(() => {
    // Load when eventId changes
    getLimits();
  }, [getLimits]);

  return (
    <>
      <Navbar
        onLogout={onLogout}
        showBackButton={true}
        showProfileButton={true}
      />

      <div>
        <div>
          <EventTitleManager eventId={eventId} />
        </div>
        <div className style={{ display: "flex", flexDirection: "row" }}>
          <UserGuestListComponent onUpdate={handleUpdate} manage={true} passedGuestList={guestList} />
          <div className="flex flex-col ml-30 mt-10">
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
                style={{ marginLeft: "1rem", marginTop: "2.4rem" }}
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
                style={{ marginLeft: "1rem", marginTop: "2.4rem" }}
                onClick={handleUpdateUserLimit}
              >Update</button>
            </div>
            <div>
              <UserListComponent onUpdate={handleUpdate} />
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
