import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Tabs, Tab, Typography, Tooltip, Badge, Box } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import makeTitle from "../../shared/util/makeTitle";
import BookCalendar from "../../book/components/BookCalendar";

import "./Wishlist.css";

const months = {
  1: "janvier",
  2: "février",
  3: "mars",
  4: "avril",
  5: "mai",
  6: "juin",
  7: "juillet",
  8: "août",
  9: "septembre",
  10: "octobre",
  11: "novembre",
  12: "décembre",
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const Wishlist = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [availableWishlist, setAvailableWishlist] = useState([]);
  const [incomingWishlist, setIncomingWishlist] = useState([]);
  const [editeurs, setEditeurs] = useState([]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchWishlists = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/collection/wishlist/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setAvailableWishlist(responseData.available);
      setIncomingWishlist(responseData.incoming);
      setEditeurs(responseData.editeurs);
    } catch (err) {}
  };

  useEffect(() => {
    fetchWishlists();
  }, [sendRequest, auth.userId]);

  // group the books by editeur in an object where the key is the editeur
  const groupCollection = (collection, group) => {
    const groupedCollection = collection.reduce((acc, book) => {
      const key = book[group];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(book);
      return acc;
    }, {});
    return groupedCollection;
  };

  const groupedIncomingBooks = groupCollection(
    incomingWishlist,
    "date_parution"
  );
  const incomingGroupNames = Object.keys(groupedIncomingBooks);

  const categoryName = (name, groupCol) => {
    if (groupCol === "editeur") return name;
    const date = new Date(name);
    return `${date.getDate()}${date.getDate() === 1 ? "er" : ""} ${
      months[date.getMonth() + 1]
    }`;
  };

  const displayTab = (collection, groupCol) => {
    const groupedBooks = groupCollection(collection, groupCol);
    const groupNames = Object.keys(groupedBooks);

    if (groupCol === "editeur") {
      groupNames.sort();
    } else {
      groupNames.sort((a, b) => {
        return new Date(a) - new Date(b);
      });
    }

    return (
      <div className='collection-display'>
        {groupNames.map((key) => (
          <div className='book-category' key={key}>
            <div className='book-category-header'>
              {categoryName(key, groupCol)}
            </div>
            <div className='book-list'>
              {groupedBooks[key].map(
                (book) =>
                  book[groupCol] === key && (
                    <Tooltip title={makeTitle(book)}>
                      <div
                        className='book-item'
                        onClick={() => history.push(`/book/${book.id_book}`)}
                      >
                        <Badge
                          badgeContent={book.prix}
                          color='primary'
                          size='large'
                        >
                          <img
                            src={book.image}
                            alt={book.titre}
                            className='book-cover'
                          />
                        </Badge>
                      </div>
                    </Tooltip>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && availableWishlist && incomingWishlist && (
        <div className='wishlist'>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label='basic tabs example'
                indicatorColor='primary'
              >
                <Tab label='Livres déjà disponibles' {...a11yProps(0)} />
                <Tab label='Livres à venir' {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              {displayTab(availableWishlist, "editeur")}
            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              disabled={!incomingWishlist.length}
            >
              {displayTab(incomingWishlist, "date_parution")}
            </TabPanel>
          </Box>
        </div>
      )}
    </React.Fragment>
  );
};

export default Wishlist;
