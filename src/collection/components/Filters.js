import React from "react";
import {
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import {
  FaListUl,
  FaTh,
  FaSlidersH,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";
import Checkbox from "../../shared/components/UIElements/ThemedCheckbox";
import "./Filters.css";

const CollectionFilter = ({
  selectedSort,
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
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [typesOpen, setTypesOpen] = React.useState(false);
  const [publishersOpen, setPublishersOpen] = React.useState(false);
  const [publisherSearch, setPublisherSearch] = React.useState("");

  const types = [
    { key: "BD", label: "Bande dessinée" },
    { key: "Comics", label: "Comics" },
    { key: "Manga", label: "Manga" },
    { key: "Roman", label: "Roman" },
  ];

  const publishers = Object.keys(editeurs || {}).sort((a, b) =>
    a.localeCompare(b, "fr"),
  );

  const filteredPublishers = publishers.filter((publisher) =>
    publisher.toLowerCase().includes(publisherSearch.toLowerCase()),
  );

  const selectedTypesCount =
    Object.values(checkedValues).filter(Boolean).length;

  const selectedPublishersCount = Object.values(editeurs || {}).filter(
    Boolean,
  ).length;

  const activeFiltersCount =
    (selectedTypesCount !== types.length ? 1 : 0) +
    (selectedPublishersCount !== publishers.length ? 1 : 0) +
    (displayMode === "byBooks" && Number(selectedSort) !== 0 ? 1 : 0) +
    (displayMode === "byBooks" && Number(selectedGroupment) !== 0 ? 1 : 0);

  const handleDisplayMode = (event, newDisplayMode) => {
    if (newDisplayMode !== null) {
      setDisplayMode(newDisplayMode);
      setLoadedCollection(null);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);
    handleSearchBooks(value);
  };

  const handleTypeSelection = (type) => {
    handleCheckedChange({
      target: {
        name: type,
        checked: !checkedValues[type],
      },
    });
  };

  return (
    <div className='collection-filter'>
      <div className='collection-filter__main'>
        <div className='collection-filter__search'>
          <FaSearch className='collection-filter__search-icon' />
          <input
            type='search'
            value={searchText}
            onChange={handleSearch}
            placeholder={
              displayMode === "bySeries"
                ? "Rechercher une série..."
                : "Rechercher un album..."
            }
            aria-label='Rechercher dans ma collection'
          />
        </div>

        <button
          type='button'
          className={`collection-filter__advanced-button ${
            filtersOpen ? "collection-filter__advanced-button--active" : ""
          }`}
          onClick={() => setFiltersOpen((previous) => !previous)}
          aria-expanded={filtersOpen}
        >
          <FaSlidersH />
          <span>Filtres</span>

          {activeFiltersCount > 0 && (
            <span className='collection-filter__badge'>
              {activeFiltersCount}
            </span>
          )}

          <FaChevronDown
            className={`collection-filter__chevron ${
              filtersOpen ? "collection-filter__chevron--open" : ""
            }`}
          />
        </button>
      </div>

      {filtersOpen && (
        <div className='collection-filter__advanced'>
          <div className='collection-filter__dropdowns-row'>
            <div className='collection-filter__section'>
              <h3>Types de livres</h3>

              <div className='collection-filter__dropdown'>
                <button
                  type='button'
                  className='collection-filter__dropdown-trigger'
                  onClick={() => {
                    setTypesOpen((previous) => !previous);
                    setPublishersOpen(false);
                  }}
                  aria-expanded={typesOpen}
                >
                  <span>
                    {selectedTypesCount === types.length
                      ? "Tous les types"
                      : `${selectedTypesCount} type(s) sélectionné(s)`}
                  </span>
                  <FaChevronDown />
                </button>

                {typesOpen && (
                  <div className='collection-filter__dropdown-menu'>
                    {types.map((type) => (
                      <FormControlLabel
                        key={type.key}
                        control={
                          <Checkbox
                            checked={checkedValues[type.key]}
                            onChange={() => handleTypeSelection(type.key)}
                            name={type.key}
                          />
                        }
                        label={type.label}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className='collection-filter__section'>
              <h3>Éditeurs</h3>

              <div className='collection-filter__dropdown'>
                <button
                  type='button'
                  className='collection-filter__dropdown-trigger'
                  onClick={() => {
                    setPublishersOpen((previous) => !previous);
                    setTypesOpen(false);
                  }}
                  aria-expanded={publishersOpen}
                >
                  <span>
                    {selectedPublishersCount === publishers.length
                      ? "Tous les éditeurs"
                      : `${selectedPublishersCount} éditeur(s) sélectionné(s)`}
                  </span>
                  <FaChevronDown />
                </button>

                {publishersOpen && (
                  <div className='collection-filter__dropdown-menu collection-filter__publisher-menu'>
                    <div className='collection-filter__publisher-search'>
                      <FaSearch />
                      <input
                        type='search'
                        placeholder='Rechercher un éditeur...'
                        value={publisherSearch}
                        onChange={(event) =>
                          setPublisherSearch(event.target.value)
                        }
                      />
                    </div>

                    <div className='collection-filter__publisher-list'>
                      {filteredPublishers.map((publisher) => (
                        <FormControlLabel
                          key={publisher}
                          control={
                            <Checkbox
                              checked={editeurs[publisher]}
                              onChange={() =>
                                handleEditeursSelection(publisher)
                              }
                            />
                          }
                          label={publisher}
                        />
                      ))}

                      {filteredPublishers.length === 0 && (
                        <p className='collection-filter__empty'>
                          Aucun éditeur trouvé.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='collection-filter__section collection-filter__display-section'>
            <h3>Mode d'affichage</h3>

            <ToggleButtonGroup
              value={displayMode}
              exclusive
              onChange={handleDisplayMode}
              className='collection-filter__view-toggle'
              aria-label="Mode d'affichage"
            >
              <ToggleButton value='bySeries'>
                <FaListUl />
                <span>Par séries</span>
              </ToggleButton>

              <ToggleButton value='byBooks'>
                <FaTh />
                <span>Par albums</span>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {displayMode === "byBooks" && (
            <div className='collection-filter__section'>
              <h3>Organisation</h3>

              <div className='collection-filter__selects'>
                <div className='collection-filter__select'>
                  <InputLabel id='collection-sort-label'>Trier par</InputLabel>
                  <Select
                    labelId='collection-sort-label'
                    value={selectedSort}
                    onChange={handleSortChange}
                    fullWidth
                  >
                    <MenuItem value={0}>Titre / série</MenuItem>
                    <MenuItem value={1}>Prix</MenuItem>
                    <MenuItem value={2}>Note</MenuItem>
                  </Select>
                </div>

                <div className='collection-filter__select'>
                  <InputLabel id='collection-group-label'>
                    Regrouper par
                  </InputLabel>
                  <Select
                    labelId='collection-group-label'
                    value={selectedGroupment}
                    onChange={handleGroupmentChange}
                    fullWidth
                  >
                    <MenuItem value={0}>Aucun</MenuItem>
                    <MenuItem value={1}>Éditeur</MenuItem>
                    <MenuItem value={2}>Type</MenuItem>
                    <MenuItem value={3}>État</MenuItem>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionFilter;
