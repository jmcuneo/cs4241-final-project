import React, { useState, useRef } from 'react';
import { useParams } from "react-router-dom";

function AddGuest(){
    const { eventName } = useParams();
    const guestNameRef = useRef(null);

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
                    guestName: guestNameRef.current.value
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
        addGuest();
    }

    return(
        <div className='add-guest'>
            <form onSubmit={handleSubmit}>
                <input type="text" id='addGuestName' placeholder='Guest Name' required ref={guestNameRef} style={{fontSize: "1.1rem", marginTop: "0.5rem"}}/>
                <button className='add-guest-button' type="submit">Add Guest</button>
            </form>
        </div>
    )
}

export default AddGuest;