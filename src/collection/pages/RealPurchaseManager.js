import React, { useState, useEffect, useContext, useMemo } from "react";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import makeTitle from "../../shared/util/makeTitle";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";

import {
  ArrowBack,
  ArrowForward,
  LocalShipping,
  EuroSymbol,
  Edit,
  ShoppingCart,
} from "@material-ui/icons";

import "./RealPurchaseManager.css";

const formatPrice = (price) =>
  `${Number(price || 0)
    .toFixed(2)
    .replace(".", ",")} €`;

const getMonthKey = (date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return `${parsedDate.getFullYear()}-${String(
    parsedDate.getMonth() + 1,
  ).padStart(2, "0")}`;
};

const formatMonth = (monthKey) => {
  if (!monthKey) return "Aucun mois";

  const [year, month] = monthKey.split("-").map(Number);

  return new Date(year, month - 1, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
};

const getNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const RealPurchaseManager = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [loadedCollection, setLoadedCollection] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedBookIds, setSelectedBookIds] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [price, setPrice] = useState(0);
  const [isOccasion, setIsOccasion] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  const fetchBooks = async () => {
    setIsLoading(true);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/${auth.userId}?displayMode=bySeries`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token },
      );

      const datesByMonth = {};

      (responseData.collection || []).forEach((serie) => {
        (serie.books || []).forEach((book) => {
          if (!book.date_achat) return;

          const monthKey = getMonthKey(book.date_achat);
          if (!monthKey) return;

          if (!datesByMonth[monthKey]) {
            datesByMonth[monthKey] = [];
          }

          datesByMonth[monthKey].push(book);
        });
      });

      const sortedMonths = Object.keys(datesByMonth).sort((a, b) =>
        b.localeCompare(a),
      );

      setLoadedCollection(datesByMonth);
      setSelectedMonth((currentMonth) =>
        currentMonth && datesByMonth[currentMonth]
          ? currentMonth
          : sortedMonths[0] || null,
      );
      setSelectedBookIds([]);
    } catch (err) {
      setLoadedCollection({});
      setSelectedMonth(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.userId]);

  const months = useMemo(
    () => Object.keys(loadedCollection).sort((a, b) => b.localeCompare(a)),
    [loadedCollection],
  );

  const currentBooks = loadedCollection[selectedMonth] || [];

  const booksWithoutPrice = currentBooks.filter(
    (book) => book.real_price === undefined || book.real_price === null,
  );

  const booksWithPrice = currentBooks.filter(
    (book) => book.real_price !== undefined && book.real_price !== null,
  );

  const selectedBooksInMonth = booksWithoutPrice.filter((book) =>
    selectedBookIds.includes(book.id),
  );

  const theoreticalTotal = currentBooks.reduce(
    (sum, book) => sum + getNumber(book.prix),
    0,
  );

  const effectiveTotal = currentBooks.reduce(
    (sum, book) =>
      sum + getNumber(book.real_price) + getNumber(book.shipping_cost),
    0,
  );

  const shippingTotal = currentBooks.reduce(
    (sum, book) => sum + getNumber(book.shipping_cost),
    0,
  );

  const savings =
    theoreticalTotal > 0 && effectiveTotal < theoreticalTotal
      ? Math.round((1 - effectiveTotal / theoreticalTotal) * 100)
      : 0;

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setSelectedBookIds([]);
  };

  const handleNavigateMonth = (direction) => {
    const currentIndex = months.indexOf(selectedMonth);
    const nextIndex =
      direction === "prev" ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < months.length) {
      handleMonthChange(months[nextIndex]);
    }
  };

  const handleCheckboxChange = (bookId) => {
    setSelectedBookIds((previous) =>
      previous.includes(bookId)
        ? previous.filter((id) => id !== bookId)
        : [...previous, bookId],
    );
  };

  const handleSelectAll = () => {
    const allSelected = booksWithoutPrice.every((book) =>
      selectedBookIds.includes(book.id),
    );

    if (allSelected) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(booksWithoutPrice.map((book) => book.id));
    }
  };

  const handleOpenModal = (books) => {
    if (!books.length) return;

    setSelectedBooks(books);
    setPrice(
      books.reduce((sum, book) => sum + getNumber(book.prix), 0).toFixed(2),
    );
    setShippingCost("0");
    setIsOccasion(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;

    setShowModal(false);
    setSelectedBooks([]);
    setPrice(0);
    setIsOccasion(false);
    setShippingCost(0);
  };

  const handleValidate = async () => {
    const numericPrice = Number(price);
    const numericShipping = Number(shippingCost);

    if (
      price === "" ||
      shippingCost === "" ||
      !Number.isFinite(numericPrice) ||
      !Number.isFinite(numericShipping) ||
      numericPrice < 0 ||
      numericShipping < 0
    ) {
      return;
    }

    try {
      setIsSaving(true);

      await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/update-prices`,
        "POST",
        JSON.stringify({
          books: selectedBooks.map((book) => book.id),
          price: numericPrice,
          isOccasion,
          shippingCost: numericShipping,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      );

      await fetchBooks();

      setShowModal(false);
      setSelectedBooks([]);
      setPrice(0);
      setShippingCost(0);
      setIsOccasion(false);
    } catch (err) {
      // L'erreur est gérée par useHttpClient.
    } finally {
      setIsSaving(false);
    }
  };

  const renderStat = (Icon, value, label, extraClass = "") => (
    <Grid item xs={6} md={3}>
      <div className={`purchase-page__stat ${extraClass}`}>
        <div className='purchase-page__stat-icon'>
          <Icon />
        </div>
        <div>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      </div>
    </Grid>
  );

  const renderEmpty = () => (
    <div className='purchase-empty'>
      <div className='purchase-empty__icon'>
        <ShoppingCart />
      </div>
      <h2>Aucun achat enregistré</h2>
      <p>
        Les albums ajoutés à ta collection avec une date d'achat apparaîtront
        ici.
      </p>
    </div>
  );

  const renderBooksWithoutPrice = () => (
    <section className='purchase-section'>
      <div className='purchase-section__header'>
        <div>
          <h2>Prix à renseigner</h2>
          <p>Ces albums n'ont pas encore de prix d'achat réel.</p>
        </div>

        <strong className='purchase-section__total'>
          {formatPrice(
            booksWithoutPrice.reduce(
              (sum, book) => sum + getNumber(book.prix),
              0,
            ),
          )}
        </strong>
      </div>

      <div className='purchase-section__info'>
        <span>
          {booksWithoutPrice.length} album
          {booksWithoutPrice.length > 1 ? "s" : ""}
        </span>
        <span>
          Valeur théorique de la période : {formatPrice(theoreticalTotal)}
        </span>
      </div>

      {booksWithoutPrice.length === 0 ? (
        <p className='purchase-section__empty'>
          Tous les prix sont renseignés pour cette période.
        </p>
      ) : (
        <TableContainer className='purchase-table-container'>
          <Table className='purchase-table' size='small'>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <input
                    type='checkbox'
                    className='purchase-checkbox'
                    checked={
                      booksWithoutPrice.length > 0 &&
                      booksWithoutPrice.every((book) =>
                        selectedBookIds.includes(book.id),
                      )
                    }
                    onChange={handleSelectAll}
                    aria-label='Tout sélectionner'
                  />
                </TableCell>
                <TableCell>Titre</TableCell>
                <TableCell align='right'>Prix théorique</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {booksWithoutPrice.map((book) => (
                <TableRow key={book.id} hover>
                  <TableCell padding='checkbox'>
                    <input
                      type='checkbox'
                      className='purchase-checkbox'
                      checked={selectedBookIds.includes(book.id)}
                      onChange={() => handleCheckboxChange(book.id)}
                      aria-label={`Sélectionner ${makeTitle(book)}`}
                    />
                  </TableCell>
                  <TableCell>{makeTitle(book)}</TableCell>
                  <TableCell align='right'>
                    {book.prix !== undefined && book.prix !== null
                      ? formatPrice(book.prix)
                      : "Non renseigné"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {booksWithoutPrice.length > 0 && (
        <div className='purchase-section__actions'>
          <Button
            variant='contained'
            className='purchase-button'
            onClick={() => handleOpenModal(selectedBooksInMonth)}
            disabled={selectedBooksInMonth.length === 0}
            startIcon={<Edit />}
          >
            Renseigner le prix
            {selectedBooksInMonth.length > 0
              ? ` (${selectedBooksInMonth.length})`
              : ""}
          </Button>
        </div>
      )}
    </section>
  );

  const renderBooksWithPrice = () => {
    const groupedBooks = booksWithPrice.reduce((acc, book) => {
      const groupKey = book.bought_with?.length
        ? [book.id, ...book.bought_with].sort().join(",")
        : String(book.id);

      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(book);

      return acc;
    }, {});

    return (
      <section className='purchase-section'>
        <div className='purchase-section__header'>
          <div>
            <h2>Achats renseignés</h2>
            <p>Récapitulatif des prix réellement payés.</p>
          </div>

          <strong className='purchase-section__total'>
            {formatPrice(
              booksWithPrice.reduce(
                (sum, book) =>
                  sum +
                  getNumber(book.real_price) +
                  getNumber(book.shipping_cost),
                0,
              ),
            )}
          </strong>
        </div>

        <div className='purchase-section__info'>
          <span>
            {booksWithPrice.length} album
            {booksWithPrice.length > 1 ? "s" : ""}
          </span>
          <span>
            Frais de port :{" "}
            {formatPrice(
              booksWithPrice.reduce(
                (sum, book) => sum + getNumber(book.shipping_cost),
                0,
              ),
            )}
          </span>
        </div>

        {booksWithPrice.length === 0 ? (
          <p className='purchase-section__empty'>
            Aucun achat renseigné pour cette période.
          </p>
        ) : (
          <TableContainer className='purchase-table-container'>
            <Table className='purchase-table' size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Album(s)</TableCell>
                  <TableCell align='right'>Prix total</TableCell>
                  <TableCell align='center'>Occasion</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {Object.values(groupedBooks).map((group, index) => {
                  const groupPrice = group.reduce(
                    (sum, book) =>
                      sum +
                      getNumber(book.real_price) +
                      getNumber(book.shipping_cost),
                    0,
                  );

                  const isSecondHand = group.some((book) => book.is_occasion);

                  return (
                    <TableRow key={index} hover>
                      <TableCell>
                        {group.map((book) => makeTitle(book)).join(", ")}
                      </TableCell>
                      <TableCell align='right'>
                        {formatPrice(groupPrice)}
                      </TableCell>
                      <TableCell align='center'>
                        <span
                          className={`purchase-badge ${
                            isSecondHand
                              ? "purchase-badge--occasion"
                              : "purchase-badge--new"
                          }`}
                        >
                          {isSecondHand ? "Oui" : "Non"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </section>
    );
  };

  const currentIndex = months.indexOf(selectedMonth);

  return (
    <div className='purchase-page'>
      <header className='purchase-page__header'>
        <div className='purchase-page__heading'>
          <h1>Mes achats</h1>
          <p>Retrouve l'historique de tes achats et suis tes dépenses.</p>
        </div>
      </header>

      {isLoading ? (
        <div className='purchase-loading'>
          <CircularProgress size={32} />
        </div>
      ) : months.length === 0 ? (
        renderEmpty()
      ) : (
        <>
          <Grid container spacing={2} className='purchase-page__stats'>
            {renderStat(ShoppingCart, currentBooks.length, "Albums achetés")}
            {renderStat(
              EuroSymbol,
              formatPrice(effectiveTotal),
              "Dépenses réelles",
            )}
            {renderStat(
              LocalShipping,
              formatPrice(shippingTotal),
              "Frais de port",
            )}
            {renderStat(
              ShoppingCart,
              savings > 0 ? `${savings} %` : "—",
              "Économie estimée",
              "purchase-page__stat--savings",
            )}
          </Grid>

          <div className='purchase-period'>
            <div className='purchase-period__navigation'>
              <Tooltip title='Mois précédent'>
                <span>
                  <Button
                    className='purchase-period__arrow'
                    onClick={() => handleNavigateMonth("prev")}
                    disabled={currentIndex === months.length - 1}
                    aria-label='Mois précédent'
                  >
                    <ArrowBack />
                  </Button>
                </span>
              </Tooltip>

              <h2>{formatMonth(selectedMonth)}</h2>

              <Tooltip title='Mois suivant'>
                <span>
                  <Button
                    className='purchase-period__arrow'
                    onClick={() => handleNavigateMonth("next")}
                    disabled={currentIndex <= 0}
                    aria-label='Mois suivant'
                  >
                    <ArrowForward />
                  </Button>
                </span>
              </Tooltip>
            </div>

            <TextField
              select
              size='small'
              variant='outlined'
              label='Choisir une période'
              value={selectedMonth || ""}
              onChange={(event) => handleMonthChange(event.target.value)}
              className='purchase-period__select'
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {formatMonth(month)}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {renderBooksWithoutPrice()}
          {renderBooksWithPrice()}
        </>
      )}

      <Modal
        show={showModal}
        onCancel={handleCloseModal}
        header='Renseigner le prix'
      >
        <div className='purchase-modal'>
          <div className='purchase-modal__summary'>
            <strong>{selectedBooks.length}</strong> album
            {selectedBooks.length > 1 ? "s sélectionnés" : " sélectionné"}
            <br />
            Valeur théorique :{" "}
            <strong>
              {formatPrice(
                selectedBooks.reduce(
                  (sum, book) => sum + getNumber(book.prix),
                  0,
                ),
              )}
            </strong>
          </div>

          <label className='purchase-modal__field'>
            Prix total payé (€)
            <input
              type='number'
              min='0'
              step='0.01'
              value={price}
              onChange={(event) =>
                setPrice(event.target.value === "" ? "" : event.target.value)
              }
            />
          </label>

          <label className='purchase-modal__switch'>
            <span>Achat d'occasion</span>
            <Switch
              checked={isOccasion}
              onChange={(event) => setIsOccasion(event.target.checked)}
              color='primary'
            />
          </label>

          <label className='purchase-modal__field'>
            Frais de port (€)
            <input
              type='number'
              min='0'
              step='0.01'
              value={shippingCost}
              onChange={(event) =>
                setShippingCost(
                  event.target.value === "" ? "" : event.target.value,
                )
              }
            />
          </label>

          <div className='purchase-modal__actions'>
            <Button
              variant='outlined'
              className='purchase-button purchase-button--outlined'
              onClick={handleCloseModal}
              disabled={isSaving}
            >
              Annuler
            </Button>

            <Button
              variant='contained'
              className='purchase-button'
              onClick={handleValidate}
              disabled={
                isSaving ||
                selectedBooks.length === 0 ||
                price === "" ||
                shippingCost === "" ||
                !Number.isFinite(Number(price)) ||
                !Number.isFinite(Number(shippingCost)) ||
                Number(price) < 0 ||
                Number(shippingCost) < 0
              }
            >
              {isSaving ? <CircularProgress size={20} /> : "Valider"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RealPurchaseManager;
