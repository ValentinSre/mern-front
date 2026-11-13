import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import { BsBookmarkCheckFill, BsBookmarkX } from "react-icons/bs";
import { MdRateReview, MdChatBubbleOutline } from "react-icons/md";
import { FaStar } from "react-icons/fa";

import makeTitle from "../../../../shared/util/makeTitle";

import "../DisplayByBooks.css";

const getSeriesLabel = (book) => {
  if (!book.serie) return book.titre;

  const seriesName =
    typeof book.serie === "string"
      ? book.serie
      : book.serie.titre || book.serie.nom || "";

  if (!seriesName) return book.titre;

  if (book.tome === undefined || book.tome === null || book.tome === "") {
    return seriesName;
  }

  const tome = String(book.tome).padStart(2, "0");

  return `${seriesName} (T${tome})`;
};

const getPublicationYear = (date) => {
  if (!date) return null;

  const match = String(date).match(/\d{4}/);
  return match ? match[0] : null;
};

const CollectionInMosaic = ({
  collection,
  sort,
  selectedEditeurs,
  sortCollection,
}) => {
  const history = useHistory();

  const renderBookStatus = (book) => (
    <div className='collection-display__book-status'>
      <Tooltip title={book.lu ? "Livre lu" : "Livre non lu"}>
        <span className={book.lu ? "is-active" : "is-inactive"}>
          {book.lu ? <BsBookmarkCheckFill /> : <BsBookmarkX />}
        </span>
      </Tooltip>

      <Tooltip title={book.critique ? "Critique rédigée" : "Pas de critique"}>
        <span className={book.critique ? "is-active" : "is-inactive"}>
          {book.critique ? <MdRateReview /> : <MdChatBubbleOutline />}
        </span>
      </Tooltip>
    </div>
  );

  return (
    <div className='collection-display collection-display--mosaic'>
      <div className='collection-display__books_array'>
        {sortCollection(collection, sort).map(
          (book) =>
            selectedEditeurs[book.editeur] &&
            !book.revendu && (
              <Tooltip title={makeTitle(book)} key={book.id}>
                <article
                  className='mosaic-book'
                  onClick={() => history.push(`/book/${book.id_book}`)}
                >
                  <div className='mosaic-book__cover'>
                    <img src={book.image} alt={book.titre} />

                    {book.type && (
                      <span className='mosaic-book__type'>{book.type}</span>
                    )}
                  </div>

                  <div className='mosaic-book__info'>
                    <div className='mosaic-book__title' title={book.titre}>
                      {book.titre}
                    </div>

                    <div
                      className='mosaic-book__series'
                      title={getSeriesLabel(book)}
                    >
                      {getSeriesLabel(book)}
                    </div>

                    <div className='mosaic-book__details'>
                      {[book.format, getPublicationYear(book.date_parution)]
                        .filter(Boolean)
                        .join(" · ") || "\u00A0"}
                    </div>

                    <div className='mosaic-book__footer'>
                      <div className='mosaic-book__rating'>
                        {typeof book.note === "number" ? (
                          <>
                            <FaStar />
                            <span>{book.note}</span>
                            <span className='mosaic-book__rating-scale'>
                              /5
                            </span>
                          </>
                        ) : (
                          <span>Non noté</span>
                        )}
                      </div>

                      {renderBookStatus(book)}
                    </div>
                  </div>
                </article>
              </Tooltip>
            ),
        )}
      </div>
    </div>
  );
};

export default CollectionInMosaic;
