import React from "react";

import Home from "./Home";

const NewBook = React.lazy(() => import("./book/pages/NewBook"));
const AuthPage = React.lazy(() => import("./user/pages/AuthPage"));
const Book = React.lazy(() => import("./book/pages/Book"));
const BookLibrary = React.lazy(() => import("./book/pages/BookLibrary"));
const UserLibrary = React.lazy(() => import("./collection/pages/UserLibrary"));
const SearchBooks = React.lazy(() => import("./book/pages/SearchBooks"));
const BooksLists = React.lazy(() => import("./book/pages/BooksLists"));
const ArtistBooks = React.lazy(() => import("./book/pages/ArtistBooks"));

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
    path: "/lists",
    component: BooksLists,
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
    path: "/book/:id",
    component: Book,
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
    path: "/auth",
    component: AuthPage,
    exact: true,
    loggedInOnly: false,
  },
];

export default routeConfigs;
