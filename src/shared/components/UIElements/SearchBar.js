import React from "react";

const SearchBar = (props) => {
  return (
    <div className='search-bar'>
      <input
        type='text'
        placeholder='Search...'
        onChange={(event) => props.onSearch(event.target.value)}
      />
    </div>
  );
};

export default SearchBar;
