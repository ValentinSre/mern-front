import React from "react";
import {
  InputLabel,
  MenuItem,
  Select,
  Chip,
  TextField,
} from "@material-ui/core";
import { Delete as DeleteIcon, Done as DoneIcon } from "@material-ui/icons";

const CollectionFilter = ({
  selectedSort,
  selectedGroupment,
  editeurs,
  handleSortChange,
  handleGroupmentChange,
  handleEditeursSelection,
  handleSearchBooks,
}) => {
  const DeletableChips = ({ editeurs: editeursAvailability, handleDelete }) => {
    const editeursName = Object.keys(editeursAvailability);
    return editeursName.map((name) => (
      <Chip
        key={name}
        label={name}
        deleteIcon={editeursAvailability[name] ? <DeleteIcon /> : <DoneIcon />}
        onDelete={() => handleDelete(name)}
        variant={editeursAvailability[name] ? "default" : "outlined"}
      />
    ));
  };

  const [searchText, setSearchText] = React.useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    handleSearchBooks(event.target.value);
  };
  return (
    <div
      style={{
        padding: "20px",
        borderBottom: "1px solid #ccc",
        background: "#fff",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          padding: "20px",
          // margin: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <InputLabel id='label-tri' style={{ paddingBottom: "5px" }}>
          Tri
        </InputLabel>

        <Select
          label='Tri'
          id='tri-select'
          value={selectedSort}
          onChange={handleSortChange}
          fullWidth
        >
          <MenuItem value={0}>Par ajout</MenuItem>
          <MenuItem value={1}>Par titre/série</MenuItem>
          <MenuItem value={2}>Par prix</MenuItem>
          <MenuItem value={3}>Par date</MenuItem>
          <MenuItem value={4}>Par note</MenuItem>
        </Select>

        <div style={{ marginTop: "10px" }}>
          <InputLabel id='label-groupement' style={{ paddingBottom: "5px" }}>
            Groupement
          </InputLabel>
          <Select
            label='Groupement'
            id='demo-simple-select'
            value={selectedGroupment}
            onChange={handleGroupmentChange}
            fullWidth
          >
            <MenuItem value={0}>Sans groupement</MenuItem>
            <MenuItem value={1}>Par éditeur</MenuItem>
            <MenuItem value={2}>Par format</MenuItem>
            <MenuItem value={3}>Par auteur</MenuItem>
            <MenuItem value={4}>Par dessinateur</MenuItem>
            <MenuItem value={5}>Par genre</MenuItem>
            <MenuItem value={6}>Par année</MenuItem>
            <MenuItem value={7}>Par type</MenuItem>
          </Select>
        </div>
        <TextField
          label='Recherche'
          variant='outlined'
          value={searchText}
          onChange={handleSearch}
          margin='normal'
          fullWidth
          InputLabelProps={{ position: "top" }}
        />
        <DeletableChips
          editeurs={editeurs}
          handleDelete={handleEditeursSelection}
        />
        {/* <CollectionAutocompletes collection={collection} /> */}
      </div>
    </div>
  );
};

export default CollectionFilter;
