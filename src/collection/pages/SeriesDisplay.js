import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IconButton, Divider } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Done, Clear } from "@material-ui/icons";

import { MdBookmarkAdded, MdBookmarkBorder } from "react-icons/md";

import Rating from "../../shared/components/UIElements/Rating";

const SeriesList = ({ loadedCollection: series }) => {
  const history = useHistory();
  const [expandedSerie, setExpandedSerie] = useState(null);

  const toggleSerieExpansion = (index) => {
    if (index === expandedSerie) {
      setExpandedSerie(null);
    } else {
      setExpandedSerie(index);
    }
  };

  const updateBookStatus = (serieIndex, bookIndex, status) => {
    console.log("updateBookStatus", serieIndex, bookIndex, status);
  };

  const handleBookClick = (bookId) => {
    history.push(`/book/${bookId}`);
  };

  return (
    <div>
      {series.map((serie, index) => (
        <div
          key={index}
          style={{
            border: "1px solid rgba(0,0,0,0.2)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            paddingLeft: "10px",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0",
              justifyContent: "space-between",
            }}
          >
            {/* div de gauche */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <div style={{ marginRight: "10px" }}>
                <img
                  src={serie.books[0].image}
                  alt={serie.serie}
                  style={{
                    width: "80px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    color: "#333",
                    paddingBottom: "12px",
                  }}
                >
                  {serie.serie}
                </div>
                <div style={{ fontSize: "14px" }}>
                  <Rating
                    rating={
                      serie.books.reduce((accumulator, currentValue) => {
                        if (currentValue.note) {
                          return accumulator + currentValue.note;
                        } else {
                          return accumulator;
                        }
                      }, 0) / serie.books.filter((book) => book.note).length
                    }
                    size={"18px"}
                    real={serie.books.filter((book) => book.note).length > 0}
                  />
                  {}
                </div>
              </div>
            </div>{" "}
            {/* div de droite */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "#ffde59",
                  borderRadius: "10px",
                  marginRight: "20px",
                  padding: "8px",
                }}
              >
                {serie.books[0].editeur}
              </div>
              <Divider orientation='vertical' flexItem />
              <div
                style={{
                  marginRight: "10px",
                  alignItems: "center",
                  textAlign: "center",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    color: "#333",
                  }}
                >
                  {serie.books.filter((book) => book.lu).length}/
                  {serie.books.length}
                </div>
                <div style={{ fontSize: "14px" }}>
                  {serie.books.filter((book) => book.lu).length > 0 ? (
                    <span>
                      {Math.round(
                        (serie.books.filter((book) => book.lu).length /
                          serie.books.length) *
                          100
                      )}
                      % lus
                    </span>
                  ) : (
                    <span>Pas encore lu</span>
                  )}
                </div>
              </div>
              <div style={{ marginLeft: "10px" }}>
                <IconButton
                  onClick={() => toggleSerieExpansion(index)}
                  size='medium'
                >
                  {expandedSerie === index ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </div>
            </div>
          </div>
          {expandedSerie === index && (
            <div>
              {serie.books.map((book, bookIndex) => (
                <div key={bookIndex}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "8px",
                      marginLeft: "15px",
                    }}
                  >
                    <div
                      style={{ marginRight: "10px" }}
                      onClick={() => handleBookClick(book.id_book)}
                    >
                      <img
                        src={book.image}
                        alt={book.titre}
                        style={{
                          width: "80px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                    <div
                      style={{ flex: 1, paddingLeft: "20px" }}
                      onClick={() => handleBookClick(book.id_book)}
                    >
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          fontFamily: "sans-serif",
                          color: "#333",
                        }}
                      >
                        {book.titre}
                      </div>
                      {book.tome && (
                        <div
                          style={{
                            fontSize: "14px",
                            fontFamily: "sans-serif",
                            paddingTop: "8px",
                            paddingBottom: "8px",
                          }}
                        >
                          Tome {book.tome}
                        </div>
                      )}
                      <div style={{ fontSize: "14px" }}>
                        {book.note ? (
                          <Rating
                            rating={book.note}
                            size={"18px"}
                            real={true}
                          />
                        ) : (
                          <span>Pas encore noté</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <IconButton
                        onClick={() =>
                          updateBookStatus(index, bookIndex, !book.lu)
                        }
                        size='medium'
                      >
                        {book.lu ? <MdBookmarkAdded /> : <MdBookmarkBorder />}
                      </IconButton>
                    </div>
                  </div>
                  {bookIndex !== serie.books.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SeriesList;
