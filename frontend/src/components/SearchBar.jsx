import "./SearchBar.css";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        placeholder="Search by Service..."
        onChange={handleSearch}
        value={query}
      ></input>
    </div>
  );
};

export default SearchBar;
