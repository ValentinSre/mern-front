import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputAdornment,
} from "@material-ui/core";

import "./ProductionForm.css";
import { Autocomplete } from "@material-ui/lab";

const ProductionForm = ({ handleSubmit, series }) => {
  const [type, setType] = useState("Film");
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState("");
  const [length, setLength] = useState("");
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");

  const existingSeries = series?.map((el) => el.title);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = {
      type,
      title,
      poster,
      length,
      season: type === "Série" ? season : undefined,
      episode: type === "Série" ? episode : undefined,
    };

    handleSubmit(formData);
  };

  const handleInputTitleChange = (event, value) => {
    if (value !== undefined && value !== null) {
      setTitle(value);
    }
  };

  const uniqueSeriesSet = new Set(existingSeries);

  const uniqueSeriesArray = Array.from(uniqueSeriesSet);

  const [autocompleteOptions, setAutocompleteOptions] = useState(
    uniqueSeriesArray || []
  );

  return (
    <form onSubmit={handleFormSubmit} className='production-form-container'>
      <div className='form-control'>
        <h2>Informations sur la production</h2>
        <RadioGroup
          aria-label='type'
          name='type'
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <FormControlLabel value='Film' control={<Radio />} label='Film' />
          <FormControlLabel value='Série' control={<Radio />} label='Série' />
        </RadioGroup>
        {type === "Film" ? (
          <TextField
            label='Titre'
            variant='outlined'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin='normal'
            fullWidth
            required
          />
        ) : (
          <Autocomplete
            freeSolo
            options={autocompleteOptions}
            value={title}
            onChange={(e, value) => handleInputTitleChange(e, value)}
            inputValue={title}
            onInputChange={(event, value) => {
              const updatedOptions = uniqueSeriesArray.filter((option) =>
                option.toLowerCase().includes(value.toLowerCase())
              );
              setAutocompleteOptions(updatedOptions);
              handleInputTitleChange(event, value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Titre'
                variant='outlined'
                margin='normal'
                fullWidth
              />
            )}
          />
        )}
        <TextField
          label='Poster'
          variant='outlined'
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
          margin='normal'
          fullWidth
          required
        />
        {poster && (
          <img src={poster} alt={title} className='production-image' />
        )}
        <TextField
          label='Durée'
          variant='outlined'
          value={length}
          onChange={(e) => setLength(e.target.value)}
          margin='normal'
          fullWidth
          required
        />
        {type === "Série" && (
          <React.Fragment>
            <TextField
              label='Saison'
              variant='outlined'
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              margin='normal'
              fullWidth
              required
            />
            <TextField
              label='Épisode'
              variant='outlined'
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              margin='normal'
              fullWidth
              required
            />
          </React.Fragment>
        )}
        <Button variant='contained' color='primary' type='submit'>
          Soumettre
        </Button>
      </div>
    </form>
  );
};

export default ProductionForm;
