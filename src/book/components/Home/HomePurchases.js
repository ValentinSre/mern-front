import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import makeTitle from "../../../shared/util/makeTitle";

import "./HomePurchases.css";

const formatPurchaseDate = (date) => {
  const purchaseDate = new Date(date);

  return purchaseDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
};

const HomePurchases = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest } = useHttpClient();

  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!auth.isLoggedIn || !auth.userId) return;

      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/collection/home-purchases/${auth.userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          },
        );

        setPurchases(responseData.purchases || []);
      } catch (err) {
        setPurchases([]);
      }
    };

    fetchPurchases();
  }, [sendRequest, auth.isLoggedIn, auth.userId, auth.token]);

  if (!auth.isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <section className='home-purchases-container'>
        <div className='purchase-header'>
          <div>
            <span className='section-kicker'>Mes derniers achats</span>
          </div>
        </div>

        <div className='purchase-list purchase-skeleton-list'>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className='purchase-item purchase-skeleton-item'>
              <div className='purchase-skeleton-cover' />

              <div className='purchase-skeleton-info'>
                <div className='purchase-skeleton-line' />
                <div className='purchase-skeleton-line short' />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='home-purchases-container'>
        <div className='purchase-header'>
          <div>
            <span className='section-kicker'>Mes derniers achats</span>
          </div>
        </div>

        <p className='purchases-message'>
          Impossible de charger vos derniers achats.
        </p>
      </section>
    );
  }

  if (purchases.length === 0) {
    return (
      <section className='home-purchases-container'>
        <div className='purchase-header'>
          <div>
            <span className='section-kicker'>Mes derniers achats</span>
          </div>

          <Link to={`/real-purchase`} className='purchase-manage-link'>
            Renseigner
            <span>→</span>
          </Link>
        </div>

        <p className='purchases-empty'>Aucun achat récent à afficher.</p>
      </section>
    );
  }

  const purchaseMonth = new Date(purchases[0].date_achat).toLocaleDateString(
    "fr-FR",
    {
      month: "long",
      year: "numeric",
    },
  );

  const openBook = (book) => {
    history.push(`/book/${book.id}`);
  };

  return (
    <section className='home-purchases-container'>
      <div className='purchase-header'>
        <div>
          <span className='section-kicker'>Mes derniers achats</span>
          <h3 className='purchase-month'>{purchaseMonth}</h3>
        </div>

        <Link to={`/real-purchase`} className='purchase-manage-link'>
          Renseigner
          <span>→</span>
        </Link>
      </div>

      <div className='purchase-list'>
        {purchases.map((book) => (
          <div
            key={book.id}
            className='purchase-item'
            onClick={() => openBook(book)}
          >
            <div className='purchase-cover'>
              <img
                src={book.image}
                alt={makeTitle(book)}
                className='purchase-image'
              />

              <span className='purchase-date'>
                {formatPurchaseDate(book.date_achat)}
              </span>
            </div>

            <div className='purchase-info'>
              <p className='purchase-title' title={makeTitle(book)}>
                {makeTitle(book)}
              </p>

              <p className='purchase-type'>{book.type || "Livre"}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomePurchases;
