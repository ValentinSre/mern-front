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
  const history = useHistory();

  const [list, setList] = useState(null);
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [books, setBooks] = useState([]);

  const [fadeOwned, setFadeOwned] = useState(false);
  const [fadeRead, setFadeRead] = useState(false);
  const [simpleList, setSimpleList] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortOption, setSortOption] = useState("title-asc");

  const [showImageInput, setShowImageInput] = useState(true);
  const [isModified, setIsModified] = useState(false);

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
        setBooks(responseData.books || []);
        setName(responseData.name || "");
        setCoverImage(responseData.coverImage || "");
        setShowImageInput(!responseData.coverImage);
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

    [newBooks[index], newBooks[targetIndex]] = [
      newBooks[targetIndex],
      newBooks[index],
    ];

    setBooks(newBooks);
    setIsModified(true);
  };

  const handleRemoveBook = (index) => {
    setBooks((previousBooks) =>
      previousBooks.filter((_, currentIndex) => currentIndex !== index),
    );
    setIsModified(true);
  };

  const deleteList = async () => {
    if (!window.confirm("Supprimer définitivement cette liste ?")) return;

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

  const calculateStats = () => {
    const totalBooks = books.length;
    const ownedBooks = books.filter((book) => book.collection?.possede).length;
    const readBooks = books.filter((book) => book.collection?.lu).length;

    const totalPrice = books.reduce(
      (sum, book) => sum + (Number(book.prix) || 0),
      0,
    );
    const ownedPrice = books
      .filter((book) => book.collection?.possede)
      .reduce((sum, book) => sum + (Number(book.prix) || 0), 0);

    const totalWeight =
      books.reduce((sum, book) => sum + (Number(book.poids) || 0), 0) / 1000;
    const ownedWeight =
      books
        .filter((book) => book.collection?.possede)
        .reduce((sum, book) => sum + (Number(book.poids) || 0), 0) / 1000;

    const totalPages = books.reduce(
      (sum, book) => sum + (Number(book.planches) || 0),
      0,
    );
    const readPages = books
      .filter((book) => book.collection?.lu)
      .reduce((sum, book) => sum + (Number(book.planches) || 0), 0);

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
        `${process.env.REACT_APP_API_URL}/book/search?q=${encodeURIComponent(
          searchQuery.trim(),
        )}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        },
      );

      setSearchResults(responseData?.booksByTitle || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Erreur lors de la recherche de livres:", error);
      setSearchResults([]);
      setHasSearched(true);
    }
  };

  const addBookToList = (book) => {
    if (books.some((existingBook) => existingBook._id === book._id)) return;

    setBooks((previousBooks) => [...previousBooks, book]);
    setIsModified(true);
  };

  const handleNameChange = (value) => {
    setName(value);
    setIsModified(true);
  };

  const handleImageChange = (value) => {
    setCoverImage(value);
    setIsModified(true);
  };

  const toggleFadeOwned = () => {
    setFadeOwned((previous) => !previous);
    if (!fadeOwned) setFadeRead(false);
  };

  const toggleFadeRead = () => {
    setFadeRead((previous) => !previous);
    if (!fadeRead) setFadeOwned(false);
  };

  const stats = calculateStats();

  const sortedResults = [...searchResults].sort((a, b) => {
    const titleA = a.titre || "";
    const titleB = b.titre || "";

    return sortOption === "title-desc"
      ? titleB.localeCompare(titleA)
      : titleA.localeCompare(titleB);
  });

  if (!list) {
    return <div className='edit-list__loading'>Chargement de la liste...</div>;
  }

  return (
    <div className='edit-list'>
      <header className='edit-list__header'>
        <div>
          <button
            type='button'
            className='edit-list__back'
            onClick={() => history.push("/lists")}
          >
            ← Mes listes
          </button>

          <h1>{name || "Liste sans nom"}</h1>
          <p>Gère les livres et les informations de ta liste.</p>
        </div>

        <span className='edit-list__book-count'>
          {books.length} {books.length > 1 ? "livres" : "livre"}
        </span>
      </header>

      {isModified && (
        <div className='unsaved-alert'>
          <span>!</span>
          Des modifications ne sont pas encore sauvegardées.
        </div>
      )}

      <section className='edit-list__settings'>
        <div className='edit-list__section-heading'>
          <div>
            <h2>Informations de la liste</h2>
            <p>Personnalise le nom et la couverture de ta liste.</p>
          </div>
        </div>

        <div className='edit-list__form'>
          <div className='edit-list__fields'>
            <label htmlFor='list-name'>Nom de la liste</label>
            <input
              id='list-name'
              type='text'
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder='Nom de la liste'
            />

            <div className='edit-list__image-heading'>
              <label htmlFor='list-cover'>Image de couverture</label>
              {coverImage && (
                <button
                  type='button'
                  onClick={() => setShowImageInput((previous) => !previous)}
                >
                  {showImageInput ? "Masquer le champ" : "Modifier l'image"}
                </button>
              )}
            </div>

            {showImageInput && (
              <input
                id='list-cover'
                type='text'
                value={coverImage}
                onChange={(event) => handleImageChange(event.target.value)}
                placeholder="URL de l'image de couverture"
              />
            )}
          </div>

          {coverImage && (
            <div className='cover-preview'>
              <img src={coverImage} alt='Couverture de la liste' />
            </div>
          )}
        </div>
      </section>

      <section className='edit-list__books'>
        <div className='edit-list__section-heading'>
          <div>
            <h2>Livres de la liste</h2>
            <p>Consulte, filtre et organise les livres de ta sélection.</p>
          </div>
        </div>

        <div className='filter-buttons'>
          <button
            type='button'
            onClick={toggleFadeOwned}
            className={fadeOwned ? "active" : ""}
          >
            {fadeOwned ? "Livres possédés masqués" : "Masquer les possédés"}
          </button>

          <button
            type='button'
            onClick={toggleFadeRead}
            className={fadeRead ? "active" : ""}
          >
            {fadeRead ? "Livres lus masqués" : "Masquer les livres lus"}
          </button>

          <button
            type='button'
            onClick={() => setSimpleList((previous) => !previous)}
            className={!simpleList ? "active" : ""}
          >
            {simpleList ? "Modifier l'ordre" : "Terminer le réordonnancement"}
          </button>
        </div>

        <div
          className={`display-books-serie_container ${
            simpleList ? "simple-list" : ""
          }`}
        >
          {books.length === 0 ? (
            <div className='edit-list__empty-books'>
              Aucun livre dans cette liste pour le moment.
            </div>
          ) : (
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
                      <>
                        <div className='top-right'>
                          <button
                            type='button'
                            onClick={() => moveBook(index, -1)}
                            disabled={index === 0}
                            aria-label='Déplacer vers le haut'
                          >
                            ↑
                          </button>
                          <button
                            type='button'
                            onClick={() => moveBook(index, 1)}
                            disabled={index === books.length - 1}
                            aria-label='Déplacer vers le bas'
                          >
                            ↓
                          </button>
                        </div>

                        <div className='bottom-right'>
                          <button
                            type='button'
                            className='delete'
                            onClick={() => handleRemoveBook(index)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </Tooltip>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className='edit-list__actions'>
        <CustomButtons
          buttonType='edit'
          title='Sauvegarder les modifications'
          onClick={saveChanges}
          disabled={!isModified}
        />
        <CustomButtons
          buttonType='delete'
          title='Supprimer la liste'
          onClick={deleteList}
        />
      </div>

      <section className='edit-list__statistics'>
        <div className='edit-list__section-heading'>
          <div>
            <h2>Statistiques de la liste</h2>
            <p>Quelques chiffres sur ta sélection.</p>
          </div>
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
      </section>

      <section className='search-section'>
        <div className='edit-list__section-heading'>
          <div>
            <h2>Ajouter des livres</h2>
            <p>
              Recherche un livre dans le catalogue pour l'ajouter à ta liste.
            </p>
          </div>
        </div>

        <div className='search-controls'>
          <div className='search-bar'>
            <input
              type='text'
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              placeholder='Rechercher un titre...'
              className='search-input'
            />

            <IconButton
              onClick={handleSearch}
              type='button'
              aria-label='Rechercher'
              size='small'
            >
              <SearchIcon />
            </IconButton>
          </div>

          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className='sort-select'
            aria-label='Trier les résultats'
          >
            <option value='title-asc'>Titre A → Z</option>
            <option value='title-desc'>Titre Z → A</option>
          </select>
        </div>

        <div className='search-results'>
          {hasSearched && sortedResults.length === 0 && (
            <p className='no-results'>Aucun résultat trouvé.</p>
          )}

          {sortedResults.map((book) => {
            const alreadyAdded = books.some(
              (existingBook) => existingBook._id === book._id,
            );

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
                    {Number(book.prix)
                      ? `${Number(book.prix).toFixed(2)} €`
                      : ""}
                  </span>
                </div>

                {alreadyAdded ? (
                  <span className='already-added'>✓ Déjà ajouté</span>
                ) : (
                  <button
                    type='button'
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
      </section>
    </div>
  );
};

export default EditListPage;
