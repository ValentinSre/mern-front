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
} from "@material-ui/core";
import makeTitle from "../../shared/util/makeTitle";

const RealPurchaseManager = () => {
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
    console.log("sortedMonths", sortedMonths);
    setLoadedCollection(datesByMonth);
    setSelectedMonth(sortedMonths[0] || null);
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

  const renderFirstTable = (books) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Button
                variant='contained'
                color='primary'
                onClick={() =>
                  handleOpenModal(
                    books.filter((book) => selectedBookIds.includes(book.id))
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
            <TableRow key={book.id}>
              <TableCell>
                <input
                  type='checkbox'
                  checked={selectedBookIds.includes(book.id)}
                  onChange={() => handleCheckboxChange(book.id)}
                />
              </TableCell>
              <TableCell>{makeTitle(book)}</TableCell>
              <TableCell>{book.prix || "Non renseigné"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderSecondTable = (books) => {
    const groupedBooks = books.reduce((acc, book) => {
      const groupKey = book.bought_with?.length
        ? [book.id, ...book.bought_with].sort().join(",")
        : book.id;
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(book);
      return acc;
    }, {});

    return (
      <TableContainer component={Paper}>
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
              <TableRow key={index}>
                <TableCell>
                  {group.map((book) => makeTitle(book)).join(", ")}
                </TableCell>
                <TableCell>
                  {group.reduce(
                    (sum, book) =>
                      sum + (book.real_price || 0) + (book.shipping_cost || 0),
                    0
                  )}
                </TableCell>
                <TableCell>
                  {group.some((book) => book.is_occasion) ? "Oui" : "Non"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      {loadedCollection && (
        <>
          <div>
            <button onClick={() => handleMonthChange("prev")}>
              ← Mois précédent
            </button>
            <span>{selectedMonth || "Aucun mois sélectionné"}</span>
            <button onClick={() => handleMonthChange("next")}>
              Mois suivant →
            </button>
          </div>
          <div>
            <h2>Livres sans prix renseigné</h2>
            {renderFirstTable(
              loadedCollection[selectedMonth]?.filter(
                (book) => !book.real_price
              ) || []
            )}
          </div>
          <div>
            <h2>Livres avec prix renseigné</h2>
            {renderSecondTable(
              loadedCollection[selectedMonth]?.filter(
                (book) => book.real_price
              ) || []
            )}
          </div>
        </>
      )}
      <Modal
        show={showModal}
        onCancel={handleCloseModal}
        header='Renseigner le prix'
      >
        <div>
          <label>
            Prix :
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </label>
          <label>
            Occasion :
            <input
              type='checkbox'
              checked={isOccasion}
              onChange={(e) => setIsOccasion(e.target.checked)}
            />
          </label>
          <label>
            Frais de port :
            <input
              type='number'
              value={shippingCost}
              onChange={(e) => setShippingCost(parseFloat(e.target.value))}
            />
          </label>
          <button onClick={handleCloseModal}>Annuler</button>
          <button onClick={handleValidate}>Valider</button>
        </div>
      </Modal>
    </div>
  );
};

export default RealPurchaseManager;
