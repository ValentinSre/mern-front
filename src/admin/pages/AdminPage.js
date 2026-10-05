import React, { useContext, useEffect, useState } from "react";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./AdminPage.css";

const AdminPage = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [books, setBooks] = useState([]);
  const [results, setResults] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBooks = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/book/isbn-pending`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        },
      );

      setBooks(responseData.books);
      setResults({});
    } catch (err) {}
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = async () => {
    if (books.length === 0) return;

    setIsSearching(true);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/book/isbn-search`,
        "POST",
        JSON.stringify({
          bookIds: books.map((book) => book._id),
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      );

      const newResults = {};

      responseData.results.forEach((result) => {
        newResults[result.bookId] = result;
      });

      setResults(newResults);
    } catch (err) {
    } finally {
      setIsSearching(false);
    }
  };

  const handleIsbnChange = (bookId, isbn) => {
    setResults((previous) => ({
      ...previous,
      [bookId]: {
        ...(previous[bookId] || {}),
        isbn,
        status: "manual",
      },
    }));
  };

  const handleCheckIsbn = (isbn) => {
    const cleanIsbn = String(isbn || "").replace(/[-\s]/g, "");

    if (!cleanIsbn) return;

    window.open(
      `https://www.canalbd.net/recherche/?q=${encodeURIComponent(cleanIsbn)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleSave = async () => {
    const booksToSave = Object.entries(results)
      .filter(([, result]) => result.isbn)
      .map(([bookId, result]) => ({
        bookId,
        isbn: result.isbn,
      }));

    if (booksToSave.length === 0) return;

    setIsSaving(true);

    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/book/isbn-save`,
        "POST",
        JSON.stringify({
          books: booksToSave,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      );

      await fetchBooks();
    } catch (err) {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <main className='admin-page'>
        <div className='admin-shell'>
          <header className='admin-header'>
            <span className='admin-kicker'>Administration</span>

            <h1>Gestion de l'application</h1>

            <p>
              Outils d'administration de WebVerse et gestion des données de la
              collection.
            </p>
          </header>

          <section className='admin-card'>
            <div className='admin-card-header'>
              <div className='admin-card-title'>
                <h2>Gestion des ISBN</h2>
                <p>{books.length} livre(s) sans ISBN affiché(s).</p>
              </div>

              <div className='admin-actions'>
                <button
                  type='button'
                  className='admin-secondary-btn'
                  onClick={handleSearch}
                  disabled={isSearching || isLoading || books.length === 0}
                >
                  {isSearching
                    ? "Recherche en cours..."
                    : "Rechercher les ISBN"}
                </button>

                <button
                  type='button'
                  className='admin-primary-btn'
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer les ISBN"}
                </button>
              </div>
            </div>

            <div className='admin-list'>
              {books.map((book) => {
                const result = results[book._id];

                let statusClass = "";
                let statusContent = "—";

                if (result?.status === "manual" && book.type === "Roman") {
                  statusClass = "admin-status--manual";
                  statusContent = "✏️ Saisie manuelle";
                } else if (result?.status === "found") {
                  statusClass =
                    result.confidence >= 90
                      ? "admin-status--success"
                      : "admin-status--warning";

                  statusContent = `${result.confidence}% ${
                    result.confidence >= 90 ? "✓" : "⚠"
                  }`;
                } else if (result?.status === "not_found") {
                  statusClass = "admin-status--error";
                  statusContent = "✕ Introuvable";
                }

                return (
                  <div key={book._id} className='admin-book'>
                    <div className='admin-book-title'>
                      <strong>{book.titre}</strong>

                      {book.serie && (
                        <div className='admin-book-series'>
                          {book.serie}
                          {book.tome ? ` — Tome ${book.tome}` : ""}
                        </div>
                      )}

                      <div className='admin-book-meta'>
                        {book.type} · {book.editeur}
                      </div>
                    </div>

                    <div className='admin-book-date'>
                      {book.date_parution
                        ? new Date(book.date_parution).toLocaleDateString(
                            "fr-FR",
                          )
                        : "—"}
                    </div>

                    <div>
                      <span className={`admin-status ${statusClass}`}>
                        {statusContent}
                      </span>
                    </div>

                    <div className='admin-isbn-wrapper'>
                      <input
                        className='admin-isbn-input'
                        type='text'
                        value={result?.isbn || ""}
                        placeholder='ISBN / EAN'
                        onChange={(event) =>
                          handleIsbnChange(book._id, event.target.value)
                        }
                      />

                      <button
                        type='button'
                        className='admin-isbn-check'
                        onClick={() => handleCheckIsbn(result?.isbn)}
                        disabled={!result?.isbn}
                        title='Vérifier cet ISBN sur CanalBD'
                        aria-label='Vérifier cet ISBN sur CanalBD'
                      >
                        👁
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </React.Fragment>
  );
};

export default AdminPage;
