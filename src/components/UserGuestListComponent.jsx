import React, { useEffect, useState, useRef  } from 'react';
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';

function GuestListComponent({ onUpdate, manage }) {
    const { eventName } = useParams();
    const [guestList, setGuestList] = useState([]);
    const guestNameRef = useRef(null);
    const [message, setMessage] = useState('');

    const getGuestList = async () => {
        try {
            const response = await fetch(apiPoint, {
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
            console.error('Error getting invited guests:', error);
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
            if(result.success == true){
                setGuestList(currentGuests => [...currentGuests, { guestName }]);
                onUpdate(guestName, "add");
                setMessage("");
            }
            else {
                console.log(result);
                setMessage("Error: " + result.error);
            }
            guestNameRef.current.value = '';
        } catch (error) {
            console.error('Error adding guest:', error);
        }
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
            if(response.ok) {
                setGuestList(currentGuests => currentGuests.filter(guest => guest.guestName !== guestName));
                onUpdate(guestName, "remove");
            }
            console.log(result);
        } catch (error) {
            console.error('Error removing guest:', error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const guestName = guestNameRef.current.value;
        addGuest(guestName); 
    }
    
    const handleRemove = async (guestName) => {
        removeGuest(guestName);
    };

    useEffect(() => {
    getGuestList();
    }, [eventName]);

    let title = "Your Guests";
    let apiPoint = "//localhost:3000/api/getUserGuestList"
    if (manage) {
        title = "Guest List";
        apiPoint = "//localhost:3000/api/getGuestList"
    }
    return (
        <div className='guest-list'>
            <div>
                <h1>{title}</h1>
                <div className='center-container'>
                {!manage && (
                    <div className='add-guest'>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <input type="text" id='addGuestName' placeholder='Guest Name' required ref={guestNameRef}/>
                        <button className='add-guest-button' type="submit">Add Guest</button>
                    </form>
                    <div style={{ fontSize: '20px', color: 'white'}}>{message}</div> 
                </div>
                )}
            </div>
                <table>
                    <thead>
                        <tr>
                            <th>Guest Name</th>
                            {manage && (
                                <th>Invited By</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {guestList.map((guest, index) => (
                            <tr key={index}>
                                <td>{guest.guestName}</td>
                                {manage && (
                                    <td>{guest.invitedBy}</td>
                                )}
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
            </div>
        </div>
    );
}

GuestListComponent.propTypes = {
    showInvite: PropTypes.bool
}

export default GuestListComponent;
