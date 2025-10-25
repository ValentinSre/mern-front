import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useParams, useHistory } from "react-router-dom";
import makeTitle from "../../shared/util/makeTitle";
import "../../book/components/DisplayBooksSerie.css";
import { Tooltip } from "@material-ui/core";

import "./EditListPage.css";
import CustomButtons from "../../shared/components/UIElements/CustomButtons";

const EditListPage = () => {
  const { listId } = useParams();
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [list, setList] = useState(null);
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [books, setBooks] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const fetchList = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL + `/lists/${listId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setList(responseData);
        setBooks(responseData.books);
        setName(responseData.name);
        setCoverImage(responseData.coverImage);
      } catch (error) {
        console.error("Erreur lors de la récupération de la liste:", error);
      }
    };
    fetchList();
  }, [sendRequest, listId, auth.token]);

  const moveBook = (index, direction) => {
    const newBooks = [...books];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= books.length) return;

    const temp = newBooks[index];
    newBooks[index] = newBooks[targetIndex];
    newBooks[targetIndex] = temp;

    setBooks(newBooks);
  };

  const handleRemoveBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  };

  const deleteList = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_API_URL + `/lists/${listId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/lists");
    } catch (error) {
      console.error("Erreur lors de la suppression de la liste:", error);
    }
  };

  const saveChanges = async () => {
    try {
      const bookIds = books.map((book) => book._id); // Utiliser _id au lieu de id
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + `/lists/update/${listId}`,
        "POST",
        JSON.stringify({ name, coverImage, books: bookIds }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setList(responseData);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la liste:", error);
    }
  };

  if (!list) return <div>Chargement...</div>;

  return (
    <div className='edit-list'>
      <h1>Modifier la Liste {name}</h1>

      <div className='edit-list__form'>
        <div className='edit-list__fields'>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Nom de la liste'
          />
          <input
            type='text'
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="URL de l'image de couverture"
          />
        </div>

        {coverImage && (
          <div className='cover-preview'>
            <img src={coverImage} alt='Aperçu de la couverture' />
          </div>
        )}
      </div>

      <div className='display-books-serie_container'>
        <h2>Livres dans la liste</h2>
        <div className='display-books-serie'>
          {books.map((book, index) => (
            <Tooltip title={makeTitle(book)} placement='top' key={book._id}>
              <div className='display-books-serie__book'>
                <img
                  src={book.image}
                  alt={book.titre}
                  onClick={() => history.push(`/book/${book._id}`)}
                />
                <div className='top-right'>
                  <button
                    onClick={() => moveBook(index, -1)}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveBook(index, 1)}
                    disabled={index === books.length - 1}
                  >
                    ↓
                  </button>
                </div>
                <div className='bottom-right'>
                  <button
                    className='delete'
                    onClick={() => handleRemoveBook(index)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Boutons de bas de page */}
      <div className='action-buttons'>
        <CustomButtons
          buttonType='edit'
          title='Sauvegarder'
          onClick={saveChanges}
        />
        <CustomButtons
          buttonType='delete'
          title='Supprimer'
          onClick={deleteList}
        />
      </div>
    </div>
  );
};

export default EditListPage;
