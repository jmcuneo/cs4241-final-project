import { useState } from "react";
import PropTypes from "prop-types";

function GuestListComponent({ guestList, shouldDisplayTitle }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuestList = guestList.filter((guest) =>
    guest.guestName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto prose">
      {shouldDisplayTitle && <h1>Guest List</h1>}
      <input 
        style={{marginBottom: "0.2rem"}}
        type="text"
        placeholder="Search by guest name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <table className="table table-zebra bg-neutral not-prose table-md max-h-[75vh] w-full overflow-y-auto">
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Invited By</th>
          </tr>
        </thead>
        <tbody>
          {filteredGuestList.map((guest, index) => (
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

GuestListComponent.propTypes = {
  guestList: PropTypes.array.isRequired,
  shouldDisplayTitle: PropTypes.bool,
};

export default GuestListComponent;
