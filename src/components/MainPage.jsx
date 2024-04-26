import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import TableComponent from "./TableComponent";

//I think we can keep one main page and add in the 2 buttons if the user is an admin

function MainPage({ onLogout }) {
  const [events, setEvents] = useState([]);

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
  events.map((row) => {
    new Date(row.date).toLocaleDateString(navigator.languages, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  return (
    <>
      <Navbar onLogout={onLogout} showProfileButton={true}></Navbar>
      <div className="main-page-container relative flex min-h-screen flex-col mt-10 mx-auto items-center prose">
        <div>
          <h1 className="header-section">Upcoming Events</h1>
        </div>
        <div>
          <TableComponent
            headers={[
              "Name",
              "Date",
              "Location",
              "Guest Count",
              "User Invites",
            ]}
            rows={events}
            isEvent={true}
          ></TableComponent>
        </div>
      </div>
    </>
  );
}

MainPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default MainPage;
