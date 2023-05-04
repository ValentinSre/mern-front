import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  isAdmin: false,
  name: null,
  token: null,
  login: () => {},
  logout: () => {},
});
