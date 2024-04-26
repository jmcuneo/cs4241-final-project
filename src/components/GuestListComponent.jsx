import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";


function GuestListComponent({guestList}) {
    const { eventName } = useParams();

    //table with n rows and 2 columns: guestName and invitedBy
    //tr-cols | tbody-rows
    return (
        <div className='guest-list'>
            <h1>Guest List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Guest Name</th>
                        <th>Invited By</th>
                    </tr>
                </thead>
                <tbody>
                    {guestList.map((guest, index) => (
                        <tr key={index}>
                            <td>{guest.guestName}</td>
                            <td>{guest.invitedBy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GuestListComponent;
