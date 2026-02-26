import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useParams, useHistory } from "react-router-dom";
import makeTitle from "../../shared/util/makeTitle";
import "../../book/components/DisplayBooksSerie.css";
import { IconButton, Tooltip } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

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

  const [fadeOwned, setFadeOwned] = useState(false);
  const [fadeRead, setFadeRead] = useState(false);
  const [simpleList, setSimpleList] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [sortOption, setSortOption] = useState("title-asc");

  const [showImageInput, setShowImageInput] = useState(!coverImage);

  const [isModified, setIsModified] = useState(false);

  const history = useHistory();
  console.log(isModified);
  useEffect(() => {
    const fetchList = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL + `/lists/${listId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          },
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
    setIsModified(true);
  };

  const handleRemoveBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  };

  const getSortedResults = () => {
    const sorted = [...searchResults];

    switch (sortOption) {
      case "title-asc":
        return sorted.sort((a, b) => a.titre.localeCompare(b.titre));
      case "title-desc":
        return sorted.sort((a, b) => b.titre.localeCompare(a.titre));
      default:
        return sorted;
    }
  };

  const deleteList = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_API_URL + `/lists/${listId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        },
      );
      history.push("/lists");
    } catch (error) {
      console.error("Erreur lors de la suppression de la liste:", error);
    }
  };

  const saveChanges = async () => {
    try {
      const bookIds = books.map((book) => book._id);
      const responseData = await sendRequest(
        process.env.REACT_APP_API_URL + `/lists/update/${listId}`,
        "POST",
        JSON.stringify({ name, coverImage, books: bookIds }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      );
      setList(responseData);
      setIsModified(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la liste:", error);
    }
  };

  const toggleFadeOwned = () => {
    setFadeOwned((prev) => !prev);
    if (fadeRead) setFadeRead(false);
  };

  const toggleFadeRead = () => {
    setFadeRead((prev) => !prev);
    if (fadeOwned) setFadeOwned(false);
  };

  const toggleSimpleList = () => {
    setSimpleList((prev) => !prev);
  };

  const toggleImageInput = () => {
    setShowImageInput((prev) => !prev);
  };

  const calculateStats = () => {
    const totalBooks = books.length;
    const ownedBooks = books.filter((book) => book.collection?.possede).length;
    const readBooks = books.filter((book) => book.collection?.lu).length;

    const totalPrice = books.reduce((sum, book) => sum + (book.prix || 0), 0);
    const ownedPrice = books
      .filter((book) => book.collection?.possede)
      .reduce((sum, book) => sum + (book.prix || 0), 0);

    const totalWeight =
      books.reduce((sum, book) => sum + (book.poids || 0), 0) / 1000;
    const ownedWeight =
      books
        .filter((book) => book.collection?.possede)
        .reduce((sum, book) => sum + (book.poids || 0), 0) / 1000;

    const totalPages = books.reduce(
      (sum, book) => sum + (book.planches || 0),
      0,
    );
    const readPages = books
      .filter((book) => book.collection?.lu)
      .reduce((sum, book) => sum + (book.planches || 0), 0);

    return {
      totalBooks,
      ownedBooks,
      readBooks,
      totalPrice,
      ownedPrice,
      totalWeight,
      ownedWeight,
      totalPages,
      readPages,
      ownedPercentage: totalBooks
        ? Math.round((ownedBooks / totalBooks) * 100)
        : 0,
      readPercentage: totalBooks
        ? Math.round((readBooks / totalBooks) * 100)
        : 0,
      ownedPricePercentage: totalPrice
        ? Math.round((ownedPrice / totalPrice) * 100)
        : 0,
      ownedWeightPercentage: totalWeight
        ? Math.round((ownedWeight / totalWeight) * 100)
        : 0,
      readPagesPercentage: totalPages
        ? Math.round((readPages / totalPages) * 100)
        : 0,
    };
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/book/search?q=${searchQuery}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        },
      );
      if (responseData && responseData.booksByTitle) {
        setSearchResults(responseData.booksByTitle);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de livres:", error);
      setSearchResults([]);
    }
  };

  const addBookToList = (book) => {
    if (!books.some((b) => b._id === book._id)) {
      setBooks((prevBooks) => [...prevBooks, book]);
      setIsModified(true);
    }
  };

  const stats = calculateStats();

  const handleNameChange = (value) => {
    setName(value);
    setIsModified(true);
  };

  const handleImageChange = (value) => {
    setCoverImage(value);
    setIsModified(true);
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
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder='Nom de la liste'
          />
          {showImageInput && (
            <input
              type='text'
              value={coverImage}
              onChange={(e) => handleImageChange(e.target.value)}
              placeholder="URL de l'image de couverture"
            />
          )}
        </div>

        {coverImage && (
          <div
            className='cover-preview'
            onClick={toggleImageInput}
            style={{ cursor: "pointer" }}
          >
            <img src={coverImage} alt='Aperçu de la couverture' />
          </div>
        )}
      </div>

      {isModified && (
        <p className='unsaved-alert'>
          🚨 Modification(s) non sauvegardée(s) 🚨
        </p>
      )}

      <div className='filter-buttons'>
        <button onClick={toggleFadeOwned} className={fadeOwned ? "active" : ""}>
          Masquer les livres possédés
        </button>
        <button onClick={toggleFadeRead} className={fadeRead ? "active" : ""}>
          Masquer les livres lus
        </button>
        <button
          onClick={toggleSimpleList}
          className={simpleList ? "active" : ""}
        >
          {simpleList ? "Modifier l'ordre" : "Afficher uniquement"}
        </button>
      </div>

      <div
        className={`display-books-serie_container ${
          simpleList ? "simple-list" : ""
        }`}
      >
        <h2>Livres dans la liste</h2>
        <div
          className={`display-books-serie ${
            simpleList ? "horizontal-scroll" : ""
          }`}
        >
          {books.map((book, index) => (
            <Tooltip title={makeTitle(book)} placement='top' key={book._id}>
              <div
                className={`display-books-serie__book ${
                  (fadeOwned && book.collection?.possede) ||
                  (fadeRead && book.collection?.lu)
                    ? "faded"
                    : ""
                }`}
              >
                <img
                  src={book.image}
                  alt={book.titre}
                  onClick={() => history.push(`/book/${book._id}`)}
                />
                {!simpleList && (
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
                )}
                {!simpleList && (
                  <div className='bottom-right'>
                    <button
                      className='delete'
                      onClick={() => handleRemoveBook(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className='action-buttons'>
        <CustomButtons
          buttonType='edit'
          title='Sauvegarder'
          onClick={saveChanges}
          disabled={!isModified}
        />
        <CustomButtons
          buttonType='delete'
          title='Supprimer'
          onClick={deleteList}
        />
      </div>

      <div className='stats-container'>
        <div className='stat-item'>
          <div className='icon'>📚</div>
          <h3>
            {stats.ownedBooks}/{stats.totalBooks}
          </h3>
          <p>Possédés ({stats.ownedPercentage}%)</p>
        </div>
        <div className='stat-item'>
          <div className='icon'>📖</div>
          <h3>
            {stats.readBooks}/{stats.totalBooks}
          </h3>
          <p>Lus ({stats.readPercentage}%)</p>
        </div>
        <div className='stat-item'>
          <div className='icon'>💰</div>
          <h3>{stats.totalPrice.toFixed(2)} €</h3>
          <p>Prix total</p>
        </div>
        <div className='stat-item'>
          <div className='icon'>🪙</div>
          <h3>{stats.ownedPrice.toFixed(2)} €</h3>
          <p>Prix possédé ({stats.ownedPricePercentage}%)</p>
        </div>
        <div className='stat-item'>
          <div className='icon'>⚖️</div>
          <h3>{stats.totalWeight.toFixed(2)} kg</h3>
          <p>Poids total</p>
        </div>
        <div className='stat-item'>
          <div className='icon'>📦</div>
          <h3>{stats.ownedWeight.toFixed(2)} kg</h3>
          <p>Poids possédé ({stats.ownedWeightPercentage}%)</p>
        </div>
        <div className='stat-item'>
          <div className='icon'>📄</div>
          <h3>{stats.totalPages}</h3>
          <p>Planches totales</p>
        </div>
        <div className='stat-item'>
          <div className='icon'>✅</div>
          <h3>{stats.readPages}</h3>
          <p>Planches lues ({stats.readPagesPercentage}%)</p>
        </div>
      </div>

      <div className='search-section'>
        <h2>Ajouter des livres</h2>

        <div className='search-controls'>
          <div className='search-bar'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder='Rechercher un titre...'
              className='search-input'
            />
            <IconButton
              onClick={handleSearch}
              type='button'
              sx={{ p: "10px" }}
              aria-label='search'
            >
              <SearchIcon />
            </IconButton>
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className='sort-select'
          >
            <option value='title-asc'>Titre A → Z</option>
            <option value='title-desc'>Titre Z → A</option>
          </select>
        </div>

        <div className='search-results'>
          {getSortedResults().length === 0 && (
            <p className='no-results'>Aucun résultat</p>
          )}

          {getSortedResults().map((book) => {
            const alreadyAdded = books.some((b) => b._id === book._id);

            return (
              <div key={book._id} className='search-result-card'>
                <img
                  src={book.image}
                  alt={book.titre}
                  className='result-image'
                />

                <div className='result-info'>
                  <span className='result-title'>{makeTitle(book)}</span>

                  <span className='result-price'>
                    {book.prix ? `${book.prix.toFixed(2)} €` : ""}
                  </span>
                </div>

                {alreadyAdded ? (
                  <span className='already-added'>✓ Déjà ajouté</span>
                ) : (
                  <button
                    onClick={() => addBookToList(book)}
                    className='add-button-list'
                  >
                    + Ajouter
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditListPage;
