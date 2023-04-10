import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import ReadReviewedProportion from "../components/StatsComponents/ReadReviewedProportion";
import BoughtBooksByMonthComparison from "../components/StatsComponents/BoughtBooksByMonthComparison";
import AmountEvolution from "../components/StatsComponents/AmountEvolution";
import ReadEvolution from "../components/StatsComponents/ReadEvolution";
import BooksByEditor from "../components/StatsComponents/BooksByEditor";

import { TbPigMoney } from "react-icons/tb";

import CustomCard from "../components/StatsComponents/CustomCard";
import "./Stats.css";

const Stats = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCollection, setLoadedCollection] = useState();

  const fetchStats = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/stats/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setLoadedCollection(responseData.collection);
    } catch (err) {}
  };

  useEffect(() => {
    fetchStats();
  }, [sendRequest, auth.userId]);

  const calculateStats = () => {
    const stats = {
      totalPossede: 0,
      totalSouhaite: 0,
      totalLu: 0,
      totalNonLu: 0,
      totalCritique: 0,
      totalPrixPossede: 0,
      totalPrixSouhaite: 0,
      totalPagesPossede: 0,
      totalPoidsPossede: 0,
      totalBooksByEditeur: {},
      readBooksByEditeur: {},
    };

    for (const book of loadedCollection) {
      if (book.possede) {
        stats.totalPossede++;
        stats.totalPrixPossede += book.prix;
        stats.totalPagesPossede += book.planches;
        stats.totalPoidsPossede += book.poids;
      }
      if (book.souhaite) {
        stats.totalSouhaite++;
        stats.totalPrixSouhaite += book.prix;
      }
      if (book.lu) {
        stats.totalLu++;
        if (book.editeur in stats.readBooksByEditeur) {
          stats.readBooksByEditeur[book.editeur]++;
        } else {
          stats.readBooksByEditeur[book.editeur] = 1;
        }
      }
      if (!book.lu) {
        stats.totalNonLu++;
      }
      if (book.critique) {
        stats.totalCritique++;
      }
      if (book.editeur in stats.totalBooksByEditeur) {
        stats.totalBooksByEditeur[book.editeur]++;
      } else {
        stats.totalBooksByEditeur[book.editeur] = 1;
      }
    }

    return stats;
  };

  // Initialize stats objects
  let readNotReadPercentages = {};
  let reviewedNotReviewedPercentages = {};
  let boughtBooksByMonth = {};
  let readBooksByMonth = {};
  let boughtBooksByMonthArray = [];
  let areaChartArray = [];
  let readBooksByMonthArray = [];
  let booksByEditeur = [];

  if (loadedCollection) {
    // Calculate brut stats
    const ownedBooks = calculateStats().totalPossede;
    const readBooks = calculateStats().totalLu;
    const reviewBooks = calculateStats().totalCritique;

    // Calculate read/review percentages (ReadReviewProportion)
    const readBooksPercentage = (readBooks / ownedBooks) * 100;
    const notReadBooksPercentage = 100 - readBooksPercentage;
    const reviewBooksPercentage = (reviewBooks / readBooks) * 100;
    const notReviewBooksPercentage = 100 - reviewBooksPercentage;
    readNotReadPercentages = {
      Lus: readBooksPercentage,
      "Non lus": notReadBooksPercentage,
    };
    reviewedNotReviewedPercentages = {
      Critiqués: reviewBooksPercentage,
      "Non critiqués": notReviewBooksPercentage,
    };

    // Group all books by month/year of buy (each category has the form 'MM/YYYY')
    loadedCollection.forEach((book) => {
      if (book.possede && book.date_achat) {
        const date = new Date(book.date_achat);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const monthYear = `${month}/${year}`;

        if (boughtBooksByMonth[monthYear]) {
          boughtBooksByMonth[monthYear].push(book);
        } else {
          boughtBooksByMonth[monthYear] = [book];
        }
      }
    });

    // Group all books by month/year of read (each category has the form 'MM/YYYY')
    loadedCollection.forEach((book) => {
      if (book.lu && book.date_lecture) {
        const date = new Date(book.date_lecture);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const monthYear = `${month}/${year}`;

        if (readBooksByMonth[monthYear]) {
          readBooksByMonth[monthYear].push(book);
        } else {
          readBooksByMonth[monthYear] = [book];
        }
      }
    });

    // Calculate the number of books bought each month for the last 12 months and the 12 months before (BoughtBooksByMonthComparison)
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthYear = `${month}/${year}`;

      const previousDate = new Date();
      previousDate.setMonth(previousDate.getMonth() - i - 12);
      const previousMonth = previousDate.getMonth() + 1;
      const previousYear = previousDate.getFullYear();
      const previousMonthYear = `${previousMonth}/${previousYear}`;

      const numberOfBooks = boughtBooksByMonth[monthYear]
        ? boughtBooksByMonth[monthYear].length
        : 0;
      const previousNumberOfBooks = boughtBooksByMonth[previousMonthYear]
        ? boughtBooksByMonth[previousMonthYear].length
        : 0;

      boughtBooksByMonthArray.push({
        date: monthYear,
        valeur: numberOfBooks,
        prevVal: previousNumberOfBooks,
      });
    }
    boughtBooksByMonthArray.reverse();

    // Calculate the price of books bought each month since the beginning (AmountEvolution)
    let total = 0;
    for (const monthYear in boughtBooksByMonth) {
      boughtBooksByMonth[monthYear].forEach((book) => {
        total += book.prix;
      });
      areaChartArray.push({ date: monthYear, total: total });
    }
    areaChartArray.reverse();

    // Calculate the number of books read and the number of pages read each month separately (ReadBooksByMonthComparison)
    for (const monthYear in readBooksByMonth) {
      let numberOfBooks = 0;
      let numberOfPages = 0;
      let numberOfReviews = 0;
      readBooksByMonth[monthYear].forEach((book) => {
        numberOfBooks++;
        numberOfPages += book.planches;
        if (book.critique) {
          numberOfReviews++;
        }
      });
      readBooksByMonthArray.push({
        date: monthYear,
        livres: numberOfBooks,
        pages: numberOfPages,
        critique: numberOfReviews,
      });
    }
    readBooksByMonthArray.reverse();

    // Calculate the number of books of each editor and the number of books read of each editor
    const totalBooksByEditeur = calculateStats().totalBooksByEditeur;
    const readBooksByEditeur = calculateStats().readBooksByEditeur;
    for (const editeur in totalBooksByEditeur) {
      booksByEditeur.push({
        editeur: editeur,
        total: totalBooksByEditeur[editeur],
        lu: readBooksByEditeur[editeur],
      });
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCollection && (
        <div className='collection'>
          <CustomCard
            title='Total sales'
            value={1500.5}
            sign='€'
            icon={<TbPigMoney />}
          />
          <h2>Informations générales</h2>
          <div className='collection-stats'>
            <div className='collection-stats__frame'>
              <h3>Nombre de livres possédés</h3>
              <p>{calculateStats().totalPossede}</p>
            </div>
            <div className='collection-stats__frame'>
              <h3>Nombre de livres lus</h3>
              <p>{calculateStats().totalLu}</p>
            </div>
            <div className='collection-stats__frame'>
              <h3>Wishlist</h3>
              <p>{calculateStats().totalSouhaite}</p>
            </div>
            <div className='collection-stats__frame'>
              <h3>Critiques</h3>
              <p>{calculateStats().totalCritique}</p>
            </div>
            <div className='collection-stats__frame'>
              <h3>valeur (collection)</h3>
              <p>{calculateStats().totalPrixPossede}€</p>
            </div>
            <div className='collection-stats__frame'>
              <h3>Prix (wishlist)</h3>
              <p>{calculateStats().totalPrixSouhaite}€</p>
            </div>
            <div className='collection-stats__frame'>
              <h3>Nombre de pages</h3>
              <p>{calculateStats().totalPages}</p>
            </div>
            <div className='collection-stats__frame'>
              <h3>Poids total</h3>
              <p>{calculateStats().totalPoids}g</p>
            </div>
          </div>
          <div className='collection-stats__read'>
            <h2>Informations de lecture</h2>
            <ReadReviewedProportion
              categoryPercentages={readNotReadPercentages}
              criticalPercentages={reviewedNotReviewedPercentages}
            />
            <ReadEvolution data={readBooksByMonthArray} />
          </div>
          <div className='collection-stats__buy'>
            <h2>Informations d'achat</h2>
            <AmountEvolution data={areaChartArray} />
            <BoughtBooksByMonthComparison data={boughtBooksByMonthArray} />
          </div>
          <div className='collection-stats__editeur'>
            <h2>Informations par éditeur</h2>
            <BooksByEditor data={booksByEditeur} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Stats;
