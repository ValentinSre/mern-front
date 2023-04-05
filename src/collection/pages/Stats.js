import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import CollectionDisplay from "../components/CollectionDisplay/CollectionDisplay";
import CollectionFilter from "../components/CollectionFilter";

import "./Collection.css";

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
    };

    // retrieve all editeurs from the collection

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
          <h2>Stats</h2>
          <p>Nombre de livres possédés : {calculateStats().totalPossede}</p>
          <p>Nombre de livres souhaités : {calculateStats().totalSouhaite}</p>
          <p>Nombre de livres lus : {calculateStats().totalLu}</p>
          <p>Nombre de livres non lus : {calculateStats().totalNonLu}</p>
          <p>Nombre de livres critiqués : {calculateStats().totalCritique}</p>
          <p>Montant de la collection : {calculateStats().totalPrixPossede}€</p>
          <p>Montant de la wishlist : {calculateStats().totalPrixSouhaite}€</p>
          <p>Total de pages possédées : {calculateStats().totalPagesPossede}</p>
          <p>Poids total possédé : {calculateStats().totalPoidsPossede}</p>
          <p>
            {Object.keys(calculateStats().totalBooksByEditeur).map(
              (editeur) => {
                return (
                  <p>
                    {editeur} : {calculateStats().totalBooksByEditeur[editeur]}{" "}
                    livres
                  </p>
                );
              }
            )}
          </p>
        </div>
      )}
    </React.Fragment>
  );
};

export default Stats;
