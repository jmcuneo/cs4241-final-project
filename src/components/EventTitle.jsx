import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EventTitle({ eventId, isAdmin }) {
  const navigate = useNavigate();
  const [thisEvent, setThisEvent] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventGuests, setEventGuests] = useState(0);
  const [eventUserGuests, setEventUserGuests] = useState(0);

  function formatEventDate(dateString) {
    const date = new Date(dateString);

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
    const formattedDate = date.toLocaleString('en-US', options);

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

  const handleManageEventPage = async (event) => {
    event.preventDefault();
    navigate("/event/manage/" + encodeURI(eventId));
  };

  const updateEventData = useCallback(() => {
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
    getEvent();
  }, [getEvent]);

  useEffect(() => {
    updateEventData();
  }, [updateEventData]);

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
            {isAdmin && (
              <th>
                <button
                  className="btn btn-primary ml-2 text-black font-bold"
                  type="button"
                  id="manageEventPageButton"
                  onClick={handleManageEventPage}
                >
                  Manage Event
                </button>
              </th>
            )}
          </tr>
        </thead>
      </table>
    </div>
  );
}

EventTitle.propTypes = {
  eventId: PropTypes.string,
  isAdmin: PropTypes.bool
}

export default EventTitle;
