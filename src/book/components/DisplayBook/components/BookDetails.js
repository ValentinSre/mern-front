import React from "react";
import {
  MdAddTask,
  MdOutlineAddShoppingCart,
  MdOutlineBookmarkAdded,
  MdAttachMoney,
  MdPlaylistAdd,
  MdEdit,
  MdDeleteOutline,
} from "react-icons/md";
import { RxChatBubble } from "react-icons/rx";
import { TbPencil } from "react-icons/tb";

import Breadcrumb from "../../../../shared/components/UIElements/Breadcrumb";
import makeTitle from "../../../../shared/util/makeTitle";
import BookReview from "./BookReview";

import "./BookDetails.css";

const formatDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const BookDetails = ({
  book,
  isAuthenticated,
  handleCollection,
  handleWishlist,
  handleRead,
  handleSell,
  handleAddToList,
  handleEditReadDate,
  handleDeleteReadDate,
}) => {
  const title = makeTitle(book);
  const authors = book.auteurs || [];
  const artists = book.dessinateurs || [];

  const readDates = (book.read_dates || [])
    .map((date, index) => ({ date, index }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const metadata = [
    ["Éditeur", book.editeur],
    ["Date de parution", formatDate(book.date_parution)],
    ["ISBN", book.isbn],
    ["Format", book.format],
    ["Genre", book.genre],
    ["Type", book.type],
    ["Nombre de pages", book.planches ? `${book.planches} pages` : null],
    ["Poids", book.poids ? `${book.poids} g` : null],
    [
      "Prix public",
      book.prix !== undefined && book.prix !== null ? `${book.prix} €` : null,
    ],
  ].filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  return (
    <div className='book-details-page'>
      <Breadcrumb page={title} />

      <main className='book-details'>
        <section className='book-details__hero'>
          <div className='book-details__cover'>
            {book.image ? (
              <img src={book.image} alt={`Couverture de ${title}`} />
            ) : (
              <div className='book-details__cover-empty'>
                Couverture indisponible
              </div>
            )}
          </div>

          <div className='book-details__identity'>
            <div className='book-details__eyebrow'>
              {book.serie && <span>{book.serie}</span>}
              {book.tome !== undefined &&
                book.tome !== null &&
                book.tome !== "" && <span>Tome {book.tome}</span>}
            </div>

            <h1>{title}</h1>

            <div className='book-details__credits'>
              {authors.length > 0 && (
                <div>
                  <RxChatBubble />
                  <span className='book-details__credit-label'>Scénario</span>
                  <span>{authors.map((artist) => artist.nom).join(", ")}</span>
                </div>
              )}

              {artists.length > 0 && (
                <div>
                  <TbPencil />
                  <span className='book-details__credit-label'>Dessin</span>
                  <span>{artists.map((artist) => artist.nom).join(", ")}</span>
                </div>
              )}
            </div>

            <div className='book-details__classification'>
              {book.type && <span>{book.type}</span>}
              {book.genre && <span>{book.genre}</span>}
            </div>

            {isAuthenticated && (
              <div className='book-details__actions'>
                <button
                  type='button'
                  onClick={handleCollection}
                  disabled={book.possede && !book.revendu}
                  className={book.possede && !book.revendu ? "active" : ""}
                >
                  <MdAddTask />
                  <span>
                    {book.possede && !book.revendu
                      ? "Dans ma collection"
                      : "Je le possède"}
                  </span>
                </button>

                <button
                  type='button'
                  onClick={handleWishlist}
                  disabled={book.possede || book.souhaite}
                  className={book.souhaite ? "active" : ""}
                >
                  <MdOutlineAddShoppingCart />
                  <span>{book.souhaite ? "Dans ma wishlist" : "Wishlist"}</span>
                </button>

                <button type='button' onClick={handleRead}>
                  <MdOutlineBookmarkAdded />
                  <span>Marquer comme lu</span>
                </button>

                {book.possede && !book.revendu && (
                  <button type='button' onClick={handleSell}>
                    <MdAttachMoney />
                    <span>Revendre</span>
                  </button>
                )}

                <button type='button' onClick={handleAddToList}>
                  <MdPlaylistAdd />
                  <span>Ajouter à une liste</span>
                </button>
              </div>
            )}

            {isAuthenticated && (
              <div className='book-details__personal-status'>
                {book.possede && !book.revendu && (
                  <span className='status-owned'>Dans ma collection</span>
                )}
                {book.souhaite && (
                  <span className='status-wishlist'>Dans ma wishlist</span>
                )}
                {book.lu && <span className='status-read'>Déjà lu</span>}
                {book.revendu && <span className='status-sold'>Revendu</span>}
              </div>
            )}
          </div>
        </section>

        {book.description && (
          <section className='book-details__section'>
            <h2>À propos de cet ouvrage</h2>
            <p className='book-details__synopsis'>{book.description}</p>
          </section>
        )}

        {metadata.length > 0 && (
          <section className='book-details__section'>
            <h2>Informations sur l'ouvrage</h2>

            <dl className='book-details__metadata'>
              {metadata.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {isAuthenticated && (
          <>
            <section className='book-details__section book-details__personal'>
              <div className='book-details__section-heading'>
                <div>
                  <span className='book-details__section-kicker'>
                    PERSONNEL
                  </span>
                  <h2>Ma collection</h2>
                </div>

                {book.possede && !book.revendu && (
                  <span className='book-details__section-status'>Possédé</span>
                )}
                {book.souhaite && (
                  <span className='book-details__section-status'>Souhaité</span>
                )}
                {book.revendu && (
                  <span className='book-details__section-status'>Revendu</span>
                )}
              </div>

              {book.possede && !book.revendu && (
                <div className='book-details__personal-info'>
                  {book.date_achat && (
                    <div>
                      <span>Date d'achat</span>
                      <strong>{formatDate(book.date_achat)}</strong>
                    </div>
                  )}

                  {book.real_price !== undefined &&
                    book.real_price !== null && (
                      <div>
                        <span>Prix d'achat</span>
                        <strong>
                          {Number(book.real_price).toFixed(2)} €
                        </strong>{" "}
                      </div>
                    )}
                </div>
              )}

              {!book.possede && !book.souhaite && !book.revendu && (
                <p className='book-details__empty'>
                  Ce livre ne fait pas encore partie de votre collection.
                </p>
              )}
            </section>

            <section className='book-details__section'>
              <div className='book-details__section-heading'>
                <div>
                  <span className='book-details__section-kicker'>
                    PERSONNEL
                  </span>
                  <h2>Mon historique de lecture</h2>
                </div>

                <button
                  type='button'
                  className='book-details__text-action'
                  onClick={handleRead}
                >
                  + Ajouter une lecture
                </button>
              </div>

              {readDates.length > 0 ? (
                <ul className='book-details__reading-history'>
                  {readDates.map(({ date, index }) => (
                    <li key={`${date}-${index}`}>
                      <span className='book-details__history-dot' />

                      <span className='book-details__history-date'>
                        {date
                          ? `Lecture terminée le ${formatDate(date)}`
                          : "Lecture initiale non datée"}
                      </span>

                      {date && (
                        <div className='book-details__history-actions'>
                          <button
                            type='button'
                            onClick={() => handleEditReadDate(index, date)}
                            title='Modifier cette date'
                            aria-label='Modifier cette date de lecture'
                          >
                            <MdEdit />
                          </button>

                          <button
                            type='button'
                            onClick={() => handleDeleteReadDate(index)}
                            title='Supprimer cette date'
                            aria-label='Supprimer cette date de lecture'
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='book-details__empty'>
                  Aucune lecture enregistrée pour le moment.
                </p>
              )}
            </section>

            {Array.isArray(book.lists) && book.lists.length > 0 && (
              <section className='book-details__section'>
                <div className='book-details__section-heading'>
                  <div>
                    <span className='book-details__section-kicker'>
                      PERSONNEL
                    </span>
                    <h2>Mes listes</h2>
                  </div>

                  <button
                    type='button'
                    className='book-details__text-action'
                    onClick={handleAddToList}
                  >
                    Gérer mes listes
                  </button>
                </div>

                <div className='book-details__lists'>
                  {book.lists
                    .filter((list) => list.containsBook)
                    .map((list) => (
                      <span key={list._id}>{list.name}</span>
                    ))}
                </div>

                {!book.lists.some((list) => list.containsBook) && (
                  <p className='book-details__empty'>
                    Ce livre n'est dans aucune de vos listes.
                  </p>
                )}
              </section>
            )}

            {book.lu && (
              <section className='book-details__section'>
                <BookReview book={book} />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BookDetails;
