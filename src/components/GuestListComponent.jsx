import { useParams } from "react-router-dom";
import {useState, useEffect} from "react"
import TableComponent from "./TableComponent";

function GuestListComponent() {
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


    //table with n rows and 2 columns: guestName and invitedBy
    //tr-cols | tbody-rows
    //should get headers and events and pass to TableComponent
    return (
        <TableComponent headers={["Guest Name", "Invited By"]} rows={guestList}></TableComponent>



        // <div className='guest-list'>
        //     <h1>Guest List</h1>
        //     <table>

        //         <thead>
        //             <tr>
        //                 <th>Guest Name</th>
        //                 <th>Invited By</th>
        //             </tr>
        //         </thead>

        //         <tbody>
        //             {guestList.map((guest, index) => (
        //                 <tr key={index}>
        //                     <td>{guest.guestName}</td>
        //                     <td>{guest.invitedBy}</td>
        //                 </tr>
        //             ))}
        //         </tbody>

        //     </table>
        // </div>
    );
}

export default GuestListComponent;
