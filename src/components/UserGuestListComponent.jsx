import React, { useEffect, useState, useRef  } from 'react';
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';

function GuestListComponent({ onUpdate }) {
    const { eventName } = useParams();
    const [guestList, setGuestList] = useState([]);
    const guestNameRef = useRef(null);

    const getGuestList = async () => {
        try {
            const response = await fetch('//localhost:3000/api/getUserGuestList', {
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
            if(response.ok){
                setGuestList(currentGuests => [...currentGuests, { guestName }]);
                onUpdate(guestName, "add");
                guestNameRef.current.value = '';
            }
            console.log(result);
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
