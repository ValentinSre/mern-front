import React, { useEffect, useMemo, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import {
  FaCheck,
  FaCalendarAlt,
  FaSearch,
  FaShoppingBag,
  FaTrashAlt,
  FaUndo,
} from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";

import DateModal from "../../shared/components/UIElements/DateModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import WishlistFilters from "../components/WishlistFilters";

import "./DisplayWishlist.css";

const formatPrice = (price) =>
  `${Number(price || 0)
    .toFixed(2)
    .replace(".", ",")} €`;

const isBookReleased = (date) => {
  if (!date) return false;

  const releaseDate = new Date(date);
  if (Number.isNaN(releaseDate.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  releaseDate.setHours(0, 0, 0, 0);

  return releaseDate <= today;
};

const formatReleaseDate = (date) => {
  if (!date) return "Date inconnue";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date inconnue";

  return parsedDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getDateValue = (date) => {
  if (!date) return "";

  // Préserve directement la date si elle est déjà au format ISO.
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    return date.substring(0, 10);
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const DisplayWishlist = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const {
    isLoading: isDataLoading,
    error,
    sendRequest,
    clearError,
  } = useHttpClient();

  const [wishlist, setWishlist] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(null);
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("alpha");

  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [dateObtention, setDateObtention] = useState(null);
  const [bookId, setBookId] = useState(null);
  const [processingBookId, setProcessingBookId] = useState(null);

  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const fetchWishlists = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/wishlist/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token },
      );

      setWishlist(responseData.wishlist || []);
    } catch (err) {
      setWishlist([]);
    } finally {
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, [sendRequest, auth.userId]);

  const priceBounds = useMemo(() => {
    const prices = wishlist
      .map((book) => Number(book.prix))
      .filter((price) => Number.isFinite(price) && price >= 0);

    if (prices.length === 0) {
      return { min: 0, max: 100 };
    }

    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    return {
      min,
      max: max > min ? max : min + 1,
    };
  }, [wishlist]);

  const effectivePriceRange = priceRange || [priceBounds.min, priceBounds.max];

  const filteredBooks = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("fr");

    const result = wishlist.filter((book) => {
      const title = (book.titre || "").toLocaleLowerCase("fr");
      const series = (book.serie || "").toLocaleLowerCase("fr");
      const price = Number(book.prix);

      if (
        normalizedSearch &&
        !title.includes(normalizedSearch) &&
        !series.includes(normalizedSearch)
      ) {
        return false;
      }

      if (
        Number.isFinite(price) &&
        (price < effectivePriceRange[0] || price > effectivePriceRange[1])
      ) {
        return false;
      }

      if (availability === "released" && !isBookReleased(book.date_parution)) {
        return false;
      }

      if (availability === "upcoming" && isBookReleased(book.date_parution)) {
        return false;
      }

      if (availability === "period") {
        const bookDate = getDateValue(book.date_parution);

        if (!bookDate) return false;

        if (dateRange.start && bookDate < dateRange.start) {
          return false;
        }

        if (dateRange.end && bookDate > dateRange.end) {
          return false;
        }
      }

      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === "price-asc") {
        return Number(a.prix || 0) - Number(b.prix || 0);
      }

      if (sortBy === "price-desc") {
        return Number(b.prix || 0) - Number(a.prix || 0);
      }

      if (sortBy === "date-asc" || sortBy === "date-desc") {
        const dateA = new Date(a.date_parution || 0).getTime();
        const dateB = new Date(b.date_parution || 0).getTime();

        return sortBy === "date-asc" ? dateA - dateB : dateB - dateA;
      }

      return (a.titre || "").localeCompare(b.titre || "", "fr", {
        sensitivity: "base",
      });
    });
  }, [wishlist, search, effectivePriceRange, availability, dateRange, sortBy]);

  const totalBudget = wishlist.reduce(
    (total, book) => total + (Number(book.prix) || 0),
    0,
  );

  const releasedCount = wishlist.filter((book) =>
    isBookReleased(book.date_parution),
  ).length;

  const upcomingCount = wishlist.length - releasedCount;

  const hasActiveFilters =
    search.trim() !== "" ||
    priceRange !== null ||
    availability !== "all" ||
    sortBy !== "alpha";

  const handleResetFilters = () => {
    setSearch("");
    setPriceRange(null);
    setAvailability("all");
    setDateRange({ start: "", end: "" });
    setSortBy("alpha");
  };

  const handleAddToList = async (bookIds, listName) => {
    const currentBookId = bookIds[0];

    try {
      setProcessingBookId(currentBookId);

      const requestData = await sendRequest(
        process.env.REACT_APP_API_URL + "/collection/add",
        "POST",
        JSON.stringify({
          ids_book: bookIds,
          id_user: auth.userId,
          list_name: listName,
          date_achat: dateObtention,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      );

      if (requestData.success) {
        setWishlist((previousWishlist) =>
          previousWishlist.filter((book) => book.id_book !== currentBookId),
        );

        setOpenCollectionModal(false);
        setDateObtention(null);
        setBookId(null);
      }
    } catch (err) {
      // L'erreur est gérée par useHttpClient et ErrorModal.
    } finally {
      setProcessingBookId(null);
    }
  };

  const handleAdditionToCollection = () => {
    if (bookId) {
      handleAddToList([bookId], "collection");
    }
  };

  const handleBuyButton = (id) => {
    setBookId(id);
    setDateObtention(null);
    setOpenCollectionModal(true);
  };

  const handleDeleteButton = async (id) => {
    const book = wishlist.find((item) => item.id_book === id);

    if (
      !window.confirm(
        `Retirer « ${book?.titre || "cet album"} » de votre wishlist ?`,
      )
    ) {
      return;
    }

    try {
      setProcessingBookId(id);

      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/wishlist/${auth.userId}/${id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token },
      );

      if (responseData.success) {
        setWishlist((previousWishlist) =>
          previousWishlist.filter((item) => item.id_book !== id),
        );
      }
    } catch (err) {
      // L'erreur est gérée par useHttpClient et ErrorModal.
    } finally {
      setProcessingBookId(null);
    }
  };

  const showInitialLoading =
    (!hasLoaded || isDataLoading) && wishlist.length === 0;

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <main className='wishlist-page'>
        <header className='wishlist-page__header'>
          <div className='wishlist-page__heading'>
            <div>
              <h1>Ma wishlist</h1>
              <p>
                Garde un œil sur les albums que tu souhaites ajouter à ta
                collection.
              </p>
            </div>
          </div>

          <div className='wishlist-page__stats'>
            <div className='wishlist-page__stat'>
              <span className='wishlist-page__stat-icon'>
                <FaShoppingBag />
              </span>
              <div>
                <strong>{wishlist.length}</strong>
                <span>Albums souhaités</span>
              </div>
            </div>

            <div className='wishlist-page__stat'>
              <span className='wishlist-page__stat-icon'>
                <FaCheck />
              </span>
              <div>
                <strong>{releasedCount}</strong>
                <span>Déjà disponibles</span>
              </div>
            </div>

            <div className='wishlist-page__stat'>
              <span className='wishlist-page__stat-icon'>
                <FaCalendarAlt />
              </span>
              <div>
                <strong>{upcomingCount}</strong>
                <span>À paraître</span>
              </div>
            </div>

            <div className='wishlist-page__stat wishlist-page__stat--budget'>
              <span className='wishlist-page__stat-icon'>€</span>
              <div>
                <strong>{formatPrice(totalBudget)}</strong>
                <span>Budget estimé</span>
              </div>
            </div>
          </div>
        </header>

        {showInitialLoading ? (
          <div className='wishlist-loading'>
            <Skeleton variant='rect' height={150} />
            <div className='wishlist-loading__grid'>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Skeleton key={item} variant='rect' height={330} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <WishlistFilters
              search={search}
              onSearchChange={setSearch}
              priceBounds={priceBounds}
              priceRange={effectivePriceRange}
              onPriceRangeChange={setPriceRange}
              availability={availability}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onAvailabilityChange={setAvailability}
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultCount={filteredBooks.length}
              totalCount={wishlist.length}
              hasActiveFilters={hasActiveFilters}
              onReset={handleResetFilters}
            />

            {wishlist.length === 0 ? (
              <section className='wishlist-empty'>
                <div className='wishlist-empty__icon'>
                  <FaShoppingBag />
                </div>
                <h2>Ta wishlist est encore vide</h2>
                <p>
                  Ajoute des albums depuis leur fiche pour les retrouver ici et
                  garder une trace de tes prochaines envies.
                </p>
                <button
                  type='button'
                  onClick={() => history.push("/books")}
                  className='wishlist-empty__button'
                >
                  Explorer les albums
                </button>
              </section>
            ) : filteredBooks.length === 0 ? (
              <section className='wishlist-empty wishlist-empty--filtered'>
                <div className='wishlist-empty__icon'>
                  <FaSearch />
                </div>
                <h2>Aucun album ne correspond</h2>
                <p>
                  Essaie de modifier tes critères ou réinitialise les filtres
                  pour retrouver tous tes albums.
                </p>
                <button
                  type='button'
                  onClick={handleResetFilters}
                  className='wishlist-empty__button'
                >
                  <FaUndo />
                  Réinitialiser les filtres
                </button>
              </section>
            ) : (
              <section className='wishlist-results'>
                <div className='wishlist-results__heading'>
                  <div>
                    <h2>Mes albums souhaités</h2>
                    <span>
                      {filteredBooks.length} album
                      {filteredBooks.length > 1 ? "s" : ""}
                      {filteredBooks.length !== wishlist.length &&
                        ` sur ${wishlist.length}`}
                    </span>
                  </div>
                  <span className='wishlist-results__total'>
                    Valeur affichée :{" "}
                    {formatPrice(
                      filteredBooks.reduce(
                        (total, book) => total + (Number(book.prix) || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>

                <div className='wishlist-books'>
                  {filteredBooks.map((book) => {
                    const released = isBookReleased(book.date_parution);
                    const isProcessing = processingBookId === book.id_book;

                    return (
                      <article key={book.id_book} className='wishlist-book'>
                        <button
                          type='button'
                          className='wishlist-book__cover'
                          onClick={() => history.push(`/book/${book.id_book}`)}
                          aria-label={`Voir ${book.titre}`}
                        >
                          <img
                            src={book.image}
                            alt={book.titre}
                            loading='lazy'
                          />
                          <span
                            className={`wishlist-book__status ${
                              released
                                ? "wishlist-book__status--released"
                                : "wishlist-book__status--upcoming"
                            }`}
                          >
                            {released ? "Disponible" : "À paraître"}
                          </span>
                        </button>

                        <div className='wishlist-book__content'>
                          <button
                            type='button'
                            className='wishlist-book__title'
                            onClick={() =>
                              history.push(`/book/${book.id_book}`)
                            }
                          >
                            {book.titre}
                          </button>

                          {book.tome && (
                            <span className='wishlist-book__volume'>
                              Tome {book.tome}
                            </span>
                          )}

                          <span className='wishlist-book__series'>
                            {book.serie || book.titre}
                          </span>

                          <div className='wishlist-book__release'>
                            <FaCalendarAlt />
                            <span>{formatReleaseDate(book.date_parution)}</span>
                          </div>

                          <div className='wishlist-book__price'>
                            {formatPrice(book.prix)}
                          </div>

                          <div className='wishlist-book__actions'>
                            <button
                              type='button'
                              className='wishlist-book__buy'
                              onClick={() => handleBuyButton(book.id_book)}
                              disabled={isProcessing}
                            >
                              <BsCartCheckFill />
                              Acheté
                            </button>

                            <button
                              type='button'
                              className='wishlist-book__remove'
                              onClick={() => handleDeleteButton(book.id_book)}
                              disabled={isProcessing}
                              aria-label={`Retirer ${book.titre} de la wishlist`}
                              title='Retirer de la wishlist'
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        <DateModal
          open={openCollectionModal}
          handleClose={() => {
            setOpenCollectionModal(false);
            setDateObtention(null);
            setBookId(null);
          }}
          date={dateObtention}
          authorizeNoDate
          label="Date d'achat"
          title='Quand avez-vous acheté ce livre ?'
          handleChange={(e) => setDateObtention(e.target.value)}
          handleSubmit={handleAdditionToCollection}
        />
      </main>
    </>
  );
};

export default DisplayWishlist;
