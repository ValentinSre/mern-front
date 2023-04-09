import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

import ErrorModal from "../../../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../../../shared/context/auth-context";
import BookForm from "../../BookForm";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import "../../BookForm.css";

const EditBookDialog = ({ book: bookFromProps, open, handleCloseDialog }) => {
  const auth = useContext(AuthContext);
  const { error, sendRequest, clearError } = useHttpClient();

  const [options, setOptions] = useState({});

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/all-information`
        );

        setOptions(responseData);
      } catch (err) {}
    };
    fetchBooksData();
  }, [sendRequest]);

  const handleEditBook = async (updatedBook) => {
    try {
      await sendRequest(
        process.env.REACT_APP_API_URL + "/book/edit/" + bookFromProps.id,
        "PATCH",
        JSON.stringify(updatedBook),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      handleCloseDialog();
    } catch (err) {}
  };

  const { auteurs, dessinateurs, date_parution } = bookFromProps;
  const auteursList = auteurs.map((auteur) => auteur.nom);
  const dessinateursList = dessinateurs.map((dessinateur) => dessinateur.nom);

  const dateObj = new Date(date_parution);
  const formattedDate = dateObj.toISOString().slice(0, 10);

  const bookToUpdate = {
    ...bookFromProps,
    auteurs: auteursList,
    dessinateurs: dessinateursList,
    date_parution: formattedDate,
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Dialog open={open} onClose={handleEditBook}>
        <Button onClick={handleCloseDialog}>Close</Button>

        <BookForm
          book={bookToUpdate}
          handleSubmit={handleEditBook}
          existingSeries={options.series}
          existingEditeurs={options.editeurs}
          existingGenres={options.genres}
          existingArtistes={options.artistes}
          existingFormats={options.formats}
        />
      </Dialog>
    </React.Fragment>
  );
};

export default EditBookDialog;
