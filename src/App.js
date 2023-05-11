import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import NavBar from "./shared/components/Navigation/NavBar";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import BookLibrary from "./book/pages/BookLibrary";
import Home from "./Home";
import MyLibrary from "./collection/pages/MyLibrary";
import SearchBooks from "./book/pages/SearchBooks";
import BooksLists from "./book/pages/BooksLists";

const NewBook = React.lazy(() => import("./book/pages/NewBook"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const Book = React.lazy(() => import("./book/pages/Book"));

const App = () => {
  const { userId, isAdmin, token, name, login, logout } = useAuth();

  let routes;

  // Not logged in
  if (!token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/books" exact>
          <BookLibrary />
        </Route>
        <Route path="/book/:id" exact>
          <Book />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Route path="/search" exact>
          <SearchBooks />
        </Route>
        <Route path="/lists" exact>
          <BooksLists />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    // Logged in
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/search" exact>
          <SearchBooks />
        </Route>
        <Route path="/lists" exact>
          <BooksLists />
        </Route>
        <Route path="/:userId/collection" exact>
          <MyLibrary />
        </Route>
        <Route path="/:userId/readlist" exact>
          <MyLibrary />
        </Route>
        <Route path="/:userId/wishlist" exact>
          <MyLibrary />
        </Route>
        <Route path="/:userId/releases" exact>
          <MyLibrary />
        </Route>
        <Route path="/:userId/stats" exact>
          <MyLibrary />
        </Route>
        <Route path="/books" exact>
          <BookLibrary />
        </Route>
        {isAdmin && (
          <Route path="/book/new" exact>
            <NewBook />
          </Route>
        )}
        <Route path="/book/:id" exact>
          <Book />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        isAdmin,
        userId,
        name,
        login,
        logout,
      }}
    >
      <Router>
        <NavBar />

        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
