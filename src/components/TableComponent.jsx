import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function TableComponent({ headers, rows, isEvent }) {
  // console.log(JSON.stringify(rows));
  const navigate = useNavigate();

  function handleClick(eventId) {
    navigate("/event/" + encodeURI(eventId));
  }
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra bg-neutral table-md">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowsIdx) => (
            <tr
              key={rowsIdx}
              className="hover cursor-pointer"
              onClick={() => (isEvent ? handleClick(row._id) : () => false)}
            >
              {Object.entries(row).filter(([key]) => key !== '_id').map(([, value], rowIdx) => (
                <td key={rowIdx}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TableComponent.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.any).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEvent: PropTypes.bool,
};

export default TableComponent;
