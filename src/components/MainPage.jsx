import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import TableComponent from "./TableComponent";
import { motion } from "framer-motion";


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

  const [searchTerm, setSearchTerm] = useState("");
  const filteredEvents = events.filter((event) =>
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
        <div>
          <h1 className="header-section">Upcoming Events</h1>
        </div>
        <div className="max-h-[75vh] overflow-y-auto flex flex-col">
          <input
              style={{marginBottom: "-20px", width: '100%'}}
              type="text"
              placeholder="Search by Event name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
          <div className="flex-grow">
            <TableComponent
              headers={[
                "Name",
                "Date",
                "Location",
                "Guest Count",
                "User Invites",
              ]}
              rows={filteredEvents}
              isEvent={true}>
            </TableComponent>
          </div>
        </div>
      </div>
    </motion.div>
  </>
  );
}

MainPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default MainPage;
