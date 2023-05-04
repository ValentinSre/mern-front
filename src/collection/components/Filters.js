import React from "react";
import {
  Chip,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  FormControlLabel,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Delete as DeleteIcon, Done as DoneIcon } from "@material-ui/icons";
import { FaListUl, FaTh } from "react-icons/fa";
import SearchBar from "../../shared/components/UIElements/SearchBar";
import Checkbox from "../../shared/components/UIElements/ThemedCheckbox";
import { Skeleton } from "@material-ui/lab";

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
  loading,
}) => {
  const [searchText, setSearchText] = React.useState("");

  const handleDisplayMode = (event, newDisplayMode) => {
    if (newDisplayMode !== null) {
      setDisplayMode(newDisplayMode);
      setLoadedCollection(null);
    }
  };

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
      <ToggleButtonGroup
        value={displayMode}
        exclusive
        onChange={handleDisplayMode}
        aria-label="device"
        style={{ marginBottom: "10px" }}
      >
        <ToggleButton value="bySeries" aria-label="bySeries">
          <FaListUl />
        </ToggleButton>
        <ToggleButton value="byBooks" aria-label="byBooks">
          <FaTh />
        </ToggleButton>
      </ToggleButtonGroup>
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        {displayMode === "bySeries" && (
          <SeriesFilter
            collection={collection}
            checkedValues={checkedValues}
            handleCheckedChange={handleCheckedChange}
            handleSearch={handleSearch}
            editeurs={editeurs}
            searchText={searchText}
            handleDelete={handleEditeursSelection}
            loading={loading}
          />
        )}

        {displayMode === "byBooks" && (
          <BooksFilter
            collection={collection}
            checkedValues={checkedValues}
            handleCheckedChange={handleCheckedChange}
            handleSearch={handleSearch}
            selectedSort={selectedSort}
            searchText={searchText}
            handleSortChange={handleSortChange}
            selectedGroupment={selectedGroupment}
            handleGroupmentChange={handleGroupmentChange}
            editeurs={editeurs}
            handleDelete={handleEditeursSelection}
            loading={loading}
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
  loading,
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
      <div style={{ marginTop: "20px" }}>
        <SearchBar
          searchText={searchText}
          handleSearch={handleSearch}
          placeHolder="Rechercher une série..."
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        {loading && (
          <Skeleton
            animation="wave"
            height={50}
            width="100%"
            style={{ marginBottom: 6 }}
          />
        )}

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
  loading,
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
      <div style={{ marginTop: "20px" }}>
        <SearchBar
          searchText={searchText}
          handleSearch={handleSearch}
          placeHolder="Rechercher un titre..."
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        {loading && (
          <Skeleton
            animation="wave"
            height={50}
            width="100%"
            style={{ marginBottom: 6 }}
          />
        )}
        <DeletableChips editeurs={editeurs} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default CollectionFilter;
