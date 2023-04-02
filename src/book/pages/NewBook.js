import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Select, MenuItem, InputLabel } from "@material-ui/core";

import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./BookForm.css";

const NewBook = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [type, setType] = useState("Comics");

  const [formState, inputHandler] = useForm(
    {
      serie: { value: "", isValid: true },
      titre: { value: "", isValid: false },
      tome: { value: null, isValid: true },
      image: { value: "", isValid: false },
      prix: { value: null, isValid: false },
      auteur: { value: "", isValid: false },
      editeur: { value: "", isValid: false },
      date_parution: { value: "", isValid: true },
      format: { value: "", isValid: true },
      genre: { value: "", isValid: true },
      dessinateur: { value: "", isValid: false },
      version: { value: null, isValid: true },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_API_URL + "/book",
        "POST",
        JSON.stringify({
          type: type,
          serie: formState.inputs.serie.value,
          titre: formState.inputs.titre.value,
          version: formState.inputs.version.value,
          tome: formState.inputs.tome.value,
          image: formState.inputs.image.value,
          prix: formState.inputs.prix.value,
          auteur: formState.inputs.auteur.value,
          editeur: formState.inputs.editeur.value,
          date_parution: formState.inputs.date_parution.value,
          format: formState.inputs.format.value,
          genre: formState.inputs.genre.value,
          dessinateur: formState.inputs.dessinateur.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className='book-form' onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className='form-control'>
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
        </div>
        <Input
          element='input'
          id='serie'
          type='text'
          label='Série'
          onInput={inputHandler}
          validators={[]}
          initialIsValid={true}
          autocompleteOptions={["Amazing Spider-Man", "Immortal Hulk"]}
        />
        {formState.inputs.serie.value !== "" && type === "Comics" && (
          <Input
            element='input'
            id='version'
            type='number'
            label='Version'
            min='1'
            onInput={inputHandler}
            validators={[]}
            initialIsValid={true}
          />
        )}
        <Input
          element='input'
          id='titre'
          type='text'
          label='Titre'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Entrez un titre valide'
          onInput={inputHandler}
        />
        <Input
          element='input'
          id='tome'
          type='number'
          label='Tome'
          min='1'
          onInput={inputHandler}
          validators={[]}
          initialIsValid={true}
        />
        <Input
          element='input'
          id='image'
          type='text'
          label='Image'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Entrez une URL valide.'
          onInput={inputHandler}
        />
        <Input
          element='input'
          id='prix'
          type='number'
          step='0.01'
          label='Prix'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Entrez un prix valide.'
          onInput={inputHandler}
        />
        <Input
          element='input'
          id='auteur'
          type='text'
          label='Auteur'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Entrez un auteur valide.'
          onInput={inputHandler}
        />
        <Input
          element='input'
          id='editeur'
          type='text'
          label='Editeur'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Entrez un éditeur valide.'
          onInput={inputHandler}
        />
        <Input
          element='input'
          id='date_parution'
          type='date'
          label='Date de parution'
          onInput={inputHandler}
          validators={[]}
          initialIsValid={true}
        />
        <Input
          element='input'
          id='format'
          type='text'
          label='Format'
          onInput={inputHandler}
          validators={[]}
          initialIsValid={true}
        />
        <Input
          element='input'
          id='genre'
          type='text'
          label='Genre'
          onInput={inputHandler}
          validators={[]}
          initialIsValid={true}
        />
        <Input
          element='input'
          id='dessinateur'
          type='text'
          label='Dessinateur'
          onInput={inputHandler}
          validators={[]}
          initialIsValid={true}
        />
        <Button type='submit' disabled={!formState.isValid}>
          Ajouter le livre
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewBook;
