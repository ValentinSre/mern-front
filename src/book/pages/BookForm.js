import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Add as MenuIcon } from "@material-ui/icons";

import "./BookForm.css";

const BookForm = ({
  book,
  handleSubmit,
  existingSeries: initialExistingSeries,
  existingEditeurs: initialExistingEditeurs,
  existingArtistes,
  existingFormats: initialExistingFormats,
  existingGenres: initialExistingGenres,
}) => {
  const [type, setType] = useState(book.type || "Comics");
  const [titre, setTitre] = useState(book.titre || "");
  const [serie, setSerie] = useState(book.serie || "");
  const [tome, setTome] = useState(book.tome || null);
  const [version, setVersion] = useState(book.version || null);
  const [image, setImage] = useState(book.image || "");
  const [prix, setPrix] = useState(book.prix || null);
  const [auteur, setAuteur] = useState(book.auteurs ? book.auteurs[0] : "");
  const [auteurs, setAuteurs] = useState(book.auteurs || []);
  const [editeur, setEditeur] = useState(book.editeur || "");
  const [date_parution, setDate_parution] = useState(book.date_parution || "");
  const [format, setFormat] = useState(book.format || "");
  const [genre, setGenre] = useState(book.genre || "");
  const [dessinateur, setDessinateur] = useState(
    book.dessinateurs ? book.dessinateurs[0] : ""
  );
  const [dessinateurs, setDessinateurs] = useState(book.dessinateurs || []);
  const [poids, setPoids] = useState(book.poids || null);
  const [planches, setPlanches] = useState(book.planches || null);

  const handleAjoutAuteur = () => {
    if (auteur !== "" && !auteurs.includes(auteur)) {
      const oldAuteurs = auteurs;
      oldAuteurs.push(auteur);
      setAuteurs(oldAuteurs);
      setAuteur("");
    }
  };

  const handleAjoutDessinateur = () => {
    if (dessinateur !== "" && !dessinateurs.includes(dessinateur)) {
      const oldDessinateurs = dessinateurs;
      oldDessinateurs.push(dessinateur);
      setDessinateurs(oldDessinateurs);
      setDessinateur("");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    handleAjoutAuteur();
    handleAjoutDessinateur();

    handleSubmit({
      type: type,
      serie: serie,
      titre: titre,
      version: version,
      tome: tome,
      image: image,
      prix: prix,
      auteurs: auteurs,
      editeur: editeur,
      date_parution: date_parution,
      format: format,
      genre: genre,
      poids: poids,
      planches: planches,
      dessinateurs: dessinateurs,
    });
  };

  const deleteArtistChip = (artiste, typeOfArtist) => {
    if (typeOfArtist === "auteur") {
      setAuteurs(auteurs.filter((a) => a !== artiste));
    } else {
      setDessinateurs(dessinateurs.filter((d) => d !== artiste));
    }
  };

  // For autocompletes
  const [existingAuteurs, setExistingAuteurs] = useState(existingArtistes);
  const [selectedAuteur, setSelectedAuteur] = useState(auteur);
  const [existingDessinateurs, setExistingDessinateurs] =
    useState(existingArtistes);
  const [selectedDessinateur, setSelectedDessinateur] = useState(dessinateur);
  const [existingEditeurs, setExistingEditeurs] = useState(
    initialExistingEditeurs
  );
  const [selectedEditeur, setSelectedEditeur] = useState(editeur);
  const [existingFormats, setExistingFormats] = useState(
    initialExistingFormats
  );
  const [selectedFormat, setSelectedFormat] = useState(format);
  const [existingGenres, setExistingGenres] = useState(initialExistingGenres);
  const [selectedGenre, setSelectedGenre] = useState(genre);
  const [existingSeries, setExistingSeries] = useState(initialExistingSeries);
  const [selectedSerie, setSelectedSerie] = useState(serie);

  const handleInputAuteurChange = (event, value) => {
    const filteredAuteurs = existingArtistes.filter((auteur) =>
      auteur.toLowerCase().includes(value.toLowerCase())
    );

    setExistingAuteurs(filteredAuteurs);
    setAuteur(value);
  };

  const handleInputDessinateurChange = (event, value) => {
    const filteredDessinateurs = existingArtistes.filter((dessinateur) =>
      dessinateur.toLowerCase().includes(value.toLowerCase())
    );

    setExistingDessinateurs(filteredDessinateurs);
    setDessinateur(value);
  };

  const handleInputEditeurChange = (event, value) => {
    const filteredEditeurs = initialExistingEditeurs.filter((editeur) =>
      editeur.toLowerCase().includes(value.toLowerCase())
    );

    setExistingEditeurs(filteredEditeurs);
    setEditeur(value);
  };

  const handleInputFormatChange = (event, value) => {
    const filteredFormats = initialExistingFormats.filter((format) =>
      format.toLowerCase().includes(value.toLowerCase())
    );

    setExistingFormats(filteredFormats);
    setFormat(value);
  };

  const handleInputGenreChange = (event, value) => {
    const filteredGenres = initialExistingGenres.filter((genre) =>
      genre.toLowerCase().includes(value.toLowerCase())
    );

    setExistingGenres(filteredGenres);
    setGenre(value);
  };

  const handleInputSerieChange = (event, value) => {
    const filteredSeries = initialExistingSeries.filter((serie) =>
      serie.toLowerCase().includes(value.toLowerCase())
    );

    setExistingSeries(filteredSeries);
    setSerie(value);
  };

  const DeletableChips = ({ artistes, handleDelete, typeOfArtist }) => {
    return artistes.map((artiste) => (
      <div className='chip' key={artiste}>
        <Chip
          key={artiste}
          label={artiste}
          onDelete={() => handleDelete(artiste, typeOfArtist)}
        />
      </div>
    ));
  };

  return (
    <form onSubmit={handleFormSubmit} className='book-form-container'>
      <div className='form-control'>
        <div>
          <h2>Informations basiques sur le livre</h2>
          <label htmlFor={"type"}>Type</label>
          <Select
            label='Type'
            id='tri-select'
            value={type}
            onChange={(e) => setType(e.target.value)}
            className='form-select'
          >
            <MenuItem value={"Comics"}>Comics</MenuItem>
            <MenuItem value={"Manga"}>Manga</MenuItem>
            <MenuItem value={"BD"}>BD</MenuItem>
          </Select>
          <TextField
            label='Titre'
            variant='outlined'
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            margin='normal'
            fullWidth
            required
            InputLabelProps={{ position: "top" }}
          />
          <Autocomplete
            freeSolo
            options={existingSeries || []}
            value={serie}
            onChange={(e, value) => setSelectedSerie(value)}
            inputValue={selectedSerie}
            onInputChange={handleInputSerieChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Série'
                variant='outlined'
                margin='normal'
                fullWidth
              />
            )}
          />
          {serie !== "" && (
            <React.Fragment>
              <TextField
                label='Tome'
                variant='outlined'
                value={tome}
                onChange={(e) => setTome(e.target.value)}
                margin='normal'
                type='number'
                fullWidth
              />
              <TextField
                label='Version'
                variant='outlined'
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                margin='normal'
                type='number'
                fullWidth
              />
            </React.Fragment>
          )}
          <TextField
            label='Image'
            variant='outlined'
            value={image}
            onChange={(e) => setImage(e.target.value)}
            margin='normal'
            fullWidth
            required
          />
          {image && <img src={image} alt={titre} className='book-image' />}
        </div>
        <div>
          <h2>Informations commerciales</h2>

          <TextField
            label='Prix'
            InputProps={{
              endAdornment: <InputAdornment position='end'>€</InputAdornment>,
            }}
            variant='outlined'
            margin='normal'
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            fullWidth
            type='number'
            step='0.01'
            required
          />

          <Autocomplete
            freeSolo
            options={existingEditeurs || []}
            value={selectedEditeur}
            onChange={(e, value) => setSelectedEditeur(value)}
            inputValue={editeur}
            required
            onInputChange={handleInputEditeurChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Editeur'
                variant='outlined'
                margin='normal'
                fullWidth
              />
            )}
          />
          <Autocomplete
            freeSolo
            options={existingFormats || []}
            value={selectedFormat}
            onChange={(e, value) => setSelectedFormat(value)}
            inputValue={format}
            onInputChange={handleInputFormatChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Format'
                variant='outlined'
                margin='normal'
                fullWidth
              />
            )}
          />

          <TextField
            label='Date de parution'
            variant='outlined'
            value={date_parution}
            onChange={(e) => setDate_parution(e.target.value)}
            margin='normal'
            fullWidth
            type='date'
          />
        </div>
        <div>
          <h2>Informations sur les artistes</h2>

          <div className='artists-list'>
            <DeletableChips
              artistes={auteurs}
              handleDelete={deleteArtistChip}
              typeOfArtist={"auteur"}
            />
          </div>

          <Autocomplete
            freeSolo
            required
            options={existingAuteurs || []}
            value={selectedAuteur}
            onChange={(e, value) => setSelectedAuteur(value)}
            inputValue={auteur}
            onInputChange={handleInputAuteurChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Auteur'
                variant='outlined'
                margin='normal'
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleAjoutAuteur}>
                        <MenuIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <div className='artists-list'>
            <DeletableChips
              artistes={dessinateurs}
              handleDelete={deleteArtistChip}
              typeOfArtist={"dessinateur"}
            />
          </div>

          <Autocomplete
            freeSolo
            required
            options={existingDessinateurs || []}
            value={selectedDessinateur}
            onChange={(e, value) => setSelectedDessinateur(value)}
            inputValue={dessinateur}
            onInputChange={handleInputDessinateurChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Dessinateur'
                variant='outlined'
                margin='normal'
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleAjoutDessinateur}>
                        <MenuIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Autocomplete
            freeSolo
            options={existingGenres || []}
            value={selectedGenre}
            onChange={(e, value) => setSelectedGenre(value)}
            inputValue={genre}
            onInputChange={handleInputGenreChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Genre'
                variant='outlined'
                margin='normal'
                fullWidth
              />
            )}
          />
        </div>
        <div>
            <h2>Informations statistiques</h2>

            <TextField
              label='Poids'
              InputProps={{
                endAdornment: <InputAdornment position='end'>g</InputAdornment>,
              }}
              variant='outlined'
              margin='normal'
              value={poids}
              onChange={(e) => setPoids(e.target.value)}
              fullWidth
              type='number'
            />
            <TextField
              label='Nombre de planches'
              variant='outlined'
              value={planches}
              onChange={(e) => setPlanches(e.target.value)}
              margin='normal'
              type='number'
              fullWidth
            />
            
        </div>
        <Button variant='contained' color='primary' type='submit'>
          Soumettre
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
