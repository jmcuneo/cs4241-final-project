import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';

function GuestListComponent({ showInvite }) {
    const { eventName } = useParams();
    const [guestList, setGuestList] = useState([]);

    useEffect(() => {
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
    getGuestList();
    }, [eventName]);

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
            console.error('Error getting events:', error);
        }
    }

    const handleRemove = async (guestName) => {
        console.log("removing guest:  " + guestName);
        removeGuest(guestName);
    };

    //table with n rows and 2 columns: guestName and invitedBy
    //tr-cols | tbody-rows
    return (
        <table>
            {showInvite && (
                <thead>
                    <tr>
                        <th>Guest Name</th>
                        <th>Invited By</th>
                    </tr>
                </thead>
            )}
            <tbody>
                {guestList.map((guest, index) => (
                    <tr key={index}>
                        <td>{guest.guestName}</td>
                        {showInvite && (
                            <td>{guest.invitedBy}</td>
                        )}
                        {!showInvite && (
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
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

GuestListComponent.propTypes = {
    showInvite: PropTypes.bool
}

export default GuestListComponent;
