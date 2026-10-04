import React, { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";

import WeeklyReleases from "./WeeklyReleases";
import HomePurchases from "./HomePurchases";
import HomeActivity from "./HomeActivity";
import HomeSuggestions from "./HomeSuggestions";
import HomeReadlist from "./HomeReadlist";
import HomeLists from "./HomeLists";

import "./HomeLoaded.css";

const HomeLoaded = () => {
  const auth = useContext(AuthContext);

  return (
    <div className='home-loaded'>
      <div className='home-section'>
        <WeeklyReleases />
      </div>

      {auth.isLoggedIn && (
        <>
          <div className='home-section'>
            <HomeActivity />
          </div>

          <div className='home-section'>
            <HomeReadlist />
          </div>

          <div className='home-section'>
            <HomeLists />
          </div>

          <div className='home-section'>
            <HomeSuggestions />
          </div>

          <div className='home-section'>
            <HomePurchases />
          </div>
        </>
      )}
    </div>
  );
};

export default HomeLoaded;
