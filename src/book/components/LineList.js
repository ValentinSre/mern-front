import React from "react";
import { useHistory } from "react-router-dom";

import { Tooltip, Badge, Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import makeTitle from "../../shared/util/makeTitle";
import { Skeleton } from "@material-ui/lab";

const CustomBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#06b87f",
    color: "#fff",
  },
}))(Badge);

const PercentageBadge = ({ percentage }) => {
  return (
    <Chip
      label={`Possédé : ${percentage}%`}
      style={{
        backgroundColor:
          percentage > 50 ? "#06b87f" : percentage < 20 ? "#cb1515" : "#fd6608",
        color: "white",
        fontWeight: "bold",
        fontSize: "11px",
        padding: 0,
      }}
      variant="outlined"
    />
  );
};

const LineList = ({
  listName,
  booksList,
  handleDetails,
  userLogged,
  queryParam,
  loading,
}) => {
  const history = useHistory();

  let percentageOwned = 0;
  booksList.forEach((book) => {
    if (book.possede) {
      percentageOwned++;
    }
  });

  percentageOwned = Math.round((percentageOwned / booksList.length) * 100);

  return (
    <React.Fragment>
      <div
        className="books-lists__category"
        onClick={() => handleDetails(queryParam)}
      >
        <h2 style={{ marginRight: 10 }}>{listName}</h2>
        {loading ? (
          <Skeleton
            variant="text"
            width={50}
            height={25}
            style={{ borderRadius: "5px" }}
          />
        ) : (
          <h3>{booksList.length} livres</h3>
        )}
      </div>
      <div className="books-lists__list">
        {loading && (
          <React.Fragment>
            {Array.from(new Array(15)).map((item, index) => (
              <div
                className="books-lists__list-book"
                key={index}
                style={{ paddingBottom: "10px" }}
              >
                <Skeleton
                  variant="rect"
                  width={100}
                  height={140}
                  style={{ borderRadius: "5px" }}
                />
              </div>
            ))}
          </React.Fragment>
        )}
        {!loading &&
          booksList.map((book) => (
            <Tooltip
              title={makeTitle(book)}
              key={book._id}
              onClick={() => history.push(`book/${book._id}`)}
            >
              <div className="books-lists__list-book">
                <img src={book.image} alt={book.title} />
                {book.possede && (
                  <div className="books-lists__list-badge">
                    <CustomBadge color="default" badgeContent="✓" />
                  </div>
                )}
              </div>
            </Tooltip>
          ))}
      </div>
      <div className="books-lists__footer">
        {userLogged && <PercentageBadge percentage={percentageOwned} />}
      </div>
    </React.Fragment>
  );
};

export default LineList;
