import React from "react";
import { useLocation } from "react-router-dom";

import GlobalHeader from "./GlobalHeader";
import BottomNavbar from "./BottomNavbar";

import "./AppLayout.css";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return children;
  }

  return (
    <>
      <GlobalHeader />
      <main className='app-layout-content'>{children}</main>
      <BottomNavbar />
    </>
  );
};

export default AppLayout;
