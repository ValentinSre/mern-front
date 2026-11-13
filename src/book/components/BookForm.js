import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Add,
  MenuBook,
  Euro,
  Store,
  People,
  BarChart,
  ImageOutlined,
  Save,
  Close,
} from "@material-ui/icons";

import "./BookForm.css";

const normalizeIsbn = (value) => value.replace(/[\s-]/g, "");

const isValidIsbn = (value) => {
  if (!/^\d{13}$/.test(value)) return false;

  const sum = value
    .split("")
    .reduce(
      (total, digit, index) =>
        total + Number(digit) * (index % 2 === 0 ? 1 : 3),
      0,
    );

  return sum % 10 === 0;
};

const BookForm = ({
  book,
  handleSubmit,
  existingSeries: initialExistingSeries = [],
  existingEditeurs: initialExistingEditeurs = [],
  existingArtistes = [],
  existingFormats: initialExistingFormats = [],
  existingGenres: initialExistingGenres = [],
}) => {
  const [type, setType] = useState(book.type || "Comics");
  const [titre, setTitre] = useState(book.titre || "");
  const [isbn, setIsbn] = useState(normalizeIsbn(book.isbn || ""));
  const [serie, setSerie] = useState(book.serie || "");
  const [tome, setTome] = useState(book.tome || "");
  const [version, setVersion] = useState(book.version || "");
  const [image, setImage] = useState(book.image || "");
  const [prix, setPrix] = useState(book.prix ?? "");
  const [auteur, setAuteur] = useState("");
  const [auteurs, setAuteurs] = useState(book.auteurs || []);
  const [editeur, setEditeur] = useState(book.editeur || "");
  const [date_parution, setDate_parution] = useState(book.date_parution || "");
  const [format, setFormat] = useState(book.format || "");
  const [genre, setGenre] = useState(book.genre || "");
  const [dessinateur, setDessinateur] = useState("");
  const [dessinateurs, setDessinateurs] = useState(book.dessinateurs || []);
  const [poids, setPoids] = useState(book.poids ?? "");
  const [planches, setPlanches] = useState(book.planches ?? "");

  const isEditing = Boolean(book._id || book.id);

  const addArtist = (artist, typeOfArtist) => {
    const value = artist.trim();

    if (!value) return;

    if (typeOfArtist === "auteur") {
      if (!auteurs.includes(value)) {
        setAuteurs((current) => [...current, value]);
      }
      setAuteur("");
    } else {
      if (!dessinateurs.includes(value)) {
        setDessinateurs((current) => [...current, value]);
      }
      setDessinateur("");
    }
  };

  const deleteArtist = (artist, typeOfArtist) => {
    if (typeOfArtist === "auteur") {
      setAuteurs((current) => current.filter((a) => a !== artist));
    } else {
      setDessinateurs((current) => current.filter((d) => d !== artist));
    }
  };

  const editArtist = (artist, typeOfArtist) => {
    if (typeOfArtist === "auteur") {
      setAuteur(artist);
      deleteArtist(artist, "auteur");
    } else {
      setDessinateur(artist);
      deleteArtist(artist, "dessinateur");
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const normalizedIsbn = normalizeIsbn(isbn);

    if (normalizedIsbn && !isValidIsbn(normalizedIsbn)) {
      return;
    }

    const finalAuteurs = [
      ...new Set([...auteurs, auteur.trim()].filter(Boolean)),
    ];

    const finalDessinateurs = [
      ...new Set([...dessinateurs, dessinateur.trim()].filter(Boolean)),
    ];

    handleSubmit({
      type,
      serie,
      titre,
      isbn: normalizedIsbn,
      version,
      tome,
      image,
      prix,
      auteurs: finalAuteurs,
      editeur,
      date_parution,
      format,
      genre,
      poids,
      planches,
      dessinateurs: finalDessinateurs,
    });
  };

  const renderAutocomplete = ({
    label,
    value,
    options,
    onChange,
    required = false,
  }) => (
    <Autocomplete
      freeSolo
      options={options.filter(Boolean)}
      inputValue={value}
      onChange={(event, newValue) => onChange(newValue || "")}
      onInputChange={(event, newValue, reason) => {
        if (reason === "input" || reason === "clear") {
          onChange(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant='outlined'
          margin='normal'
          fullWidth
          required={required}
        />
      )}
    />
  );

  const renderArtistChips = (artists, typeOfArtist) => (
    <div className='book-form-artists-list'>
      {artists.map((artist) => (
        <Chip
          key={artist}
          label={artist}
          onDelete={() => deleteArtist(artist, typeOfArtist)}
          onClick={() => editArtist(artist, typeOfArtist)}
          deleteIcon={<Close />}
        />
      ))}
    </div>
  );

  const renderArtistInput = ({
    label,
    value,
    options,
    onChange,
    onAdd,
    required,
  }) => (
    <Autocomplete
      freeSolo
      options={options.filter(Boolean)}
      inputValue={value}
      onChange={(event, newValue) => onChange(newValue || "")}
      onInputChange={(event, newValue, reason) => {
        if (reason === "input" || reason === "clear") {
          onChange(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant='outlined'
          margin='normal'
          fullWidth
          required={required}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                <InputAdornment position='end'>
                  <IconButton
                    type='button'
                    onClick={onAdd}
                    aria-label={`Ajouter ${label.toLowerCase()}`}
                    title={`Ajouter ${label.toLowerCase()}`}
                    disabled={!value.trim()}
                  >
                    <Add />
                  </IconButton>
                </InputAdornment>
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );

  return (
    <div className='book-form-page'>
      <header className='book-form-header'>
        <div className='book-form-eyebrow'>CATALOGUE</div>
        <h1>{isEditing ? "Modifier un livre" : "Ajouter un livre"}</h1>
        <p>Renseigne les informations pour compléter la fiche du livre.</p>
      </header>

      <form onSubmit={handleFormSubmit} className='book-form-container'>
        <div className='book-form-grid'>
          <section className='book-form-section'>
            <div className='book-form-section-header'>
              <div className='book-form-section-icon'>
                <MenuBook />
              </div>
              <div>
                <h2>Informations générales</h2>
                <p>Identité et couverture du livre</p>
              </div>
            </div>

            <FormControl variant='outlined' fullWidth margin='normal'>
              <InputLabel id='book-type-label'>Type</InputLabel>
              <Select
                labelId='book-type-label'
                value={type}
                onChange={(event) => setType(event.target.value)}
                label='Type'
              >
                <MenuItem value='Comics'>Comics</MenuItem>
                <MenuItem value='Manga'>Manga</MenuItem>
                <MenuItem value='BD'>BD</MenuItem>
                <MenuItem value='Roman'>Roman</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label='Titre'
              variant='outlined'
              value={titre}
              onChange={(event) => setTitre(event.target.value)}
              margin='normal'
              fullWidth
              required
            />

            {renderAutocomplete({
              label: "Série",
              value: serie,
              options: initialExistingSeries,
              onChange: setSerie,
            })}

            {serie.trim() !== "" && (
              <div className='book-form-inline-fields'>
                <TextField
                  label='Tome'
                  variant='outlined'
                  value={tome}
                  onChange={(event) => setTome(event.target.value)}
                  margin='normal'
                  type='number'
                  fullWidth
                />
                <TextField
                  label='Version'
                  variant='outlined'
                  value={version}
                  onChange={(event) => setVersion(event.target.value)}
                  margin='normal'
                  type='number'
                  fullWidth
                />
              </div>
            )}

            <TextField
              label='URL de la couverture'
              variant='outlined'
              value={image}
              onChange={(event) => setImage(event.target.value)}
              margin='normal'
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <ImageOutlined />
                  </InputAdornment>
                ),
              }}
            />

            {image && (
              <div className='book-form-cover-preview'>
                <span>Aperçu de la couverture</span>
                <img src={image} alt={titre || "Couverture du livre"} />
              </div>
            )}
          </section>

          <section className='book-form-section'>
            <div className='book-form-section-header'>
              <div className='book-form-section-icon'>
                <Store />
              </div>
              <div>
                <h2>Informations commerciales</h2>
                <p>Prix, éditeur et publication</p>
              </div>
            </div>

            <TextField
              label='Prix'
              variant='outlined'
              margin='normal'
              value={prix}
              onChange={(event) => setPrix(event.target.value)}
              fullWidth
              type='number'
              inputProps={{ step: "0.01" }}
              required
              InputProps={{
                endAdornment: <InputAdornment position='end'>€</InputAdornment>,
              }}
            />

            {renderAutocomplete({
              label: "Éditeur",
              value: editeur,
              options: initialExistingEditeurs,
              onChange: setEditeur,
            })}

            {renderAutocomplete({
              label: "Format",
              value: format,
              options: initialExistingFormats,
              onChange: setFormat,
            })}

            <TextField
              label='ISBN-13'
              variant='outlined'
              value={isbn}
              onChange={(event) => setIsbn(normalizeIsbn(event.target.value))}
              margin='normal'
              fullWidth
              error={isbn !== "" && !isValidIsbn(isbn)}
              helperText={
                isbn === ""
                  ? "Facultatif — 13 chiffres."
                  : isValidIsbn(isbn)
                    ? "ISBN valide"
                    : "ISBN invalide : vérifie les 13 chiffres."
              }
              inputProps={{
                inputMode: "numeric",
              }}
            />

            <TextField
              label='Date de parution'
              variant='outlined'
              value={date_parution}
              onChange={(event) => setDate_parution(event.target.value)}
              margin='normal'
              fullWidth
              type='date'
              InputLabelProps={{ shrink: true }}
            />
          </section>

          <section className='book-form-section'>
            <div className='book-form-section-header'>
              <div className='book-form-section-icon'>
                <People />
              </div>
              <div>
                <h2>Artistes</h2>
                <p>Auteurs et dessinateurs du livre</p>
              </div>
            </div>

            <div className='book-form-artist-group'>
              <label>Auteurs</label>
              {renderArtistChips(auteurs, "auteur")}
              {renderArtistInput({
                label: "Ajouter un auteur",
                value: auteur,
                options: existingArtistes,
                onChange: setAuteur,
                onAdd: () => addArtist(auteur, "auteur"),
                required: auteurs.length === 0,
              })}
            </div>

            <div className='book-form-artist-group'>
              <label>Dessinateurs</label>
              {renderArtistChips(dessinateurs, "dessinateur")}
              {renderArtistInput({
                label: "Ajouter un dessinateur",
                value: dessinateur,
                options: existingArtistes,
                onChange: setDessinateur,
                onAdd: () => addArtist(dessinateur, "dessinateur"),
                required: dessinateurs.length === 0,
              })}
            </div>

            {renderAutocomplete({
              label: "Genre",
              value: genre,
              options: initialExistingGenres,
              onChange: setGenre,
            })}
          </section>

          <section className='book-form-section'>
            <div className='book-form-section-header'>
              <div className='book-form-section-icon'>
                <BarChart />
              </div>
              <div>
                <h2>Informations statistiques</h2>
                <p>Caractéristiques physiques</p>
              </div>
            </div>

            <TextField
              label='Nombre de planches'
              variant='outlined'
              value={planches}
              onChange={(event) => setPlanches(event.target.value)}
              margin='normal'
              type='number'
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>planches</InputAdornment>
                ),
              }}
            />

            <TextField
              label='Poids'
              variant='outlined'
              margin='normal'
              value={poids}
              onChange={(event) => setPoids(event.target.value)}
              fullWidth
              type='number'
              InputProps={{
                endAdornment: <InputAdornment position='end'>g</InputAdornment>,
              }}
            />
          </section>
        </div>

        <div className='book-form-actions'>
          <Button
            type='submit'
            variant='contained'
            className='book-form-submit'
            startIcon={<Save />}
          >
            {isEditing ? "Enregistrer les modifications" : "Ajouter le livre"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
