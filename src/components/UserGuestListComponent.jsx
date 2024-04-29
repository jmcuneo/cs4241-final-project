import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import GuestListComponent from "./GuestListComponent";

function UserGuestListComponent({ manage }) {
  const { eventId } = useParams();
  const [thisEvent, setThisEvent] = useState(null);
  const [guestList, setGuestList] = useState([]);
  const [userGuestList, setUserGuestList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const guestNameRef = useRef(null);
  const [message, setMessage] = useState("");
  const [totalLimit, setTotalLimit] = useState('');
  const [userLimit, setUserLimit] = useState('');

  const getEvent = useCallback(async () => {
    try {
      const response = await fetch("/api/getEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId
        }),
      });

      const _events = await response.json();
      setThisEvent(_events);
    } catch (error) {
      console.error("Error getting events: " + error);
    }
  }, [eventId]);

  const getGuestList = useCallback(async (apiPoint, listType) => {
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
      if (listType === "user") setUserGuestList(guests);
      else setGuestList(guests);
    } catch (error) {
      console.error("Error getting invited guests:", error);
    }
  }, [eventId]);

  const addGuest = async (guestName) => {
    if (thisEvent.guestCount < totalLimit || totalLimit === 0 || totalLimit === ''){
      if (thisEvent.userInvites < userLimit || userLimit === 0 || userLimit === '') {
        try {
          const response = await fetch("/api/inviteGuest", {
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
            setUserGuestList((currentGuests) => [...currentGuests, { guestName }]);
            setMessage("");
          } else {
            console.log(result);
            setMessage("Error: " + result.error);
          }
          
        } catch (error) {
          console.error("Error adding guest:", error);
        }
        guestNameRef.current.value = "";
      }
      else setMessage("Sorry, you have no more invites!");
    }
    else setMessage("Sorry, total guest limit reached");
    
  };

  const removeGuest = async (guestName) => {
    try {
      const response = await fetch("/api/uninviteGuest", {
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
        setUserGuestList((currentGuests) =>
          currentGuests.filter((guest) => guest.guestName !== guestName)
        );
      }
      console.log(result);
    } catch (error) {
      console.error("Error removing guest:", error);
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
          setTotalLimit(limits.guestLimit);
        } else {
          setTotalLimit('');
        }
  
        if (limits.inviteLimit !== undefined) {
          setUserLimit(limits.inviteLimit);
        } else {
          setUserLimit('');
        }
  
      } catch (error) {
        console.error("Error getting limits: " + error);
      }
    }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const guestName = guestNameRef.current.value;
    addGuest(guestName);
  };

  const handleRemove = async (guestName) => {
    removeGuest(guestName);
  };

  useEffect(() => {
    getGuestList("/api/getGuestList", "guest");
    getGuestList("/api/getUserGuestList", "user");
    getLimits();
    getEvent();
  }, [getGuestList, getLimits, getEvent]);

  const filteredList = (() => {
    let list = guestList;
    if (!manage)
      list = userGuestList;
    return list.filter((guest) =>
      guest.guestName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  })(); // NOTE: This parenthesis at the end is important. Keep them.


const guestTable = () => {
  return (
    <div className="overflow-x-auto prose flex flex-col">
      <div className="flex justify-between items-center">
        <input 
          style={{marginBottom: "0.2rem"}}
          type="text"
          placeholder="Search by guest name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered flex-grow"
        />
      </div>
      <div className="flex-grow">
        <table className="table table-zebra bg-neutral not-prose table-md max-h-[75vh] overflow-y-auto">
          <thead>
            <tr>
              <th>Guest Name</th>
              {manage && <th>Invited By</th>}
            </tr>
          </thead>
          <tbody>
            {filteredList.map((guest, index) => (
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
      </div>
    </div>
  );
};

  return (
    <div className="prose min-w-screen">
      <div className="flex flex-col px-2 w-screen">
        {/* <h1 className="w" style={{marginLeft: "7rem", marginBottom: "4rem", marginTop: "1rem"}}>Guest List</h1> */}
        <div className="grid columns-3 grid-cols-3 gap-1 mt-7">
          {/* first col */}
          {!manage && (
            <div className="flex justify-center align-center max-h-[75vh] overflow-y-auto mb-10">
              <GuestListComponent
                guestList={guestList}
                shouldDisplayTitle={true}
              ></GuestListComponent>
            </div>
          )}
          {/* second col */}
          <div >
            {!manage && (
              <h1 className="ml-[10rem] mb-4" >Your Guests</h1>
            )}
            <div className="flex justify-center align-center max-h-[75vh] overflow-y-auto mb-10">
              {userGuestList.length > 0 ? (
                guestTable()
              ) : (
                <p className="text-slate text-center w-full max-h-[75vh] overflow-y-auto">You invited no guests</p>
              )}
            </div>
          </div>
          
          {/* last col */}
          {!manage && (
            <div className="add-guest flex flex-col justify-start align-center items-center max-h-[75vh] overflow-y-auto prose">
              <h1 className="mb-4">Add a Guest</h1>
              <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
                <div className="flex flex-col justify-start items-center">
                  <input
                    className="input input-bordered w-full max-w-xs"
                    type="text"
                    id="addGuestName"
                    placeholder="Guest Name"
                    required
                    ref={guestNameRef}
                  />
                  <button
                    className="btn btn-success add-guest-button mt-2"
                    type="submit"
                  >
                    Add Guest
                  </button>
                </div>
              </form>
              <div className="text-xl text-white">{message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

UserGuestListComponent.propTypes = {
  manage: PropTypes.bool,
  passedGuestList: PropTypes.arrayOf(PropTypes.any),
};

export default UserGuestListComponent;
