import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import makeTitle from "../../../shared/util/makeTitle";

import "./HomeSuggestions.css";

const HomeSuggestions = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest } = useHttpClient();

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!auth.isLoggedIn || !auth.userId) return;

      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/collection/purchasing-suggestions/${auth.userId}?limit=8`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          },
        );

        setSuggestions(responseData.incompleteSeries || []);
      } catch (err) {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [sendRequest, auth.isLoggedIn, auth.userId, auth.token]);

  if (!auth.isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <section className='home-suggestions-container'>
        <div className='suggestions-header'>
          <span className='section-kicker'>Nos suggestions</span>
        </div>

        <div className='suggestions-list suggestions-skeleton-list'>
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className='suggestion-item suggestions-skeleton-item'
            >
              <div className='suggestions-skeleton-cover' />

              <div className='suggestions-skeleton-info'>
                <div className='suggestions-skeleton-line' />
                <div className='suggestions-skeleton-line short' />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='home-suggestions-container'>
        <div className='suggestions-header'>
          <span className='section-kicker'>Nos suggestions</span>
        </div>

        <p className='suggestions-message'>
          Impossible de charger vos suggestions.
        </p>
      </section>
    );
  }

  if (suggestions.length === 0) {
    return (
      <section className='home-suggestions-container'>
        <div className='suggestions-header'>
          <span className='section-kicker'>Nos suggestions</span>

          <button
            type='button'
            className='suggestions-link'
            onClick={() => history.push("/suggestions")}
          >
            Voir tout
            <span>→</span>
          </button>
        </div>

        <p className='suggestions-empty'>Aucune suggestion pour le moment.</p>
      </section>
    );
  }

  return (
    <section className='home-suggestions-container'>
      <div className='suggestions-header'>
        <span className='section-kicker'>Nos suggestions</span>

        <button
          type='button'
          className='suggestions-link'
          onClick={() => history.push("/suggestions")}
        >
          Voir tout
          <span>→</span>
        </button>
      </div>

      <div className='suggestions-list'>
        {suggestions.map((book) => (
          <div
            key={book.id_book}
            className='suggestion-item'
            onClick={() => history.push(`/book/${book.id_book}`)}
          >
            <div className='suggestion-cover'>
              <img
                src={book.image}
                alt={makeTitle(book)}
                className='suggestion-image'
              />
            </div>

            <div className='suggestion-info'>
              <p className='suggestion-title' title={makeTitle(book)}>
                {makeTitle(book)}
              </p>

              <p className='suggestion-type'>{book.type || "Livre"}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeSuggestions;
