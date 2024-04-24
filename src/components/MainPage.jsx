import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

//I think we can keep one main page and add in the 2 buttons if the user is an admin

function MainPage({ onLogout }) {
	const navigate = useNavigate()
	const handleProfile = async (event) => {
		event.preventDefault();
		navigate("/profile");
	};

	const handleEventPage = async (event) => {
		event.preventDefault();
		navigate("/event");
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
		<div className='main-page-container' style={{ display: 'flex', justifyContent: 'space-between' }
		}>
			<div>
				<h1 className='header-section'>Upcoming Events</h1>
			</div>
			<div className='top-right-buttons' style={{ display: 'flex' }}>
				<button style={{ marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold' }}
					className="btn waves-effect waves-light"
					type="button" id="eventPageButton"
					onClick={handleEventPage}>View Event Page</button>

				<button
					style={{ marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold' }}
					className="btn waves-effect waves-light"
					type="button"
					id="profilePageButton"
					onClick={handleProfile}
				>
					<FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
					Profile
				</button>
				<button
					style={{ marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(240, 91, 58)', color: 'black', fontWeight: 'bold' }}
					className="btn waves-effect waves-light"
					type="button"
					id="logoutButton"
					onClick={onLogout}
				>
					Logout
				</button>
			</div>
		</div >
	);
}

MainPage.propTypes = {
	onLogout: PropTypes.func.isRequired
}

export default MainPage;
