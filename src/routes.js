import React from "react";

import Home from "./Home";

const NewBook = React.lazy(() => import("./book/pages/NewBook"));
const AuthPage = React.lazy(() => import("./user/pages/AuthPage"));
const Book = React.lazy(() => import("./book/pages/Book"));
const RealPurchaseManager = React.lazy(() =>
  import("./collection/pages/RealPurchaseManager")
);
const BookLibrary = React.lazy(() => import("./book/pages/BookLibrary"));
const UserLibrary = React.lazy(() => import("./collection/pages/UserLibrary"));
const SearchBooks = React.lazy(() => import("./book/pages/SearchBooks"));
const ArtistBooks = React.lazy(() => import("./book/pages/ArtistBooks"));
const Suggestions = React.lazy(() => import("./collection/pages/Suggestions"));

const routeConfigs = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/search",
    component: SearchBooks,
    exact: true,
  },

  {
    path: "/suggestions",
    component: Suggestions,
    exact: true,
  },
  {
    path: "/:userId/real-purchase",
    component: RealPurchaseManager,
    exact: true,
    loggedInOnly: true,
  },
  {
    path: "/:userId/collection",
    component: UserLibrary,
    exact: true,
    loggedInOnly: true,
  },
  {
    path: "/:userId/readlist",
    component: UserLibrary,
    exact: true,
    loggedInOnly: true,
  },
  {
    path: "/:userId/wishlist",
    component: UserLibrary,
    exact: true,
    loggedInOnly: true,
  },
  {
    path: "/:userId/releases",
    component: UserLibrary,
    exact: true,
    loggedInOnly: true,
  },
  {
    path: "/:userId/stats",
    component: UserLibrary,
    exact: true,
    loggedInOnly: true,
  },
  {
    path: "/books",
    component: BookLibrary,
    exact: true,
  },
  {
    path: "/artist/:id",
    component: ArtistBooks,
    exact: true,
  },
  {
    path: "/book/new",
    component: NewBook,
    exact: true,
    loggedInOnly: true,
    adminOnly: true,
  },
  {
    path: "/book/:id",
    component: Book,
    exact: true,
  },
  {
    path: "/auth",
    component: AuthPage,
    exact: true,
    loggedInOnly: false,
  },
];

export default routeConfigs;
