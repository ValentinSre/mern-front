import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { AuthContext } from "../../shared/context/auth-context";
import DisplayCollection from "./DisplayCollection";
import DisplayWishlist from "./DisplayWishlist";
import DisplayReleases from "./DisplayFutureWishlist";
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
  const auth = useContext(AuthContext);
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
      case `/${auth.userId}/collection`:
        setSelectedTab(0);
        break;
      case `/${auth.userId}/wishlist`:
        setSelectedTab(1);
        break;
      case `/${auth.userId}/releases`:
        setSelectedTab(2);
        break;
      case `/${auth.userId}/stats`:
        setSelectedTab(3);
        break;
      default:
        setSelectedTab(0);
        break;
    }
  }, [location, auth.userId]);

  return (
    <div style={{ marginTop: "40px" }}>
      {/* <h1 style={{ padding: "20px", fontFamily: "sans-serif", color: "white" }}>
        Ma bibliothèque
      </h1> */}
      <AppBar position="static" className={classes.appBar}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          className={classes.tabs}
          indicatorColor="#fff"
          centered={!isMobile}
          variant={isMobile ? "scrollable" : "standard"}
        >
          <Tab
            component={Link}
            to={`/${auth.userId}/collection`}
            label="Mes BD"
            className={selectedTab === 0 ? classes.selectedTab : ""}
          />
          <Tab
            component={Link}
            to={`/${auth.userId}/wishlist`}
            label="Mes souhaits"
            className={selectedTab === 1 ? classes.selectedTab : ""}
          />
          <Tab
            component={Link}
            to={`/${auth.userId}/releases`}
            label="Mes sorties"
            className={selectedTab === 2 ? classes.selectedTab : ""}
          />
          <Tab
            component={Link}
            to={`/${auth.userId}/stats`}
            label="Mes statistiques"
            className={selectedTab === 3 ? classes.selectedTab : ""}
          />
        </Tabs>
      </AppBar>
      <div className={classes.content}>
        {selectedTab === 0 && <DisplayCollection />}
        {selectedTab === 1 && <DisplayWishlist />}
        {selectedTab === 2 && <DisplayReleases />}
        {selectedTab === 3 && <Stats />}
      </div>
    </div>
  );
};

export default MyLibrary;
