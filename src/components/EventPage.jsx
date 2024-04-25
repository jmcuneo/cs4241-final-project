import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import GuestListComponent from "./GuestListComponent.jsx";
import UserGuestListComponent from "./UserGuestListComponent.jsx";
import TopButtons from './TopButtons.jsx';
import PropTypes from 'prop-types';
import AddGuest from './AddGuest.jsx';

function EventPage({ onLogout }) {
    const navigate = useNavigate();
    const { eventName } = useParams();

    const handleManageEventPage = async (event) => {
        event.preventDefault();
        navigate("/event/manage/" + encodeURI(eventName));
    }

    return (
        <div className='main-page-container'>
            <div className='header-section'>
                <h1>Event Page</h1>
                <button style={{ marginLeft: '20px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold' }}
                    className="btn waves-effect waves-light"
                    type="button"
                    id="manageEventPageButton"
                    onClick={handleManageEventPage}>Manage Event</button>
            </div>
            <TopButtons onLogout={onLogout} showBackButton={true} showProfileButton={true}/>
            <GuestListComponent />
            <UserGuestListComponent />
        </div>
    );
}

EventPage.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

export default EventPage;
