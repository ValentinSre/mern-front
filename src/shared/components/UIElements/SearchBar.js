import React from "react";
import { Paper, InputBase, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import "./SearchBar.css";

const SearchBar = ({ placeHolder, searchText, handleSearch }) => {
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
      />
    </Paper>
  );
};

export default SearchBar;
