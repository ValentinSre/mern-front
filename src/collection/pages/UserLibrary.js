import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import DisplayCollection from "./DisplayCollection";
import DisplayReadlist from "./DisplayReadlist";
import DisplayWishlist from "./DisplayWishlist";
import RealPurchaseManager from "./RealPurchaseManager";
import Stats from "./Stats";

import "./UserLibrary.css";

const UserLibrary = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  const basePath = `/${auth.userId}`;

  const pages = [
    { label: "Mes livres", path: `${basePath}/collection` },
    { label: "Mes lectures", path: `${basePath}/readlist` },
    { label: "Mes souhaits", path: `${basePath}/wishlist` },
    { label: "Mes achats", path: `${basePath}/real-purchase` },
    { label: "Mes statistiques", path: `${basePath}/stats` },
  ];

  const currentPath = location.pathname;
  const activePage = pages.find((page) => page.path === currentPath);

  const renderPage = () => {
    switch (activePage?.path) {
      case `${basePath}/collection`:
        return <DisplayCollection />;

      case `${basePath}/readlist`:
        return <DisplayReadlist />;

      case `${basePath}/wishlist`:
        return <DisplayWishlist />;

      case `${basePath}/real-purchase`:
        return <RealPurchaseManager />;

      case `${basePath}/stats`:
        return <Stats />;

      default:
        return <DisplayCollection />;
    }
  };

  return (
    <div className='user-library'>
      <nav className='user-library__navigation'>
        <div className='user-library__navigation-inner'>
          {pages.map((page) => (
            <NavLink
              key={page.path}
              to={page.path}
              className='user-library__link'
              activeClassName='user-library__link--active'
              exact
            >
              {page.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className='user-library__content'>{renderPage()}</main>
    </div>
  );
};

export default UserLibrary;
