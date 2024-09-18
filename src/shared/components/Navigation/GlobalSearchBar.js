import React from "react";
import { useHistory } from "react-router-dom";
import { InputBase, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import "./GlobalSearchBar.css";

const GlobalSearchBar = ({
  placeHolder,
  searchText,
  handleSearch,
  globalSearch,
  toggleSearchBar,
}) => {
  const history = useHistory();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (globalSearch) {
        const el = { target: { value: "" } };
        history.push(`/search?q=${searchText}`);
        handleSearch(el);
      }
    }
  };

  return (
    <React.Fragment component='form' className='globalSearchBar'>
      <IconButton
        type='button'
        sx={{ p: "10px" }}
        aria-label='search'
        onClick={toggleSearchBar}
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        style={{ marginLeft: "8px", flex: 1 }}
        placeholder={placeHolder}
        inputProps={{ "aria-label": "search google maps" }}
        value={searchText}
        onChange={handleSearch}
        onKeyPress={handleKeyPress}
      />
    </React.Fragment>
  );
};

export default GlobalSearchBar;
