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
import BookList from "./book/pages/BookList";
import Home from "./Home";
import MyLibrary from "./collection/pages/MyLibrary";
import SearchBooks from "./book/pages/SearchBooks";

const NewBook = React.lazy(() => import("./book/pages/NewBook"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const Book = React.lazy(() => import("./book/pages/Book"));

const App = () => {
  const { userId, isAdmin, token, login, logout } = useAuth();

  let routes;

  // Not logged in
  if (!token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/books" exact>
          <BookList />
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
        <Route path="/:userId/collection" exact>
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
          <BookList />
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
      value={{ isLoggedIn: !!token, token, isAdmin, userId, login, logout }}
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
