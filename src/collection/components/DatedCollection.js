import React, { useState, useEffect } from "react";
import { Select, MenuItem, Button } from "@material-ui/core";
import CollectionInDialog from "./CollectionDisplay/components/CollectionInDialog";

import variables from "../../shared/util/variables";

const MonthSelectComponent = ({ loadedBooks, displayMode }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [openSelectedBoughtBooks, setOpenSelectedBoughtBooks] = useState(false);

  const extractDates = (listOfBooks) => {
    const datesByMonth = {};
    if (displayMode === "bySeries") {
      listOfBooks.forEach((serie) => {
        serie.books.forEach((book) => {
          if (book.date_achat) {
            const date = new Date(book.date_achat);
            const formattedDate = `${
              date.getMonth() + 1
            }/${date.getFullYear()}`;
            if (!datesByMonth[formattedDate]) {
              datesByMonth[formattedDate] = [];
            }
            datesByMonth[formattedDate].push(book);
          }
        });
      });
    } else {
      listOfBooks.forEach((book) => {
        if (book.date_achat) {
          const date = new Date(book.date_achat);
          const formattedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
          if (!datesByMonth[formattedDate]) {
            datesByMonth[formattedDate] = [];
          }
          datesByMonth[formattedDate].push(book);
        }
      });
    }
    return datesByMonth;
  };

  const datesByMonth = extractDates(loadedBooks);

  // Créer une liste des mois uniques à partir des dates extraites et les trier par ordre décroissant
  const uniqueMonths = Object.keys(datesByMonth).sort((a, b) => {
    // a et b sont des strings de la forme "MM/YYYY"
    const aMonth = parseInt(a.split("/")[0]);
    const aYear = parseInt(a.split("/")[1]);
    const bMonth = parseInt(b.split("/")[0]);
    const bYear = parseInt(b.split("/")[1]);
    if (aYear > bYear) {
      return -1;
    }
    if (aYear < bYear) {
      return 1;
    }
    if (aMonth > bMonth) {
      return -1;
    }
    if (aMonth < bMonth) {
      return 1;
    }
    return 0;
  });

  const handleShowAchatsClick = () => {
    const filteredBooks = datesByMonth[selectedMonth] || [];
    setFilteredList(filteredBooks);
    setOpenSelectedBoughtBooks(true);
  };

  // Utilisez useEffect pour mettre à jour selectedMonth lorsqu'il est vide
  useEffect(() => {
    if (!selectedMonth && uniqueMonths.length > 0) {
      setSelectedMonth(uniqueMonths[0]);
    }
  }, [selectedMonth, uniqueMonths]);

  // Utilisez useEffect pour mettre à jour l'état isDataLoaded une fois que les données sont chargées
  useEffect(() => {
    if (uniqueMonths.length > 0) {
      setIsDataLoaded(true);
    }
  }, [uniqueMonths]);

  return (
    <div>
      {/* Affichez le Select uniquement lorsque les données sont chargées */}
      {isDataLoaded ? (
        <Select
          label="Groupement"
          id="demo-simple-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {uniqueMonths.map((month, index) => (
            <MenuItem key={index} value={month}>
              {variables.shortMonths[month.split("/")[0]] +
                " " +
                month.split("/")[1]}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <div>Chargement en cours...</div>
      )}
      <Button onClick={handleShowAchatsClick} disabled={selectedMonth === ""}>
        Voir achats
      </Button>
      <CollectionInDialog
        open={openSelectedBoughtBooks}
        books={filteredList}
        onClose={() => setOpenSelectedBoughtBooks(false)}
        title={`Livres achetés en ${
          variables.months[selectedMonth.split("/")[0]] +
          " " +
          selectedMonth.split("/")[1]
        } (${filteredList.length} ouvrages)`}
      />
    </div>
  );
};

export default MonthSelectComponent;
