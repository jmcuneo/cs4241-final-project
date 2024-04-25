import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import AddGuest from "./AddGuest.jsx";


function UserGuestInviteList() {
    const { eventName } = useParams();
    const [inviteList, setInviteList] = useState([]);
    // const inviteList = [
    //     { guestName: 'guest1', invitedBy: 'guest2' },
    //     { guestName: 'guest3', invitedBy: 'guest2' },
    // ] //eventually get table from database


    useEffect(() => {
        //todo: refactor 'getGuestList' to user's invite list for event
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
                setInviteList(guests);
            } catch (error) {
                console.error('Error getting events:', error);
            }
        }
        getGuestList();
    }, [eventName]);


    //table with n rows and 2 columns: guestName and invitedBy
    //tr-cols | tbody-rows
    return (
        <div className='user-invite-list'>
            <h1>Your Invited Guests</h1>
            <table>
                <thead>
                <tr>
                    <th>Guest Name</th>
                </tr>
                </thead>
                <tbody>
                {inviteList.map((guest, index) => (
                    <tr key={index}>
                        <td>{guest.guestName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <AddGuest/>
        </div>
    );
}

export default UserGuestInviteList;
