import { useState } from "react";

import { FaSortUp } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";

const SortButtons = ({ field, filteredEmployees, setFilteredEmployees }) => {
  
const [activeDirection, setActiveDirection] = useState(null);
  
const handleSort = (e, direction) => {
    e.stopPropagation();
    if (activeDirection === direction) return; 
    const sorted = [...filteredEmployees].sort((a, b) => {
      if (direction === "asc") {
        return a[field] < b[field] ? 1 : -1;
      } else if (direction === "desc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        throw new Error("Invalid sort direction");
      }
    });
    setFilteredEmployees(sorted);
    setActiveDirection(direction);
  };

  const handleSortAsc = (e) => handleSort(e, "asc");
  const handleSortDesc = (e) => handleSort(e, "desc");



  return (
    <div className="sort-wrapper">
      <button
        onClick={handleSortAsc}
        className="mb-1 sort-button"
        aria-label={`Sort ${field} ascending`}
      >
        <FaSortUp className="sort-icon" />
      </button>
      <button
        onClick={handleSortDesc}
        aria-label={`Sort ${field} descending`}
        className="sort-button"
      >
        <FaSortDown className="sort-icon" />
      </button>
    </div>
  );
};

export default SortButtons;
