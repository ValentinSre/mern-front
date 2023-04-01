import React from "react";
import {
  InputLabel,
  MenuItem,
  Select,
  Chip,
  TextField,
} from "@material-ui/core";
import { Delete as DeleteIcon, Done as DoneIcon } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";

const CollectionFilter = ({
  collection,
  selectedSort,
  selectedGroupment,
  editeurs,
  handleSortChange,
  handleGroupmentChange,
  handleEditeursSelection,
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

  const CollectionAutocompletes = ({ collection }) => {
    return (
      <div>
        <Autocomplete
          id=''
          freeSolo
          options={
            collection
              .map((book) => (book.serie ? book.serie : undefined))
              .filter((serie) => serie !== undefined) // Ajoutez cette ligne pour exclure les valeurs nulles ou non définies
          }
          getOptionLabel={(option) => option} // Ajoutez cette ligne pour éviter l'erreur "getOptionLabel"
          renderInput={(params) => <TextField {...params} label='freeSolo' />}
        />
      </div>
    );
  };

  return (
    <div className='collection'>
      <InputLabel id='label-tri' style={{ paddingBottom: "5px" }}>
        Tri
      </InputLabel>

      <Select
        label='Tri'
        id='tri-select'
        value={selectedSort}
        onChange={handleSortChange}
        className='collection-filter'
      >
        <MenuItem value={0}>Par défaut</MenuItem>
        <MenuItem value={1}>Par titre/série</MenuItem>
        <MenuItem value={2}>Par prix</MenuItem>
        <MenuItem value={3}>Par date</MenuItem>
        <MenuItem value={4}>Par note</MenuItem>
      </Select>
      <InputLabel id='label-groupement' style={{ paddingBottom: "5px" }}>
        Groupement
      </InputLabel>
      <Select
        label='Groupement'
        id='demo-simple-select'
        value={selectedGroupment}
        onChange={handleGroupmentChange}
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
      <DeletableChips
        editeurs={editeurs}
        handleDelete={handleEditeursSelection}
      />
      {/* <CollectionAutocompletes collection={collection} /> */}
    </div>
  );
};

export default CollectionFilter;
