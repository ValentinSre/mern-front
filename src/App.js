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
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import BookList from "./book/pages/BookList";
import Home from "./Home";
import Stats from "./collection/pages/Stats";
import Wishlist from "./collection/pages/Wishlist";

const Users = React.lazy(() => import("./user/pages/Users"));
const Collection = React.lazy(() => import("./collection/pages/Collection"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const NewBook = React.lazy(() => import("./book/pages/NewBook"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
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
          <Collection />
        </Route>
        <Route path='/:userId/wishlist' exact>
          <Wishlist />
        </Route>
        <Route path='/:userId/stats' exact>
          <Stats />
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
        <MainNavigation />
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
