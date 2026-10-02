import React from "react";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import makeTitle from "../../../shared/util/makeTitle";

import "./HomePurchases.css";

const formatPurchaseDate = (date) => {
  const purchaseDate = new Date(date);

  return purchaseDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
};

const HomePurchases = ({ purchases, userId }) => {
  const history = useHistory();

  if (!purchases || purchases.length === 0) {
    return null;
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

        <Link to={`/${userId}/real-purchase`} className='purchase-manage-link'>
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

HomePurchases.propTypes = {
  purchases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      titre: PropTypes.string.isRequired,
      serie: PropTypes.string,
      tome: PropTypes.number,
      version: PropTypes.string,
      image: PropTypes.string.isRequired,
      type: PropTypes.string,
      date_achat: PropTypes.string.isRequired,
    }),
  ).isRequired,
  userId: PropTypes.string.isRequired,
};

export default HomePurchases;
