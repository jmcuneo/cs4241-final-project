import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types"

function EventTitleManager({ eventName }) {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventGuests, setEventGuests] = useState(0);
    const [eventUserGuests, setEventUserGuests] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const eventNameUpdate = useRef(null);
    const eventDateUpdate = useRef(null);
    const eventLocationUpdate = useRef(null);
    
    let thisEvent = null;

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

    const getUpcomingEvents = async () => {
        try {
          const response = await fetch("//localhost:3000/api/getUpcomingEvents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: localStorage.getItem("token") }),
          });

          if (response.ok) setIsFormOpen(false);
  
        } catch (error) {
          console.error("Error getting events:", error);
        }
      };

      const updateEvent = async (newEventName, newEventDate, newEventLocation) => {
        try {
          const response = await fetch("//localhost:3000/api/modifyEvent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              token: localStorage.getItem("token"),
              eventBody: {newEventName, newEventDate, newEventLocation}
            }),
          });
  
            const _events = await response.json();
            setEvents(_events);
        } catch (error) {
          console.error("Error updating event:", error);
        }
      };

    const handleSubmit = async (event) => {
      event.preventDefault();
      let newEventName = eventNameUpdate.current.value;
      let newEventDate = eventDateUpdate.current.value;
      let newEventLocation = eventLocationUpdate.current.value;
      if (newEventName == "") newEventName = eventName;
      if (newEventDate == "") newEventDate = eventDate;
      if (newEventLocation == "") newEventLocation = eventLocation;
      updateEvent(newEventName, newEventDate, newEventLocation);
    };

    useEffect(() => {
      getUpcomingEvents();
      thisEvent = events.find(event => event.name === eventName)
      if (thisEvent) {
        const formattedDateString = formatEventDate(thisEvent.date);
        setEventDate(formattedDateString);
        setEventLocation(thisEvent.location);
        setEventGuests(thisEvent.guestCount);
        setEventUserGuests(thisEvent.userInvites);
      }
    }, [events, eventName]);

  return (
    <div>
      <table className="table bg-neutral rounded-none">
        <thead>
          <tr style={{fontSize:  "1rem"}}>
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
          </tr>
        </thead>
      </table>
      {isFormOpen && (
          <form onSubmit={handleSubmit} style={{marginLeft:"0.5rem"}}>
              <div style={{display:"felx", flexDirection: "row"}}>
                <label className="text-lg text-slate-50" htmlFor="eventNameUpdate" style={{marginLeft:"0.7rem"}}>
                  Event Name
                </label>
                <label className="text-lg text-slate-50" htmlFor="eventDateUpdate" style={{marginLeft:"14.7rem"}}>
                  Event Date
                </label>
                <label className="text-lg text-slate-50" htmlFor="eventLocationUpdate" style={{marginLeft:"15rem"}}>
                  Event Location
                </label>
              </div>
              <input
                className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
                type="text"
                id="eventNameUpdate"
                name="eventNameUpdate"
                placeholder={eventName}
                style={{marginLeft:"0.5rem"}}
                ref={eventNameUpdate}
              />
              <input
                className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
                type="datetime-local"
                id="eventDateUpdate"
                name="eventDateUpdate"
                placeholder={eventDate}
                style={{marginLeft:"0.5rem"}}
                ref={eventDateUpdate}
              />
              <input
                className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
                type="text"
                id="eventLocationUpdate"
                name="eventLocationUpdate"
                placeholder={eventLocation}
                style={{marginLeft:"0.5rem"}}
                ref={eventLocationUpdate}
              />      
              <button 
                type="submit"
                className="btn btn-square bg-green-400 text-black px-10 hover:bg-green-500"
                style={{marginLeft:"0.5rem"}}
              >Submit</button>
              <button 
              type="button" 
              className="btn btn-square bg-orange-400 text-black px-10 hover:bg-orange-500"
              style={{marginLeft:"0.5rem"}}
              onClick={() => setIsFormOpen(false)}
              >Close</button> 
          </form>
      )}
    </div>
  );
}

EventTitleManager.propTypes = {
  eventName: PropTypes.string,
  isAdmin: PropTypes.bool
}

export default EventTitleManager;
