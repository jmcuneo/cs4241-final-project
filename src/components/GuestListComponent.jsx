import PropTypes from "prop-types";

function GuestListComponent({ guestList, shouldDisplayTitle }) {

  return (
    <div className="overflow-x-auto prose">
      {shouldDisplayTitle && <h1>Guest List</h1>}
      <table className="table table-zebra bg-neutral not-prose table-md">
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

GuestListComponent.propTypes = {
  guestList: PropTypes.array.isRequired,
  shouldDisplayTitle: PropTypes.bool
};

export default GuestListComponent;
