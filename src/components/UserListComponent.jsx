import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import GuestListComponent from "./GuestListComponent";

function UserListComponent({ onUpdate }) {
    const { eventId } = useParams();
    const [userList, setUserList] = useState([]);
    const guestNameRef = useRef(null);
    const [message, setMessage] = useState("");

    const getUserList = async () => {
        try {
          const response = await fetch("//localhost:3000/api/getAllowedInviters", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: localStorage.getItem("token"),
              eventId: eventId,
            }),
          });
    
          const users = await response.json();
          console.log(users);
          setUserList(users);
        } catch (error) {
          console.error("Error getting users:", error);
        }
      };

    const handleRemove = async (guestName) => {
        
    };

    useEffect(() => {
        //getUserList();
    }, [eventId]);

    const guestTable = () => {
        return (
            <div className="flex justify-center align-center overflow-y-auto">
                <table className="table table-zebra bg-neutral not-prose table-md">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Guest Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userList.map((user, index) => (
                        <tr key={index}>
                            <td>{user.firstName + " " + user.lastName}</td>
                            <td>{user.username}</td>
                            <td>{user.guestCount}</td>
                            <td>
                                <button
                                    className="btn bg-red-500 hover:bg-red-600 text-black font-bold "
                                    type="button"
                                    id={"removeButton" + index}
                                    onClick={() => handleRemove(user.userName)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="prose min-w-screen">
            <div className="flex flex-col px-2  w-screen">
                <h1 className="w" style={{marginLeft: "1rem", marginBottom: "1rem", marginTop: "1rem"}}>User List</h1>
                <div className="grid columns-3 grid-cols-3 gap-1">
                    {userList.length > 0 ? (
                        guestTable()
                    ) : (
                        <p className="text-slate text-center w-full">No guests invited</p>
                    )}
                </div>
            </div>
        </div>
    );
}

UserListComponent.propTypes = {
    onUpdate: PropTypes.func,
};

export default UserListComponent;
