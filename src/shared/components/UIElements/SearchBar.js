import React from "react";
import { useHistory } from "react-router-dom";
import { Paper, InputBase, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import "./SearchBar.css";

const SearchBar = ({ placeHolder, searchText, handleSearch, globalSearch }) => {
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
    <Paper component="form" className="searchBar">
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
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
    </Paper>
  );
};

export default SearchBar;
