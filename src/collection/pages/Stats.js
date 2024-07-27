import React, { useEffect, useState, useContext } from "react";

import { Skeleton } from "@material-ui/lab";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import ReadReviewedProportion from "../components/StatsComponents/ReadReviewedProportion";
import BoughtBooksByMonthComparison from "../components/StatsComponents/BoughtBooksByMonthComparison";
import AmountEvolution from "../components/StatsComponents/AmountEvolution";
import ReadEvolution from "../components/StatsComponents/ReadEvolution";
import ProportionOfEachType from "../components/StatsComponents/ProportionOfEachType";
import ReadUnreadByTypes from "../components/StatsComponents/ReadUnreadByTypes";
import StatsLineFrames from "../components/StatsComponents/StatsLineFrames";

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
      originalPossede: 0,
      originalPrixPossede: 0,
      originalPoidsPossede: 0,
      originalPagesPossede: 0,
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
      Manga: {
        total: 0,
        lu: 0,
        nonLu: 0,
      },
      Comics: {
        total: 0,
        lu: 0,
        nonLu: 0,
      },
      Roman: {
        total: 0,
        lu: 0,
        nonLu: 0,
      },
      BD: {
        total: 0,
        lu: 0,
        nonLu: 0,
      },
    };

    const targetDate = new Date("2022-08-31T23:59:59.999+00:00");

    for (const book of loadedCollection) {
      if (book.possede && !book.revendu) {
        stats.totalPossede++;
        stats.totalPrixPossede += book.prix;
        stats.totalPagesPossede += book.planches;
        stats.totalPoidsPossede += book.poids;

        if (!book.date_achat || new Date(book.date_achat) <= targetDate) {
          stats.originalPossede++;
          stats.originalPrixPossede += book.prix;
          stats.originalPagesPossede += book.planches;
          stats.originalPoidsPossede += book.poids;
        }

        stats[book.type].total++;
        if (book.lu) {
          stats[book.type].lu++;
        } else {
          stats[book.type].nonLu++;
        }
      }
      if (book.souhaite) {
        stats.totalSouhaite++;
        stats.totalPrixSouhaite += book.prix;
      }
      if (book.lu && book.possede && !book.revendu) {
        stats.totalLu++;
        if (book.editeur in stats.readBooksByEditeur) {
          stats.readBooksByEditeur[book.editeur]++;
        } else {
          stats.readBooksByEditeur[book.editeur] = 1;
        }
      }
      if (!book.lu && book.possede) {
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
  let proportionOfEachType = {};
  let proportionOfEachTypeRead = {
    Manga: { lu: 0, nonLu: 0 },
    Comics: { lu: 0, nonLu: 0 },
    Roman: { lu: 0, nonLu: 0 },
    BD: { lu: 0, nonLu: 0 },
  };

  if (loadedCollection) {
    // Calculate brut stats
    const ownedBooks = calculateStats().totalPossede;
    const readBooks = calculateStats().totalLu;
    const reviewBooks = calculateStats().totalCritique;

    // Calculate proportion of each type of book (ProportionOfEachType)
    proportionOfEachType = {
      Manga: calculateStats().Manga.total,
      Comics: calculateStats().Comics.total,
      Roman: calculateStats().Roman.total,
      BD: calculateStats().BD.total,
    };

    // Calculate proportion of each type of book read (ProportionOfEachTypeRead)
    proportionOfEachTypeRead = {
      Manga: {
        lu: calculateStats().Manga.lu,
        nonLu: calculateStats().Manga.nonLu,
      },
      Comics: {
        lu: calculateStats().Comics.lu,
        nonLu: calculateStats().Comics.nonLu,
      },
      Roman: {
        lu: calculateStats().Roman.lu,
        nonLu: calculateStats().Roman.nonLu,
      },
      BD: { lu: calculateStats().BD.lu, nonLu: calculateStats().BD.nonLu },
    };

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
      if (book.lu && book.read_dates) {
        for (const date_lecture of book.read_dates) {
          const date = new Date(date_lecture);
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const monthYear = `${month}/${year}`;

          if (readBooksByMonth[monthYear]) {
            readBooksByMonth[monthYear].push(book);
          } else {
            readBooksByMonth[monthYear] = [book];
          }
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
    boughtBooksByMonthArray.sort((a, b) => {
      const [moisA, anneeA] = a.date.split("/");
      const [moisB, anneeB] = b.date.split("/");

      if (Number(anneeA) !== Number(anneeB)) {
        return Number(anneeA) - Number(anneeB);
      }

      return Number(moisA) - Number(moisB);
    });

    // Calculate the price of books bought each month since the beginning (AmountEvolution)
    for (const monthYear in boughtBooksByMonth) {
      let total = 0;
      boughtBooksByMonth[monthYear].forEach((book) => {
        total += book.prix;
      });
      areaChartArray.push({ date: monthYear, total: total });
    }
    areaChartArray.sort((a, b) => {
      const [moisA, anneeA] = a.date.split("/");
      const [moisB, anneeB] = b.date.split("/");

      if (Number(anneeA) !== Number(anneeB)) {
        return Number(anneeA) - Number(anneeB);
      }

      return Number(moisA) - Number(moisB);
    });

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

    // reorder the array by date (oldest first) : the date is in the form 'MM/YYYY' in an object
    readBooksByMonthArray.sort((a, b) => {
      const [moisA, anneeA] = a.date.split("/");
      const [moisB, anneeB] = b.date.split("/");

      if (Number(anneeA) !== Number(anneeB)) {
        return Number(anneeA) - Number(anneeB);
      }

      return Number(moisA) - Number(moisB);
    });

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

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const collectionStatsData = [
    {
      title: "Informations de lecture",
      component1: (
        <ReadReviewedProportion
          categoryPercentages={readNotReadPercentages}
          criticalPercentages={reviewedNotReviewedPercentages}
        />
      ),
      component1Name: "Proportion de livres lus et critiqués",
      component2: <ReadEvolution data={readBooksByMonthArray} />,
      component2Name: "Evolution du nombre de livres lus",
    },
    {
      title: "Informations d'achat",
      component1: <AmountEvolution data={areaChartArray} />,
      component1Name: "Evolution du montant des achats",
      component2: (
        <BoughtBooksByMonthComparison data={boughtBooksByMonthArray} />
      ),
      component2Name: "Comparaison des achats mensuels",
    },
    {
      title: "Informations par éditeur",
      component1: <ProportionOfEachType data={proportionOfEachType} />,
      component1Name: "Proportion par type de livre",
      component2: <ReadUnreadByTypes data={proportionOfEachTypeRead} />,
      component2Name: "Proportion lu / non lu par type de livre",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % collectionStatsData.length);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [currentIndex, fetchStats, collectionStatsData.length]);

  const handleTabClick = (index) => {
    setSelectedIndex(index);
    setCurrentIndex(index);
  };

  const { title, component1, component2, component1Name, component2Name } =
    collectionStatsData[currentIndex];

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {(isLoading || !loadedCollection) && (
        <div className='collection'>
          <div>
            <Skeleton
              width={"90%"}
              height={250}
              style={{ borderRadius: "10px", margin: "10px" }}
            />
          </div>
          <div>
            <Skeleton
              variant='rect'
              width={"90%"}
              height={500}
              style={{ borderRadius: "10px", margin: "10px" }}
            />
          </div>
        </div>
      )}
      {!isLoading && loadedCollection && (
        <div className='collection'>
          <StatsLineFrames
            calculateStats={calculateStats}
            readBooksByMonthArray={readBooksByMonthArray}
          />
          <div className='collection-stats_container'>
            <div className='collection-stats__stepper'>
              {collectionStatsData.map((_, index) => (
                <div
                  key={index}
                  className={`collection-stats__step ${
                    index === selectedIndex ? "selected" : ""
                  }`}
                  onClick={() => handleTabClick(index)}
                />
              ))}
            </div>
            <div className='collection-stats__title'>
              <h2>{title}</h2>
            </div>
            <div className='collection-stats__components'>
              <h2>{component1Name}</h2>
              {component1}
              {component2 && (
                <>
                  <h2>{component2Name}</h2>
                  {component2}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Stats;
