import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function Navbar({ onLogout, showProfileButton, showBackButton }) {
  const navigate = useNavigate();
  const handleProfile = async (event) => {
    event.preventDefault();
    navigate("/profile");
  };

  const handleBack = async () => {
    window.history.back(); // Go back in the browser history
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl" href="/" onClick={() => navigate("/")}>
          EventManager
        </a>
      </div>
      <div className="navbar-end">
        {showBackButton && (
          <button
            className="btn btn-accent mr-1"
            type="button"
            id="backButton"
            onClick={handleBack}
          >
            <i className={"fa fa-arrow-circle-o-left mr-1 text-lg"}></i>
            Back
          </button>
        )}
        {showProfileButton && (
          <button
            className="btn btn-primary mr-1"
            type="button"
            id="profilePageButton"
            onClick={handleProfile}
          >
            <FontAwesomeIcon icon={faUser} className="mr-1"  />
            Profile
          </button>
        )}
        <button
          type="button"
          id="logoutButton"
          onClick={onLogout}
          className="btn btn-square bg-red-500 text-black px-10 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  showProfileButton: PropTypes.bool,
  showBackButton: PropTypes.bool,
};

export default Navbar;
