import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

// import Auth from "./user/pages/Auth";
// import Users from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import NavBar from "./shared/components/Navigation/NavBar";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import BookList from "./book/pages/BookList";
import Home from "./Home";
import MyLibrary from "./MyLibrary";
import Stats from "./collection/pages/Stats";
import Wishlist from "./collection/pages/Wishlist";

const Users = React.lazy(() => import("./user/pages/Users"));
const Collection = React.lazy(() => import("./collection/pages/Collection"));
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
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/:id/ma-collection'>
          <MyLibrary />
        </Route>
        <Route path='/:id/ma-wishlist'>
          <MyLibrary />
        </Route>
        <Route path='/:id/mes-sorties'>
          <MyLibrary />
        </Route>
        <Route path='/:id/mes-stats'>
          <MyLibrary />
        </Route>
        <Route path='/books' exact>
          <BookList />
        </Route>
        <Route path='/book/:id' exact>
          <Book />
        </Route>
        <Route path='/auth' exact>
          <Auth />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    // Logged in
    routes = (
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/:userId/collection' exact>
          <MyLibrary />
        </Route>
        <Route path='/:userId/wishlist' exact>
          <MyLibrary />
        </Route>
        <Route path='/:userId/stats' exact>
          <MyLibrary />
        </Route>
        <Route path='/books' exact>
          <BookList />
        </Route>
        {isAdmin && (
          <Route path='/book/new' exact>
            <NewBook />
          </Route>
        )}
        <Route path='/book/:id' exact>
          <Book />
        </Route>
        <Redirect to='/' />
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
              <div className='center'>
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
