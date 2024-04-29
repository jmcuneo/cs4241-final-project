import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import TableComponent from "./TableComponent";
import { motion } from "framer-motion";

//I think we can keep one main page and add in the 2 buttons if the user is an admin

function MainPage({ onLogout, isAdmin }) {
  let [events, setEvents] = useState([]);
  const eventNameInput = useRef(null);
  const eventDateInput = useRef(null);
  const eventLocationInput = useRef(null);
  const [message, setMessage] = useState("");

  function formatEventDate(dateString) {
    const eventDate = new Date(dateString);

    // Options for date and time formatting
    const options = {
      month: "numeric", // Display month as a number (e.g., "12" for December)
      day: "2-digit", // Display day as two digits (e.g., "25")
      year: "numeric", // Display year as a number (e.g., "2024")
      hour: "numeric", // Display hour as a number (e.g., "10" for 10PM)
      minute: "2-digit", // Display minute as two digits (e.g., "00")
      hour12: true, // Use 12-hour format (true for AM/PM)
    };

    // Format the date string using options
    const formattedDate = eventDate.toLocaleString("en-US", options);

    return formattedDate;
  }

  const handleCreateEvent = async (e, eventName, eventDate, eventLocation) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/createEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventBody: {
            name: eventName,
            date: eventDate,
            location: eventLocation,
          },
        }),
      });

      const res = await response.json();
      if (res.ok) setMessage("Event Created Successfully");
      else setMessage(res.error);
      setTimeout(getUpcomingEvents, 400);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  const getUpcomingEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/getUpcomingEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      });

      const _events = await response.json();
      setEvents(_events);
    } catch (error) {
      console.error("Error getting events:", error);
    }
  }, []);
  useEffect(() => {
    getUpcomingEvents();
  }, [getUpcomingEvents]);

  const formattedEvents = events.map((row) => {
    return {
      _id: row._id,
      name: row.name,
      date: new Date(row.date).toLocaleDateString(navigator.languages, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      location: row.location,
      guestCount: row.guestCount,
      userInvites: row.userInvites,
    };
  });

  const [searchTerm, setSearchTerm] = useState("");
  const filteredEvents = formattedEvents.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar onLogout={onLogout} showProfileButton={true}></Navbar>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <div className="main-page-container relative flex min-h-max flex-col mt-10 mx-auto items-center prose">
          <div className="flex flex-row mb-4">
            <h1>Upcoming Events</h1>
          </div>
          <div className="max-h-[75vh] flex flex-col">
            <input
              type="text"
              placeholder="Search by Event name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
            <div className="flex-grow max-h-[50vh] overflow-y-auto">
              <TableComponent
                headers={[
                  "Name",
                  "Date",
                  "Location",
                  "Guest Count",
                  "User Invites",
                ]}
                rows={filteredEvents}
                isEvent={true}
              ></TableComponent>
            </div>
          </div>
        </div>
        {isAdmin && (
          <div className="add-guest flex justify-center align-center max-h-[75vh] overflow-y-auto">
            <form
              className="w-full"
              onSubmit={(e) =>
                handleCreateEvent(
                  e,
                  eventNameInput.current.value,
                  formatEventDate(eventDateInput.current.value),
                  eventLocationInput.current.value
                )
              }
            >
              <div className="flex flex-col justify-start items-center">
                <h1>Create a New Event</h1>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  id="eventName"
                  placeholder="Event Name"
                  style={{ margin: "0.5rem" }}
                  required
                  ref={eventNameInput}
                />
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="datetime-local"
                  id="eventDate"
                  placeholder="Event Date"
                  style={{ margin: "0.5rem" }}
                  required
                  ref={eventDateInput}
                />
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  id="eventLocation"
                  placeholder="Event Location"
                  style={{ margin: "0.5rem" }}
                  required
                  ref={eventLocationInput}
                />
                <button
                  className="btn btn-success add-guest-button mt-2"
                  type="submit"
                  id="createEventButton"
                  style={{ marginLeft: "1rem" }}
                >
                  Create New Event
                </button>
              </div>
            </form>
            <div className="text-xl ml-7 mt-2.5 color-white">{message}</div>
          </div>
        )}
      </motion.div>
    </>
  );
}

MainPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default MainPage;
