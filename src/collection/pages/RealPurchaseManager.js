import React, { useState, useEffect, useContext } from "react";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  makeStyles,
  Box,
  Grid,
  Divider,
  Tooltip,
  Switch,
} from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import makeTitle from "../../shared/util/makeTitle";
import variables from "../../shared/util/variables";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    background: "#f7f7fa",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    gap: theme.spacing(2),
  },
  tableSection: {
    marginBottom: theme.spacing(4),
    background: "#fff",
    borderRadius: 16,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 2, 1, 2),
  },
  tableContainer: {
    borderRadius: 12,
    boxShadow: theme.shadows[1],
    background: "#fafbfc",
  },
  button: {
    margin: theme.spacing(1, 0),
    fontWeight: 600,
    borderRadius: 8,
    textTransform: "none",
  },
  selectButton: {
    backgroundColor: "#ffde59",
    color: "#222",
    "&:hover": {
      backgroundColor: "#ffe98a",
    },
  },
  outlinedButton: {
    color: "#d0b32c",
    borderColor: "#d0b32c",
    fontWeight: 600,
    borderRadius: 8,
    textTransform: "none",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    minWidth: 320,
  },
  input: {
    marginBottom: theme.spacing(1),
    borderRadius: 6,
    border: "1px solid #e0e0e0",
    padding: theme.spacing(1),
    fontSize: 16,
    width: "100%",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
    gap: theme.spacing(2),
  },
  arrow: {
    cursor: "pointer",
    fontSize: "2.2rem",
    color: theme.palette.text.secondary,
    transition: "color 0.2s",
    "&:hover": {
      color: "#ffde59",
    },
  },
  tableTitle: {
    fontWeight: 600,
    fontSize: "1.1rem",
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.5),
  },
  tableInfo: {
    fontSize: "0.95rem",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(3, 0, 2, 0),
  },
  checkbox: {
    transform: "scale(1.2)",
  },
  switchLabel: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    fontSize: 16,
  },
}));

