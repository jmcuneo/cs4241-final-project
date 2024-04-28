import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import EventTitle from "./EventTitle.jsx";
import Navbar from "./Navbar.jsx";
import UserGuestListComponent from "./UserGuestListComponent.jsx";

function EventPage({ isAdmin, onLogout }) {
  const { eventId } = useParams();

  return (
    <>
      <Navbar
        onLogout={onLogout}
        showBackButton={true}
        showProfileButton={true}
      ></Navbar>
      <div className="min-w-screen mx-auto">
        <div>
          <EventTitle eventId={eventId} isAdmin={isAdmin} />
        </div>
        <div className="userguestlistwrapper">
          <UserGuestListComponent
            manage={false}
          />
        </div>
      </div>
    </>
  );
}

EventPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default EventPage;
