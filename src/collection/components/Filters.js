import React from "react";
import {
  InputLabel,
  MenuItem,
  Select,
  Chip,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
  Paper,
  InputBase,
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Done as DoneIcon,
  Search as SearchIcon,
} from "@material-ui/icons";
import { FaListUl, FaTh } from "react-icons/fa";
import SearchBar from "../../shared/components/UIElements/SearchBar";

const CollectionFilter = ({
  selectedSort,
  collection,
  displayMode,
  selectedGroupment,
  editeurs,
  handleSortChange,
  handleGroupmentChange,
  handleEditeursSelection,
  handleSearchBooks,
  setDisplayMode,
  checkedValues,
  handleCheckedChange,
  setLoadedCollection,
}) => {
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
        <IconButton
          onClick={() => {
            setDisplayMode("bySeries");
            setLoadedCollection(null);
          }}
          disabled={displayMode === "bySeries"}
        >
          <FaListUl />
        </IconButton>
        <IconButton
          onClick={() => {
            setDisplayMode("byBooks");
            setLoadedCollection(null);
          }}
          disabled={displayMode === "byBooks"}
        >
          <FaTh />
        </IconButton>

        {displayMode === "bySeries" && (
          <SeriesFilter
            collection={collection}
            checkedValues={checkedValues}
            handleCheckedChange={handleCheckedChange}
            handleSearch={handleSearch}
            editeurs={editeurs}
            handleDelete={handleEditeursSelection}
          />
        )}

        {displayMode === "byBooks" && (
          <BooksFilter
            collection={collection}
            checkedValues={checkedValues}
            handleCheckedChange={handleCheckedChange}
            handleSearch={handleSearch}
            selectedSort={selectedSort}
            handleSortChange={handleSortChange}
            selectedGroupment={selectedGroupment}
            handleGroupmentChange={handleGroupmentChange}
            editeurs={editeurs}
            handleDelete={handleEditeursSelection}
          />
        )}
      </div>
    </div>
  );
};

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

const SeriesFilter = ({
  collection,
  checkedValues,
  handleCheckedChange,
  handleSearch,
  searchText,
  editeurs,
  handleDelete,
}) => {
  return (
    <div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedValues.BD}
              onChange={handleCheckedChange}
              name="BD"
            />
          }
          label="Bande dessinée"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedValues.Comics}
              onChange={handleCheckedChange}
              name="Comics"
            />
          }
          label="Comics"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedValues.Manga}
              onChange={handleCheckedChange}
              name="Manga"
            />
          }
          label="Manga"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedValues.Roman}
              onChange={handleCheckedChange}
              name="Roman"
            />
          }
          label="Roman"
        />
      </div>
      <div>
        <SearchBar
          searchText={searchText}
          handleSearch={handleSearch}
          placeHolder="Rechercher une série..."
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <DeletableChips editeurs={editeurs} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

const BooksFilter = ({
  selectedSort,
  handleSortChange,
  selectedGroupment,
  handleGroupmentChange,
  checkedValues,
  handleCheckedChange,
  handleSearch,
  searchText,
  editeurs,
  handleDelete,
}) => {
  return (
    <div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedValues.BD}
              onChange={handleCheckedChange}
              name="BD"
            />
          }
          label="Bande dessinée"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedValues.Comics}
              onChange={handleCheckedChange}
              name="Comics"
            />
          }
          label="Comics"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedValues.Manga}
              onChange={handleCheckedChange}
              name="Manga"
            />
          }
          label="Manga"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedValues.Roman}
              onChange={handleCheckedChange}
              name="Roman"
            />
          }
          label="Roman"
        />
      </div>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
        }}
      >
        <div>
          <InputLabel id="label-tri" style={{ paddingBottom: "5px" }}>
            Tri
          </InputLabel>

          <Select
            label="Tri"
            id="tri-select"
            value={selectedSort}
            onChange={handleSortChange}
          >
            <MenuItem value={0}>Par titre/série</MenuItem>
            <MenuItem value={1}>Par prix</MenuItem>
            <MenuItem value={2}>Par note</MenuItem>
          </Select>
        </div>
        <div style={{ paddingLeft: "20px" }}>
          <InputLabel id="label-groupement" style={{ paddingBottom: "5px" }}>
            Groupement
          </InputLabel>
          <Select
            label="Groupement"
            id="demo-simple-select"
            value={selectedGroupment}
            onChange={handleGroupmentChange}
          >
            <MenuItem value={0}>Sans groupement</MenuItem>
            <MenuItem value={1}>Par éditeur</MenuItem>
            <MenuItem value={2}>Par type</MenuItem>
            <MenuItem value={3}>Par état</MenuItem>
          </Select>
        </div>
      </div>
      <div>
        <SearchBar
          searchText={searchText}
          handleSearch={handleSearch}
          placeHolder="Rechercher un titre..."
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <DeletableChips editeurs={editeurs} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

// const SearchBar = ({ searchText, handleSearch, text }) => {
//   return (
//     <Paper
//       component='form'
//       style={{
//         display: "flex",
//         alignItems: "center",
//         width: "100%",
//         maxWidth: "300px",
//         padding: "2px 4px",
//         height: "35px",
//         marginTop: "10px",
//       }}
//     >
//       <IconButton type='button' sx={{ p: "10px" }} aria-label='search'>
//         <SearchIcon />
//       </IconButton>
//       <InputBase
//         style={{ marginLeft: "8px", flex: 1 }}
//         placeholder={text}
//         inputProps={{ "aria-label": "search google maps" }}
//         value={searchText}
//         onChange={handleSearch}
//       />
//     </Paper>
//   );
// };

export default CollectionFilter;