const RealPurchaseManager = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [loadedCollection, setLoadedCollection] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState(0);
  const [isOccasion, setIsOccasion] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  const [selectedBookIds, setSelectedBookIds] = useState([]);

  const fetchBooks = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/${auth.userId}?displayMode=bySeries`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      sortCollection(responseData.collection);
    } catch (err) {}
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [sendRequest, auth.userId]);

  const extractDates = (listOfBooks) => {
    const datesByMonth = {};
    listOfBooks.forEach((serie) => {
      serie.books.forEach((book) => {
        if (book.date_achat) {
          const date = new Date(book.date_achat);
          const formattedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
          if (!datesByMonth[formattedDate]) {
            datesByMonth[formattedDate] = [];
          }
          datesByMonth[formattedDate].push(book);
        }
      });
    });
    return datesByMonth;
  };

  const sortCollection = (loadedBooks) => {
    const datesByMonth = extractDates(loadedBooks);
    const sortedMonths = Object.keys(datesByMonth).sort((a, b) => {
      const [aMonth, aYear] = a.split("/").map(Number);
      const [bMonth, bYear] = b.split("/").map(Number);
      if (aYear !== bYear) {
        return bYear - aYear;
      }
      return bMonth - aMonth;
    });
    setLoadedCollection(datesByMonth);
    if (!selectedMonth) {
      setSelectedMonth(sortedMonths[0] || null);
    }
  };

  const handleMonthChange = (direction) => {
    const months = Object.keys(loadedCollection).sort((a, b) => {
      const [aMonth, aYear] = a.split("/").map(Number);
      const [bMonth, bYear] = b.split("/").map(Number);
      if (aYear !== bYear) {
        return bYear - aYear;
      }
      return bMonth - aMonth;
    });

    const currentIndex = months.indexOf(selectedMonth);
    const newIndex = direction === "prev" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < months.length) {
      setSelectedMonth(months[newIndex]);
    }
  };

  const handleOpenModal = (books) => {
    setSelectedBooks(books);
    setPrice(books.reduce((sum, book) => sum + (book.prix || 0), 0));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooks([]);
    setPrice(0);
    setIsOccasion(false);
    setShippingCost(0);
  };

  const handleValidate = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/update-prices`,
        "POST",
        JSON.stringify({
          books: selectedBooks.map((book) => book.id),
          price,
          isOccasion,
          shippingCost,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      fetchBooks();
      handleCloseModal();
    } catch (err) {}
  };

  const handleCheckboxChange = (bookId) => {
    setSelectedBookIds((prevSelected) =>
      prevSelected.includes(bookId)
        ? prevSelected.filter((id) => id !== bookId)
        : [...prevSelected, bookId]
    );
  };

  const renderFirstTable = (books) => {
    const totalTheoretical = books.reduce(
      (sum, book) => sum + (book.prix || 0),
      0
    );
    const allBooks = loadedCollection[selectedMonth] || [];
    const totalTheoreticalAll = allBooks.reduce(
      (sum, book) => sum + (book.prix || 0),
      0
    );

    return (
      <Box className={classes.tableSection}>
        <Typography className={classes.tableTitle} variant='subtitle1'>
          Livres sans prix renseigné
        </Typography>
        <Typography className={classes.tableInfo}>
          Valeur théorique : {totalTheoreticalAll.toFixed(2)} €
          {totalTheoretical !== totalTheoreticalAll && (
            <span>
              {" "}
              (dont {totalTheoretical.toFixed(2)} € pour les livres non
              renseignés)
            </span>
          )}
        </Typography>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Button
                    variant='contained'
                    className={`${classes.button} ${classes.selectButton}`}
                    onClick={() =>
                      handleOpenModal(
                        books.filter((book) =>
                          selectedBookIds.includes(book.id)
                        )
                      )
                    }
                    disabled={selectedBookIds.length === 0}
                  >
                    Sélectionner
                  </Button>
                </TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Prix théorique</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id} hover>
                  <TableCell>
                    <input
                      type='checkbox'
                      className={classes.checkbox}
                      checked={selectedBookIds.includes(book.id)}
                      onChange={() => handleCheckboxChange(book.id)}
                    />
                  </TableCell>
                  <TableCell>{makeTitle(book)}</TableCell>
                  <TableCell>
                    {book.prix !== undefined && book.prix !== null
                      ? book.prix.toFixed(2)
                      : "Non renseigné"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderSecondTable = (books) => {
    const groupedBooks = books.reduce((acc, book) => {
      const groupKey = book.bought_with?.length
        ? [book.id, ...book.bought_with].sort().join(",")
        : book.id;
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(book);
      return acc;
    }, {});

    const totalTheoricalValue = books.reduce(
      (sum, book) => sum + (book.prix || 0),
      0
    );
    const totalEffectiveValue = books.reduce(
      (sum, book) => sum + (book.real_price || 0) + (book.shipping_cost || 0),
      0
    );
    const totalShippingCost = books.reduce(
      (sum, book) => sum + (book.shipping_cost || 0),
      0
    );

    return (
      <Box className={classes.tableSection}>
        <Typography className={classes.tableTitle} variant='subtitle1'>
          Livres avec prix renseigné
        </Typography>
        <Typography className={classes.tableInfo}>
          Valeur effective : {totalEffectiveValue.toFixed(2)} €
          <span> (dont {totalShippingCost.toFixed(2)} € de frais de port)</span>
          {totalTheoricalValue > 0 && (
            <>
              <span> — Théorique : {totalTheoricalValue.toFixed(2)} €</span>
              <span>
                {" "}
                {totalEffectiveValue < totalTheoricalValue &&
                  `(soit ${(
                    100 -
                    (totalEffectiveValue / totalTheoricalValue) * 100
                  ).toFixed(0)}% d'économie)`}
              </span>
            </>
          )}
        </Typography>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Prix total</TableCell>
                <TableCell>Occasion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(groupedBooks).map((group, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    {group.map((book) => makeTitle(book)).join(", ")}
                  </TableCell>
                  <TableCell>
                    {group
                      .reduce(
                        (sum, book) =>
                          sum +
                          (book.real_price || 0) +
                          (book.shipping_cost || 0),
                        0
                      )
                      .toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {group.some((book) => book.is_occasion) ? "Oui" : "Non"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderDateLabel = (selectedMonth) => {
    if (!selectedMonth) return "Aucun mois sélectionné";
    const [month, year] = selectedMonth.split("/");
    return (
      <span>
        {variables.shortMonths[month]} {year}
      </span>
    );
  };

  return (
    <div className={classes.container}>
      {loadedCollection && (
        <>
          <Box className={classes.header}>
            <Tooltip title='Mois précédent'>
              <ArrowBack
                className={classes.arrow}
                onClick={() => handleMonthChange("prev")}
              />
            </Tooltip>
            <Typography
              variant='h6'
              style={{ minWidth: 120, textAlign: "center" }}
            >
              {renderDateLabel(selectedMonth)}
            </Typography>
            <Tooltip title='Mois suivant'>
              <ArrowForward
                className={classes.arrow}
                onClick={() => handleMonthChange("next")}
              />
            </Tooltip>
          </Box>
          <Divider className={classes.divider} />
          {renderFirstTable(
            loadedCollection[selectedMonth]?.filter(
              (book) => !book.real_price
            ) || []
          )}
          <Divider className={classes.divider} />
          {renderSecondTable(
            loadedCollection[selectedMonth]?.filter(
              (book) => book.real_price
            ) || []
          )}
        </>
      )}
      <Modal
        show={showModal}
        onCancel={handleCloseModal}
        header='Renseigner le prix'
      >
        <div className={classes.modalContent}>
          <label>
            Prix :
            <input
              type='number'
              value={price}
              onChange={(e) =>
                setPrice(parseFloat(Number(e.target.value).toFixed(2)))
              }
              className={classes.input}
            />
          </label>
          <label className={classes.switchLabel}>
            Occasion :
            <Switch
              checked={isOccasion}
              onChange={(e) => setIsOccasion(e.target.checked)}
              color='primary'
            />
          </label>
          <label>
            Frais de port :
            <input
              type='number'
              value={shippingCost}
              onChange={(e) =>
                setShippingCost(parseFloat(Number(e.target.value).toFixed(2)))
              }
              className={classes.input}
            />
          </label>
          <div className={classes.modalActions}>
            <Button
              variant='outlined'
              className={classes.outlinedButton}
              onClick={handleCloseModal}
            >
              Annuler
            </Button>
            <Button
              variant='contained'
              className={classes.selectButton}
              onClick={handleValidate}
            >
              Valider
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RealPurchaseManager;
