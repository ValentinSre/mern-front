import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Table from "../../shared/components/UIElements/Table";
import { AuthContext } from "../../shared/context/auth-context";

const BookList = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBooks, setLoadedBooks] = useState();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book?user=${auth.userId}`
        );

        setLoadedBooks(responseData.books);
      } catch (err) { }
    };

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
  ]

  const handleAddToList = async (bookId, listName) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/add",
        "POST",
        JSON.stringify({
          id_book: bookId,
          id_user: auth.userId,
          list_name: listName,
          books: loadedBooks,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      setLoadedBooks(responseData.books);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCollection = (bookId) => {
    handleAddToList(bookId, 'collection')
  }

  const handleAddToWishlist = (bookId) => {
    handleAddToList(bookId, 'wishlist')
  }

  const actions = [
    { icon: 'collection', title: 'Ajouter à ma collection', handleAction: handleAddToCollection, disabled: ['possede'] },
    { icon: 'wishlist', title: 'Ajouter à ma wishlist', handleAction: handleAddToWishlist, disabled: ['possede', 'souhaite'] }
  ]

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBooks && (
        <Table data={loadedBooks} loading={isLoading} onRowClick={handleViewBook} columns={columnsName} actions={actions} />
      )}
    </React.Fragment>
  );
};

export default BookList;
