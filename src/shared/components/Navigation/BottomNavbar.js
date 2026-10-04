import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import GlobalSearchBar from "./GlobalSearchBar";

import HomeIcon from "@material-ui/icons/Home";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import SearchIcon from "@material-ui/icons/Search";
import BookIcon from "@material-ui/icons/MenuBook";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import "./BottomNavbar.css";

const BottomNavbar = () => {
  const auth = useContext(AuthContext);

  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [placeholder, setPlaceholder] = useState(
    "Rechercher un album, une série, un auteur...",
  );

  useEffect(() => {
    const updatePlaceholder = () => {
      setPlaceholder(
        window.innerWidth < 600
          ? "Rechercher..."
          : "Rechercher un album, une série, un auteur...",
      );
    };

    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);

    return () => {
      window.removeEventListener("resize", updatePlaceholder);
    };
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const toggleSearchBar = () => {
    setSearchMode((current) => !current);
  };

  return (
    <nav className='bottom-navbar' aria-label='Navigation principale'>
      {!searchMode ? (
        <>
          <NavLink
            to='/'
            exact
            className='bottom-navbar-item'
            activeClassName='active'
          >
            <HomeIcon className='bottom-navbar-icon' />
            <span>Accueil</span>
          </NavLink>

          <NavLink
            to='/books'
            className='bottom-navbar-item'
            activeClassName='active'
          >
            <CollectionsBookmarkIcon className='bottom-navbar-icon' />
            <span>Catalogue</span>
          </NavLink>

          {auth.isAdmin && (
            <NavLink
              to='/book/new'
              className='bottom-navbar-add'
              activeClassName='active'
              aria-label='Ajouter un livre'
              title='Ajouter un livre'
            >
              <AddCircleIcon />
            </NavLink>
          )}

          <button
            type='button'
            className='bottom-navbar-item bottom-navbar-search'
            onClick={toggleSearchBar}
            aria-label='Rechercher'
          >
            <SearchIcon className='bottom-navbar-icon' />
            <span>Recherche</span>
          </button>

          {auth.isLoggedIn && (
            <NavLink
              to={`/${auth.userId}/collection`}
              className='bottom-navbar-item'
              activeClassName='active'
            >
              <BookIcon className='bottom-navbar-icon' />
              <span>Collection</span>
            </NavLink>
          )}
        </>
      ) : (
        <div className='bottom-navbar-search-wrapper'>
          <GlobalSearchBar
            placeHolder={placeholder}
            searchText={searchText}
            handleSearch={handleSearch}
            globalSearch
            toggleSearchBar={toggleSearchBar}
          />
        </div>
      )}
    </nav>
  );
};

export default BottomNavbar;
