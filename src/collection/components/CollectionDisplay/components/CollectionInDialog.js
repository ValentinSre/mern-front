import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "../../../../shared/components/UIElements/ThemedRadioButton";
import Tooltip from "@material-ui/core/Tooltip";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Checkbox from "../../../../shared/components/UIElements/ThemedCheckbox";
import { Typography } from "@material-ui/core";

import { BsBookmarkCheckFill, BsBookmarkX } from "react-icons/bs";
import { MdRateReview, MdChatBubbleOutline } from "react-icons/md";
import { FaStar } from "react-icons/fa";

import makeTitle from "../../../../shared/util/makeTitle";

import "./CollectionInDialog.css";

const ITEMS_PER_PAGE = 40;

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

  return `${seriesName} (T${String(book.tome).padStart(2, "0")})`;
};

const getPublicationYear = (date) => {
  if (!date) return null;

  const match = String(date).match(/\d{4}/);
  return match ? match[0] : null;
};

const CollectionInDialog = (props) => {
  const history = useHistory();
  const { title, open, books = [], onClose, filters } = props;

  const [sortOrder, setSortOrder] = useState("default");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [checkedValues, setCheckedValues] = useState({
    BD: true,
    Comics: true,
    Manga: true,
    Roman: true,
  });

  useEffect(() => {
    if (open) {
      setVisibleCount(ITEMS_PER_PAGE);
    }
  }, [open]);

  const filteredBooks = useMemo(
    () =>
      books.filter((book) => {
        if (checkedValues.BD && book.type === "BD") return true;
        if (checkedValues.Comics && book.type === "Comics") return true;
        if (checkedValues.Manga && book.type === "Manga") return true;
        if (checkedValues.Roman && book.type === "Roman") return true;

        return false;
      }),
    [books, checkedValues],
  );

  const sortedBooks = useMemo(() => {
    const result = [...filteredBooks];

    if (filters && sortOrder === "sizeAscending") {
      result.sort(
        (a, b) => (Number(a.planches) || 0) - (Number(b.planches) || 0),
      );
    } else if (filters && sortOrder === "dateAscending") {
      result.sort((a, b) => {
        if (!a.date_achat) return 1;
        if (!b.date_achat) return -1;

        return (
          new Date(a.date_achat).getTime() - new Date(b.date_achat).getTime()
        );
      });
    }

    return result;
  }, [filteredBooks, filters, sortOrder]);

  const handleCheckedChange = (event) => {
    setCheckedValues((previous) => ({
      ...previous,
      [event.target.name]: event.target.checked,
    }));

    setVisibleCount(ITEMS_PER_PAGE);
  };

  const renderBookStatus = (book) => (
    <div className='collection-dialog__status'>
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

  const renderBook = (book) => {
    const year = getPublicationYear(book.date_parution);
    const seriesLabel = getSeriesLabel(book);

    return (
      <Tooltip title={makeTitle(book)} key={book.id || book.id_book}>
        <button
          type='button'
          className='collection-dialog__book'
          onClick={() => history.push(`/book/${book.id_book}`)}
        >
          <div className='collection-dialog__cover'>
            <img
              src={book.image}
              alt={book.titre}
              loading='lazy'
              decoding='async'
            />

            {book.type && (
              <span className='collection-dialog__type'>{book.type}</span>
            )}
          </div>

          <div className='collection-dialog__info'>
            <div className='collection-dialog__title' title={book.titre}>
              {book.titre}
            </div>

            <div className='collection-dialog__series' title={seriesLabel}>
              {seriesLabel}
            </div>

            <div className='collection-dialog__details'>
              {[book.format, year].filter(Boolean).join(" · ") || "\u00A0"}
            </div>

            <div className='collection-dialog__footer'>
              <div className='collection-dialog__rating'>
                {typeof book.note === "number" ? (
                  <>
                    <FaStar />
                    <span>{book.note}</span>
                    <span className='collection-dialog__rating-scale'>/5</span>
                  </>
                ) : (
                  <span>Non noté</span>
                )}
              </div>

              {renderBookStatus(book)}
            </div>
          </div>
        </button>
      </Tooltip>
    );
  };

  const hasMoreBooks = sortedBooks.length > visibleCount;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      className='collection-dialog'
    >
      {open && (
        <>
          <AppBar className='collection-dialog__appbar' position='static'>
            <Toolbar>
              <IconButton
                edge='start'
                color='inherit'
                onClick={onClose}
                aria-label='Fermer'
              >
                <CloseIcon />
              </IconButton>

              <div className='collection-dialog__heading'>
                <Typography
                  className='collection-dialog__heading-title'
                  variant='h6'
                  component='div'
                >
                  {title || "Ma collection"}
                </Typography>

                <span className='collection-dialog__heading-count'>
                  {sortedBooks.length}{" "}
                  {sortedBooks.length > 1 ? "albums" : "album"}
                </span>
              </div>
            </Toolbar>
          </AppBar>

          <div className='collection-dialog__content'>
            {filters && (
              <div className='collection-dialog__filters'>
                <div className='collection-dialog__sort'>
                  <span className='collection-dialog__filter-label'>
                    Trier par
                  </span>

                  <RadioGroup
                    aria-label='Ordre de tri'
                    name='sort-order'
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    className='collection-dialog__radio-group'
                  >
                    <FormControlLabel
                      value='default'
                      control={<Radio />}
                      label='Par défaut'
                    />

                    <FormControlLabel
                      value='sizeAscending'
                      control={<Radio />}
                      label='Taille'
                    />

                    <FormControlLabel
                      value='dateAscending'
                      control={<Radio />}
                      label="Date d'achat"
                    />
                  </RadioGroup>
                </div>

                <div className='collection-dialog__type-filters'>
                  <span className='collection-dialog__filter-label'>Types</span>

                  {[
                    { name: "BD", label: "BD" },
                    { name: "Comics", label: "Comics" },
                    { name: "Manga", label: "Manga" },
                    { name: "Roman", label: "Roman" },
                  ].map((type) => (
                    <FormControlLabel
                      key={type.name}
                      control={
                        <Checkbox
                          checked={checkedValues[type.name]}
                          onChange={handleCheckedChange}
                          name={type.name}
                        />
                      }
                      label={type.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {sortedBooks.length > 0 ? (
              <>
                <div className='collection-dialog__grid'>
                  {sortedBooks
                    .slice(0, visibleCount)
                    .map((book) => renderBook(book))}
                </div>

                {hasMoreBooks && (
                  <button
                    type='button'
                    className='collection-dialog__load-more'
                    onClick={() =>
                      setVisibleCount((count) => count + ITEMS_PER_PAGE)
                    }
                  >
                    Afficher les albums suivants
                    <span>
                      {Math.min(
                        ITEMS_PER_PAGE,
                        sortedBooks.length - visibleCount,
                      )}{" "}
                      albums supplémentaires
                    </span>
                  </button>
                )}
              </>
            ) : (
              <div className='collection-dialog__empty'>
                Aucun album ne correspond à ces filtres.
              </div>
            )}
          </div>
        </>
      )}
    </Dialog>
  );
};

export default CollectionInDialog;
