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
import EvolutionFrame from "../components/StatsComponents/EvolutionFrame";
import { TbPigMoney } from "react-icons/tb";
import { BsFillCartPlusFill, BsFillEyeFill, BsBookmarks } from "react-icons/bs";
import { GiReceiveMoney, GiWeight } from "react-icons/gi";
import { MdSpeakerNotes } from "react-icons/md";
import { ImBooks } from "react-icons/im";

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
      component1: <BooksByEditor data={booksByEditeur} />,
      component1Name: "Proportion par éditeur",
      component2: null,
      component2Name: null,
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
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCollection && (
        <div className="collection">
          <div className="collection-stats">
            <div className="collection-stats__frame">
              <EvolutionFrame
                title={"Nb. de livres possédés"}
                value={calculateStats().totalPossede}
                positive
                difference={(
                  (boughtBooksByMonthArray[11].valeur /
                    calculateStats().totalPossede) *
                  100
                ).toFixed(2)}
                icon={<ImBooks />}
                comparisonPhrase={"depuis le mois dernier"}
              />
            </div>

            <div className="collection-stats__frame">
              <EvolutionFrame
                title={"Prix des livres possédés"}
                value={calculateStats().totalPrixPossede.toFixed(2) + " €"}
                positive
                difference={
                  areaChartArray.length &&
                  (
                    (areaChartArray[areaChartArray.length - 1].total /
                      calculateStats().totalPrixPossede) *
                    100
                  ).toFixed(2)
                }
                icon={<GiReceiveMoney />}
                comparisonPhrase={"depuis le mois dernier"}
              />
            </div>

            <div className="collection-stats__frame">
              <EvolutionFrame
                title={"Nb. de livres souhaités"}
                value={calculateStats().totalSouhaite}
                icon={<BsFillCartPlusFill />}
              />
            </div>

            <div className="collection-stats__frame">
              <EvolutionFrame
                title={"Prix des livres souhaités"}
                value={calculateStats().totalPrixSouhaite.toFixed(2) + " €"}
                icon={<TbPigMoney />}
              />
            </div>

            <div className="collection-stats__frame">
              <EvolutionFrame
                title={"Nb. de livres lus"}
                value={calculateStats().totalLu}
                positive={
                  readBooksByMonthArray.length > 2
                    ? (readBooksByMonthArray[readBooksByMonthArray.length - 1]
                        .livres /
                        readBooksByMonthArray[readBooksByMonthArray.length - 2]
                          .livres -
                        1) *
                        100 >
                      0
                    : true
                }
                difference={
                  readBooksByMonthArray.length > 2
                    ? (
                        (readBooksByMonthArray[readBooksByMonthArray.length - 1]
                          .livres /
                          readBooksByMonthArray[
                            readBooksByMonthArray.length - 2
                          ].livres -
                          1) *
                        100
                      ).toFixed(2)
                    : null
                }
                comparisonPhrase={"par rapport au mois dernier"}
                icon={<BsFillEyeFill />}
              />
            </div>

            <div className="collection-stats__frame">
              <EvolutionFrame
                title={"Nb. de livres critiqués"}
                value={calculateStats().totalCritique}
                percentage={(
                  (calculateStats().totalCritique /
                    calculateStats().totalPossede) *
                  100
                ).toFixed(2)}
                icon={<MdSpeakerNotes />}
              />
            </div>

            <div className="collection-stats__frame">
              <EvolutionFrame
                title={"Nb. de pages cumulées"}
                value={calculateStats().totalPagesPossede}
                icon={<BsBookmarks />}
              />
            </div>

            <div className="collection-stats__frame">
              <EvolutionFrame
                title={"Poids total des livres"}
                value={
                  (calculateStats().totalPoidsPossede / 1000).toFixed(2) + " kg"
                }
                icon={<GiWeight />}
              />
            </div>
          </div>

          <div className="collection-stats_container">
            <div className="collection-stats__stepper">
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
            <div className="collection-stats__title">
              <h2>{title}</h2>
            </div>
            <div className="collection-stats__components">
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
