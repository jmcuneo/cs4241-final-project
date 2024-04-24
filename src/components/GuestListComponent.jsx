import React from 'react';

function GuestListComponent() {
    const guestList = [
        { guestName: 'guest1', invitedBy: 'guest2' },
        { guestName: 'guest3', invitedBy: 'guest2' },
    ] //eventually get table from database

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
