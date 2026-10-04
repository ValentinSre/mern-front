import React from "react";
import { useLocation } from "react-router-dom";

import GlobalHeader from "./GlobalHeader";
import BottomNavbar from "./BottomNavbar";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return children;
  }

  return (
    <>
      <GlobalHeader />
      {children}
      <BottomNavbar />
    </>
  );
};

export default AppLayout;
