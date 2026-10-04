import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory, Link } from "react-router-dom";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import makeTitle from "../../../shared/util/makeTitle";

import "./HomeReadlist.css";

const HomeReadlist = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest } = useHttpClient();

  const [unreadlist, setUnreadlist] = useState([]);
  const [sortMode, setSortMode] = useState("title");

  useEffect(() => {
    const fetchReadlist = async () => {
      if (!auth.isLoggedIn || !auth.userId) return;

      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/collection/readlist/${auth.userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          },
        );

        setUnreadlist(responseData.unreadlist || []);
      } catch (err) {
        setUnreadlist([]);
      }
    };

    fetchReadlist();
  }, [sendRequest, auth.isLoggedIn, auth.userId, auth.token]);

  const sortedUnreadlist = useMemo(() => {
    return [...unreadlist].sort((a, b) => {
      if (sortMode === "pages") {
        return (a.planches || 0) - (b.planches || 0);
      }

      return makeTitle(a).localeCompare(makeTitle(b), "fr", {
        sensitivity: "base",
      });
    });
  }, [unreadlist, sortMode]);

  if (!auth.isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <section className='home-readlist-container'>
        <div className='readlist-header'>
          <div className='readlist-header-left'>
            <span className='section-kicker'>Ma pile à lire</span>
          </div>
        </div>

        <div className='readlist-list readlist-skeleton-list'>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className='readlist-skeleton-item'>
              <div className='readlist-skeleton-cover' />

              <div className='readlist-skeleton-info'>
                <div className='readlist-skeleton-line' />
                <div className='readlist-skeleton-line short' />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='home-readlist-container'>
        <div className='readlist-header'>
          <div className='readlist-header-left'>
            <span className='section-kicker'>Ma pile à lire</span>
          </div>
        </div>

        <p className='readlist-message'>
          Impossible de charger votre pile à lire.
        </p>
      </section>
    );
  }

  if (unreadlist.length === 0) {
    return (
      <section className='home-readlist-container'>
        <div className='readlist-header'>
          <div className='readlist-header-left'>
            <span className='section-kicker'>Ma pile à lire</span>
          </div>

          <Link to='/readlist' className='readlist-link'>
            Voir tout
            <span>→</span>
          </Link>
        </div>

        <p className='readlist-empty'>
          Votre pile à lire est vide pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className='home-readlist-container'>
      <div className='readlist-header'>
        <div className='readlist-header-left'>
          <span className='section-kicker'>Ma pile à lire</span>

          <div className='readlist-filters'>
            <button
              type='button'
              className={`readlist-filter ${
                sortMode === "title" ? "active" : ""
              }`}
              onClick={() => setSortMode("title")}
            >
              A–Z
            </button>

            <button
              type='button'
              className={`readlist-filter ${
                sortMode === "pages" ? "active" : ""
              }`}
              onClick={() => setSortMode("pages")}
            >
              Pages
            </button>
          </div>
        </div>

        <Link to='/readlist' className='readlist-link'>
          Voir tout
          <span>→</span>
        </Link>
      </div>

      <div className='readlist-list'>
        {sortedUnreadlist.map((book) => (
          <div
            key={book.id_book}
            className='readlist-item'
            onClick={() => history.push(`/book/${book.id_book}`)}
          >
            <div className='readlist-cover'>
              <img
                src={book.image}
                alt={book.titre}
                className='readlist-image'
              />
            </div>

            <div className='readlist-info'>
              <p className='readlist-title' title={makeTitle(book)}>
                {makeTitle(book)}
              </p>

              <p className='readlist-pages'>
                {book.planches ? `${book.planches} pages` : "Pages inconnues"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeReadlist;
