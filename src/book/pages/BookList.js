import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Table from "../../shared/components/UIElements/Table";
import GenericTable from "../../shared/components/UIElements/GenericTable";
import { AuthContext } from "../../shared/context/auth-context";

const BookList = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBooks, setLoadedBooks] = useState();

  const fetchBooks = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/book?user=${auth.userId}`
      );
      console.log(responseData.books);
      setLoadedBooks(responseData.books);
    } catch (err) {}
  };

  useEffect(() => {
    fetchBooks();
  }, [sendRequest, auth.userId]);

  const handleViewBook = (bookId) => {
    console.log(bookId);
  };

  const columnsName = [
    { name: "Série", id: "serie", sort: true },
    { name: "Titre", id: "titre", sort: true },
    { name: "Tome", id: "tome", sort: true },
    { name: "Éditeur", id: "editeur", sort: true },
    { name: "Format", id: "format", sort: true },
    { name: "Prix", id: "prix", sort: true },
  ];

  const handleAddToList = async (bookIds, listName) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/add",
        "POST",
        JSON.stringify({
          ids_book: bookIds,
          id_user: auth.userId,
          list_name: listName,
          books: loadedBooks,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      // Refetch the list of books after adding the book to the collection successfully
      await fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCollection = (bookIds) => {
    handleAddToList(bookIds, "collection");
  };

  const handleAddToWishlist = (bookIds) => {
    handleAddToList(bookIds, "wishlist");
  };

  const actions = [
    {
      icon: "collection",
      title: "Ajouter à ma collection",
      handleAction: handleAddToCollection,
      disabled: ["possede"],
    },
    {
      icon: "wishlist",
      title: "Ajouter à ma wishlist",
      handleAction: handleAddToWishlist,
      disabled: ["possede", "souhaite"],
    },
  ];

  const headCells = [
    {
      id: "serie",
      numeric: false,
      disablePadding: false,
      label: "Série",
    },
    {
      id: "titre",
      numeric: false,
      disablePadding: false,
      label: "Titre",
    },
    {
      id: "tome",
      numeric: true,
      disablePadding: false,
      label: "Tome",
    },
    {
      id: "editeur",
      numeric: false,
      disablePadding: false,
      label: "Editeur",
    },
    {
      id: "format",
      numeric: false,
      disablePadding: false,
      label: "Format",
    },
    {
      id: "prix",
      numeric: true,
      disablePadding: false,
      label: "Prix",
    },
  ];

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBooks && (
        <div className='center'>
          <GenericTable
            headCells={headCells}
            rows={loadedBooks}
            title='Tous les livres'
            actions={actions}
            userInfo={auth.isLoggedIn}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default BookList;
