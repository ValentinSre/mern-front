import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import DisplayCollection from "./DisplayCollection";
import Wishlist from "./Wishlist";
// import UpcomingBooks from './UpcomingBooks';
import Stats from "./Stats";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.grey[900],
    margin: "auto",
  },
  selectedTab: {
    border: `2px solid ${theme.palette.common.white}`,
    color: theme.palette.grey[900],
    fontWeight: 600,
    backgroundColor: theme.palette.common.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    backgroundColor: theme.palette.common.white,
    width: "100%",
  },
}));

const MyLibrary = () => {
  const classes = useStyles();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/:id/collection":
        setSelectedTab(0);
        break;
      case "/:id/wishlist":
        setSelectedTab(1);
        break;
      case "/:id/mes-sorties":
        setSelectedTab(2);
        break;
      case "/:id/stats":
        setSelectedTab(3);
        break;
      default:
        setSelectedTab(0);
        break;
    }
  }, [location]);

  return (
    <div style={{ marginTop: "40px" }}>
      {/* <h1 style={{ padding: "20px", fontFamily: "sans-serif", color: "white" }}>
        Ma bibliothèque
      </h1> */}
      <AppBar position='static' className={classes.appBar}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          className={classes.tabs}
          indicatorColor='#fff'
          centered={!isMobile}
          variant={isMobile ? "scrollable" : "standard"}
        >
          <Tab
            component={Link}
            to='/:id/collection'
            label='Mes BD'
            className={selectedTab === 0 ? classes.selectedTab : ""}
          />
          <Tab
            component={Link}
            to='/:id/wishlist'
            label='Mes souhaits'
            className={selectedTab === 1 ? classes.selectedTab : ""}
          />
          <Tab
            component={Link}
            to='/:id/mes-sorties'
            label='Mes sorties'
            className={selectedTab === 2 ? classes.selectedTab : ""}
          />
          <Tab
            component={Link}
            to='/:id/stats'
            label='Mes statistiques'
            className={selectedTab === 3 ? classes.selectedTab : ""}
          />
        </Tabs>
      </AppBar>
      <div className={classes.content}>
        {selectedTab === 0 && <DisplayCollection />}
        {selectedTab === 1 && <Wishlist />}
        {selectedTab === 2 && <p>Mes sorties</p>}
        {selectedTab === 3 && <Stats />}
      </div>
    </div>
  );
};

export default MyLibrary;