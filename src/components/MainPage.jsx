import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import TopButtons from './TopButtons';

//I think we can keep one main page and add in the 2 buttons if the user is an admin

function MainPage({ onLogout }) {
	const navigate = useNavigate()

	const handleEventPage = async (event) => {
		event.preventDefault();
		navigate("/event/Dummy%20Event");
	}

	const getUpcomingEvents = async () => {
		try {
			const response = await fetch('//localhost:3000/api/getUpcomingEvents', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token: localStorage.getItem('token') }),
			});

			const events = await response.json();
			console.log(events);
		} catch (error) {
			console.error('Error getting events:', error);
		}
	}

	useEffect(() => {
		getUpcomingEvents();
	}, []);

	return (
		<div className='main-page-container'>
			<div>
				<h1 className='header-section'>Upcoming Events</h1>
			</div>
			<div style={{ marginTop: "100px" }}>
				<button style={{ marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold' }} className="btn waves-effect waves-light" type="button" id="eventPageButton" onClick={handleEventPage}>View Event Page</button>
				<TopButtons onLogout={onLogout} showProfileButton={true}></TopButtons>
			</div>
		</div>
	);
}

MainPage.propTypes = {
	onLogout: PropTypes.func.isRequired
}

export default MainPage;
