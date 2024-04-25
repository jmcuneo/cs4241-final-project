import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import TopButtons from "./TopButtons";
import TableComponent from "./TableComponent";

//I think we can keep one main page and add in the 2 buttons if the user is an admin

function MainPage({ onLogout }) {
//   const navigate = useNavigate();

  const [events, setEvents] = useState([]);

//   const handleEventPage = async (event) => {
//     event.preventDefault();
//     navigate("/event/Dummy%20Event");
//   };

  useEffect(() => {
    const getUpcomingEvents = async () => {
      try {
        const response = await fetch("//localhost:3000/api/getUpcomingEvents", {
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
    };
    getUpcomingEvents();
  }, []);

  return (
    <div className="main-page-container relative flex min-h-screen flex-col justify-center mx-auto items-center prose">
      <TopButtons onLogout={onLogout} showProfileButton={true}></TopButtons>
      <div>
        <h1 className="header-section">Upcoming Events</h1>
      </div>
      <div className="mt-10">
        {/* <button
          className="btn btn-primary"
          type="button"
          id="eventPageButton"
          onClick={handleEventPage}
        >
          View Event Page
        </button> */}

        <TableComponent
          headers={["Date", "Guest Count", "Location", "Name", "User Invites"]}
          rows={events}
          isEvent={true}
        ></TableComponent>
      </div>
    </div>
  );
}

MainPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default MainPage;
