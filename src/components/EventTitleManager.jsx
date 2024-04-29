import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom";

function EventTitleManager({ eventId }) {
  //const { eventId } = useParams();
  const [thisEvent, setThisEvent] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventGuests, setEventGuests] = useState(0);
  const [eventUserGuests, setEventUserGuests] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const eventNameUpdate = useRef(null);
  const eventDateUpdate = useRef(null);
  const eventLocationUpdate = useRef(null);
  const navigate = useNavigate();

  function formatEventDate(dateString) {
    const eventDate = new Date(dateString);

    // Options for date and time formatting
    const options = {
      month: 'numeric', // Display month as a number (e.g., "12" for December)
      day: '2-digit',   // Display day as two digits (e.g., "25")
      year: 'numeric',  // Display year as a number (e.g., "2024")
      hour: 'numeric',  // Display hour as a number (e.g., "10" for 10PM)
      minute: '2-digit', // Display minute as two digits (e.g., "00")
      hour12: true      // Use 12-hour format (true for AM/PM)
    };

    // Format the date string using options
    const formattedDate = eventDate.toLocaleString('en-US', options);

    return formattedDate;
  }

  const getEvent = useCallback(async () => {
    try {
      const response = await fetch("//localhost:3000/api/getEvent", {
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
      // updateEventData();
    } catch (error) {
      console.error("Error getting events: " + error);
    }
  }, [eventId]);

  const updateEvent = async (newEventName, newEventDate, newEventLocation) => {
    try {
      const response = await fetch("//localhost:3000/api/modifyEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventBody: {
            _id: eventId,
            name: newEventName,
            date: newEventDate,
            location: newEventLocation
          }
        }),
      });
      const updatedEvent = await response.json();
      if (updatedEvent.error === 'Date must not be in the past!') {
        // Error message right above says it all.
        // Someone else: do something about it here
        // Also, not the ideal way to do error checking. I know.
        console.error(updatedEvent.error)
      } else if (typeof updatedEvent.success === 'boolean') {
        // Updating the event failed. 
        // Someone else: do something about it here
        console.error('Failed to update event');
      } else {
        // Update the events
        // Not the most ideal, since this requires another request to the server
        // But doing so will prevent it going into an infinite request loop
        getEvent();
      }

      if (response.ok) setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating event: " + error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let newEventName = eventNameUpdate.current.value;
    let newEventDate = eventDateUpdate.current.value;
    let newEventLocation = eventLocationUpdate.current.value;
    if (newEventName === "" || newEventName === undefined) newEventName = eventName;
    if (newEventDate === "" || newEventDate === undefined) newEventDate = eventDate;
    if (newEventLocation === "" || newEventLocation === undefined) newEventLocation = eventLocation;
    newEventDate = formatEventDate(newEventDate);
    if (newEventDate <= new Date()) {
      // This WILL cause an error on the server side (will have the modifyEvent api call return success false)
      // Someone else: warn the user here
    }
    updateEvent(newEventName, newEventDate, newEventLocation);
  };

  const handleDeleteEvent = async () => {
    const shouldDelete = window.confirm('Are you sure you want to delete this event? This action CANNOT be undone');

    if (shouldDelete) {
      try {
        const response = await fetch("//localhost:3000/api/deleteEvent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            token: localStorage.getItem("token"),
            eventId: eventId
         }),
        });
  
        const res = await response.json();
        if (res.success === true) navigate("/main");
        else window.confirm(res.error);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
}

  const updateEventData = useCallback(() => {
    getEvent();
    if (thisEvent !== null) {
      const formattedDateString = formatEventDate(thisEvent.date);
      setEventName(thisEvent.name)
      setEventDate(formattedDateString);
      setEventLocation(thisEvent.location);
      setEventGuests(thisEvent.guestCount);
      setEventUserGuests(thisEvent.userInvites);
    }
  }, [thisEvent]);

  useEffect(() => {
    updateEventData();
  }, [updateEventData, eventGuests]);

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  return (
    <div>
      <table className="table bg-neutral rounded-none">
        <thead>
          <tr style={{ fontSize: "1rem" }}>
            <th>{eventName}</th>
            <th>Date: {eventDate}</th>
            <th>Location: {eventLocation}</th>
            <th>Total Guests: {eventGuests}</th>
            <th>Your Guest Count: {eventUserGuests}</th>
            <th>
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn btn-accent bg-orange-400 text-black px-10 hover:bg-orange-500"
                type="button"
                id="editDetailsButton"
              >
                Edit Event Details
              </button>
            </th>
            <th>
              <button
                onClick={() => handleDeleteEvent()}
                className="btn btn-accent bg-red-500 text-black px-10 hover:bg-red-600"
                type="button"
                id="deleteEventButton"
              >
                Delete Event
              </button>
            </th>
          </tr>
        </thead>
      </table>
      {isFormOpen && (
        <form onSubmit={handleSubmit} style={{ marginLeft: "0.5rem" }}>
          <div style={{ display: "felx", flexDirection: "row" }}>
            <label className="text-lg text-slate-50" htmlFor="eventNameUpdate" style={{ marginLeft: "0.7rem" }}>
              Event Name
            </label>
            <label className="text-lg text-slate-50" htmlFor="eventDateUpdate" style={{ marginLeft: "14.7rem" }}>
              Event Date
            </label>
            <label className="text-lg text-slate-50" htmlFor="eventLocationUpdate" style={{ marginLeft: "15rem" }}>
              Event Location
            </label>
          </div>
          <input
            className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
            type="text"
            id="eventNameUpdate"
            name="eventNameUpdate"
            placeholder={eventName}
            style={{ marginLeft: "0.5rem" }}
            ref={eventNameUpdate}
          />
          <input
            className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
            type="datetime-local"
            id="eventDateUpdate"
            name="eventDateUpdate"
            placeholder={eventDate}
            style={{ marginLeft: "0.5rem" }}
            ref={eventDateUpdate}
          />
          <input
            className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
            type="text"
            id="eventLocationUpdate"
            name="eventLocationUpdate"
            placeholder={eventLocation}
            style={{ marginLeft: "0.5rem" }}
            ref={eventLocationUpdate}
          />
          <button
            type="submit"
            className="btn btn-square bg-green-400 text-black px-10 hover:bg-green-500"
            style={{ marginLeft: "0.5rem" }}
          >Submit</button>
          <button
            type="button"
            className="btn btn-square bg-orange-400 text-black px-10 hover:bg-orange-500"
            style={{ marginLeft: "0.5rem" }}
            onClick={() => setIsFormOpen(false)}
          >Close</button>
        </form>
      )}
    </div>
  );
}

EventTitleManager.propTypes = {
  eventId: PropTypes.string,
  isAdmin: PropTypes.bool
}

export default EventTitleManager;
