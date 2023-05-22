import React, { useState, useContext, useEffect } from "react";
import queryString from "query-string";
import { useHistory } from "react-router-dom";
import { Divider } from "@material-ui/core";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LineList from "../components/LineList";
import MosaicList from "../components/MosaicList";
import variables from "../../shared/util/variables";

import "./BooksLists.css";

const { listNames } = variables;

const BooksLists = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { sendRequest, isLoading } = useHttpClient();
  const [lists, setLists] = useState({
    pokemonBooks: [],
    valiantBooks: [],
    starWarsBooks: [],
    asterixBooks: [],
    hiComicsBooks: [],
    qcqBooks: [],
  });
  const queryParams = queryString.parse(window.location.search);
  const [selectedListParam, setSelectedListParam] = useState(
    queryParams.name || null
  );

  const [selectedList, setSelectedList] = useState();

  if (selectedListParam && !lists) {
    history.push("/lists");
    window.location.reload();
  }

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/book/lists?user=${auth.userId}`
        );

        setLists(responseData);
      } catch (err) {}
    };
    fetchLists();
  }, [sendRequest, auth.userId]);

  const handleDetails = (list) => {
    if (list === "all") {
      setSelectedListParam(null);
      setSelectedList(null);

      history.replace({
        pathname: "/lists",
      });
      return;
    }

    history.replace({
      pathname: "/lists",
      search: `?name=${list}`,
    });

    setSelectedListParam(list);
    const listsMap = {
      valiant: lists.valiantBooks,
      pokemon: lists.pokemonBooks,
      starwars: lists.starWarsBooks,
      asterix: lists.asterixBooks,
      hicomics: lists.hiComicsBooks,
      "404comics": lists.qcqBooks,
    };
    setSelectedList(listsMap[list] || null);
  };

  return (
    <React.Fragment>
      {!selectedListParam && (
        <div className="books-lists">
          <LineList
            listName="Univers Valiant"
            booksList={lists.valiantBooks}
            handleDetails={handleDetails}
            userLogged={auth.isLoggedIn}
            queryParam="valiant"
            loading={isLoading}
          />
          <Divider />
          <LineList
            listName="Star Wars"
            booksList={lists.starWarsBooks}
            handleDetails={handleDetails}
            userLogged={auth.isLoggedIn}
            queryParam="starwars"
            loading={isLoading}
          />
          <Divider />
          <LineList
            listName="Astérix"
            booksList={lists.asterixBooks}
            handleDetails={handleDetails}
            userLogged={auth.isLoggedIn}
            queryParam="asterix"
            loading={isLoading}
          />
          <Divider />
          <LineList
            listName="HiComics"
            booksList={lists.hiComicsBooks}
            handleDetails={handleDetails}
            userLogged={auth.isLoggedIn}
            queryParam="hicomics"
            loading={isLoading}
          />
          <Divider />
          <LineList
            listName="Pokémon"
            booksList={lists.pokemonBooks}
            handleDetails={handleDetails}
            userLogged={auth.isLoggedIn}
            queryParam="pokemon"
            loading={isLoading}
          />
          <Divider />
          <LineList
            listName="404 Comics"
            booksList={lists.qcqBooks}
            handleDetails={handleDetails}
            userLogged={auth.isLoggedIn}
            queryParam="404comics"
            loading={isLoading}
          />
        </div>
      )}
      {selectedListParam && (
        <div className="books-lists">
          <MosaicList
            listName={listNames[selectedListParam]}
            booksList={selectedList}
            handleDetails={handleDetails}
            userLogged={auth.isLoggedIn}
            queryParam={"all"}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default BooksLists;
