import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

function GuestListComponent({ onUpdate, manage }) {
  const { eventId } = useParams();
  const [guestList, setGuestList] = useState([]);
  const guestNameRef = useRef(null);
  const [message, setMessage] = useState("");

  const getGuestList = async () => {
    try {
      const response = await fetch(apiPoint, {
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
      console.error("Error getting invited guests:", error);
    }
  };

  const addGuest = async (guestName) => {
    try {
      const response = await fetch("//localhost:3000/api/inviteGuest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId,
          guestName: guestName,
        }),
      });
      const result = await response.json();
      if (result.success == true) {
        setGuestList((currentGuests) => [...currentGuests, { guestName }]);
        onUpdate(guestName, "add");
        setMessage("");
      } else {
        console.log(result);
        setMessage("Error: " + result.error);
      }
      guestNameRef.current.value = "";
    } catch (error) {
      console.error("Error adding guest:", error);
    }
  };

  const removeGuest = async (guestName) => {
    try {
      const response = await fetch("//localhost:3000/api/uninviteGuest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId,
          guestName: guestName,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setGuestList((currentGuests) =>
          currentGuests.filter((guest) => guest.guestName !== guestName)
        );
        onUpdate(guestName, "remove");
      }
      console.log(result);
    } catch (error) {
      console.error("Error removing guest:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const guestName = guestNameRef.current.value;
    addGuest(guestName);
  };

  const handleRemove = async (guestName) => {
    removeGuest(guestName);
  };

  useEffect(() => {
    getGuestList();
  }, [eventId]);

  const guestTable = () => {
    return (
      <table className="table table-zebra bg-neutral">
        <thead>
          <tr>
            <th>Guest Name</th>
            {manage && <th>Invited By</th>}
          </tr>
        </thead>
        <tbody>
          {guestList.map((guest, index) => (
            <tr key={index}>
              <td>{guest.guestName}</td>
              {manage && <td>{guest.invitedBy}</td>}
              <td>
                <button
                  className="btn bg-red-500 hover:bg-red-600 text-black font-bold "
                  type="button"
                  id={"removeButton" + index}
                  onClick={() => handleRemove(guest.guestName)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  let title = "Your Guests";
  let apiPoint = "//localhost:3000/api/getUserGuestList";
  if (manage) {
    title = "Guest List";
    apiPoint = "//localhost:3000/api/getGuestList";
  }
  return (
    <div className="guest-list prose">
      <div>
        <h1>{title}</h1>
        <div className="center-container">
          {!manage && (
            <div className="add-guest">
              <form onSubmit={(e) => handleSubmit(e)}>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  id="addGuestName"
                  placeholder="Guest Name"
                  required
                  ref={guestNameRef}
                />
                <button
                  className="btn btn-success add-guest-button ml-4"
                  type="submit"
                >
                  Add Guest
                </button>
              </form>
              <div className="text-xl text-white">{message}</div>
            </div>
          )}
        </div>
        {guestList.length > 0 ? guestTable() : <p className="text-slate text-center w-full">You have no guests</p>}
      </div>
    </div>
  );
}

GuestListComponent.propTypes = {
  onUpdate: PropTypes.func,
  manage: PropTypes.bool,
};

export default GuestListComponent;
