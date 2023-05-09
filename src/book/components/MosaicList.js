import React from "react";
import { useHistory } from "react-router-dom";

import { Tooltip, Badge, Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import makeTitle from "../../shared/util/makeTitle";
import { BsArrowLeft } from "react-icons/bs";
import { ImBooks } from "react-icons/im";
import { TbPigMoney } from "react-icons/tb";

const CustomBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#06b87f",
    color: "#fff",
  },
}))(Badge);

const PercentageBadges = ({
  totalBooks,
  totalPrice,
  totalOwned,
  percentageOwned,
  totalOwnedPrice,
  percentageOwnedPrice,
}) => {
  return (
    <React.Fragment>
      <div className="books-list__stats">
        <Chip
          icon={<ImBooks color="white" />}
          label={`${totalOwned} sur ${totalBooks} livres (${percentageOwned}%)`}
          style={{
            backgroundColor:
              percentageOwned > 50
                ? "#06b87f"
                : percentageOwned < 20
                ? "#cb1515"
                : "#fd6608",
            color: "white",
            fontWeight: "bold",
            fontSize: "12px",
            marginLeft: "5px",
          }}
          variant="outlined"
        />
        <Chip
          icon={<TbPigMoney color="white" />}
          label={`${totalOwnedPrice}€ sur ${totalPrice}€ (${percentageOwnedPrice}%)`}
          style={{
            backgroundColor:
              percentageOwnedPrice > 50
                ? "#06b87f"
                : percentageOwnedPrice < 20
                ? "#cb1515"
                : "#fd6608",
            color: "white",
            fontWeight: "bold",
            marginLeft: "5px",
            fontSize: "12px",
          }}
          variant="outlined"
        />
      </div>
      <div className="books-list__stats-mobile">
        <Chip
          icon={<ImBooks color="white" />}
          label={`${totalOwned}/${totalBooks} (${percentageOwned}%)`}
          style={{
            backgroundColor:
              percentageOwned > 50
                ? "#06b87f"
                : percentageOwned < 20
                ? "#cb1515"
                : "#fd6608",
            color: "white",
            fontWeight: "bold",
            fontSize: "12px",
            marginLeft: "5px",
          }}
          variant="outlined"
        />
        <Chip
          icon={<TbPigMoney color="white" />}
          label={`${totalOwnedPrice}€/${totalPrice}€ (${percentageOwnedPrice}%)`}
          style={{
            backgroundColor:
              percentageOwnedPrice > 50
                ? "#06b87f"
                : percentageOwnedPrice < 20
                ? "#cb1515"
                : "#fd6608",
            color: "white",
            fontWeight: "bold",
            marginLeft: "5px",
            fontSize: "12px",
          }}
          variant="outlined"
        />
      </div>
    </React.Fragment>
  );
};

const MosaicList = ({
  listName,
  booksList,
  handleDetails,
  userLogged,
  queryParam,
}) => {
  const history = useHistory();

  let totalPrice = 0;
  let totalOwnedPrice = 0;
  let totalOwned = 0;
  const totalBooks = booksList.length;

  booksList.forEach((book) => {
    totalPrice += book.prix;
    if (book.possede) {
      totalOwnedPrice += book.prix;
      totalOwned++;
    }
  });

  totalPrice = totalPrice.toFixed(2);
  totalOwnedPrice = totalOwnedPrice.toFixed(2);

  const percentageOwned = Math.round((totalOwned / totalBooks) * 100);
  const percentageOwnedPrice = Math.round((totalOwnedPrice / totalPrice) * 100);

  return (
    <React.Fragment>
      <div
        className="books-list__back"
        onClick={() => handleDetails(queryParam)}
      >
        <span>
          <BsArrowLeft size={10} /> Retour aux listes{" "}
        </span>
      </div>
      <div className="books-list__category">
        <h2 style={{ marginRight: 10 }}>{listName} (détails)</h2>
        {userLogged && (
          <PercentageBadges
            percentageOwned={percentageOwned}
            percentageOwnedPrice={percentageOwnedPrice}
            totalBooks={totalBooks}
            totalOwned={totalOwned}
            totalOwnedPrice={totalOwnedPrice}
            totalPrice={totalPrice}
          />
        )}
      </div>

      <div className="books-list__list">
        {booksList.map((book) => (
          <Tooltip
            title={makeTitle(book)}
            key={book._id}
            onClick={() => history.push(`book/${book._id}`)}
          >
            <div
              className={`books-list__list-book${
                book.possede ? " possede" : " non-possede"
              }`}
            >
              <img src={book.image} alt={book.title} />
            </div>
          </Tooltip>
        ))}
      </div>
    </React.Fragment>
  );
};

export default MosaicList;
