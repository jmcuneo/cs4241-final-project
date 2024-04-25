import React, { useEffect, useState, useRef  } from 'react';
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';

function GuestListComponent() {
    const { eventName } = useParams();
    const [guestList, setGuestList] = useState([]);
    const guestNameRef = useRef(null);

    const getGuestList = async () => {
        try {
            const response = await fetch('//localhost:3000/api/getGuestList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token'),
                    eventName: eventName
                }),
            });

            const guests = await response.json();
            setGuestList(guests);
        } catch (error) {
            console.error('Error getting events:', error);
        }
    }

    const addGuest = async (guestName) => {
        try {
            const response = await fetch('//localhost:3000/api/inviteGuest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token'),
                    eventName: eventName,
                    guestName: guestName
                }),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error adding guest:', error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const guestName = guestNameRef.current.value;
        // Update local state immediately for UI responsiveness
        setGuestList(currentGuests => [...currentGuests, { guestName }]);
        // Send the API request to add the guest on the backend 
        addGuest(guestName); 
    }

    const removeGuest = async (guestName) => {
        try {
            const response = await fetch('//localhost:3000/api/uninviteGuest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token'),
                    eventName: eventName,
                    guestName: guestName
                }),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error removing guest:', error);
        }
    }

    const handleRemove = async (guestName) => {
        removeGuest(guestName);
        setGuestList(currentGuests => currentGuests.filter(guest => guest.guestName !== guestName));
    };

    useEffect(() => {
    getGuestList();
    }, [eventName]);

    //table with n rows and 2 columns: guestName and invitedBy
    //tr-cols | tbody-rows
    return (
        <div className='guest-list' style={{left: "60rem"}}>
            <h1>Your Guests</h1>
            <table style={{position:"fixed", top:"13rem"}}>
                <thead>
                    <tr>
                        <th>Guest Name</th>
                    </tr>
                </thead>
                <tbody>
                    {guestList.map((guest, index) => (
                        <tr key={index}>
                            <td>{guest.guestName}</td>
                            <td>
                                <button
                                    style={{ backgroundColor: 'rgb(240, 91, 58)', color: 'black', fontWeight: 'bold' }}
                                    className="btn waves-effect waves-light"
                                    type="button"
                                    id={"removeButton" + index}
                                    onClick={() => handleRemove(guest.guestName)}
                                >Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='add-guest'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" id='addGuestName' placeholder='Guest Name' required ref={guestNameRef} style={{fontSize: "1.1rem", marginTop: "0.5rem"}}/>
                    <button className='add-guest-button' type="submit">Add Guest</button>
                </form>
            </div>
        </div>
    );
}

GuestListComponent.propTypes = {
    showInvite: PropTypes.bool
}

export default GuestListComponent;
