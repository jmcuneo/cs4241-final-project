import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import GuestListComponent from "./GuestListComponent";

function UserListComponent() {
    const { eventId } = useParams();
    const [userList, setUserList] = useState([]);
    const guestNameRef = useRef(null);
    const [message, setMessage] = useState("");
    const addInviterInput = useRef(null);

    //TODO: add pop up messages to each input field conirming a succesfull change

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
          setUserList(users);
        } catch (error) {
          console.error("Error getting users:", error);
        }
      };

    const handleRemove = async (username) => {
      try {
        const response = await fetch("//localhost:3000/api/removeAllowedInviter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            eventId: eventId,
            inviterName: username,
          }),
        });
        console.log(await response.json());

      } catch (error) {
        console.error("Error removing inviter:", error);
      }
    };

    const handleAdd = async () => {
      try {
        const response = await fetch("//localhost:3000/api/addAllowedInviter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            eventId: eventId,
            inviterName: addInviterInput.current.value,
          }),
        });
        console.log(await response.json());

      } catch (error) {
        console.error("Error adding inviter:", error);
      }

      addInviterInput.current.value = '';
    };

    useEffect(() => {
        getUserList();
    }, [eventId, userList]);

    const guestTable = () => {
        return (
          <div className="flex justify-center align-center overflow-y-auto">
            <table className="table table-zebra bg-neutral not-prose table-md  w-full">
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
                    <td>{user.fullName}</td>
                    <td>{user.username}</td>
                    <td>{user.guestCount}</td>
                    <td>
                      <button
                        className="btn bg-red-500 hover:bg-red-600 text-black font-bold "
                        type="button"
                        id={"removeButton" + index}
                        onClick={() => handleRemove(user.username)}
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
              <div className="flex overflow-y-auto">
                <h1 className="w" style={{marginLeft: "1rem", marginBottom: "1rem", marginTop: "1rem"}}>Inviter List</h1>
                <input
                  className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent ml-2"
                  type="text"
                  id="addInviterInput"
                  name="addInviterInput"
                  placeholder="input username"
                  style={{marginTop:"1.5rem", marginLeft:"1.5rem"}}
                  ref={addInviterInput}
                />
                <button
                  className="btn bg-green-500 hover:bg-green-600 text-black font-bold "
                  type="button"
                  id={"addButton"}
                  style={{margin: "1rem"}}
                  onClick={() => handleAdd()}
                >
                  Add Inviter
                </button>
              </div>
                <div className="grid columns-3 grid-cols-3 gap-1">
                    {userList.length > 0 ? (
                        guestTable()
                    ) : (
                        <p className="text-slate text-center w-full">No allowed inviters</p>
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
