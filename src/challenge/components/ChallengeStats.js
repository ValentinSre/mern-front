import React from "react";

import "./NextContent.css";

const ChallengeStats = ({ productions }) => {
  const stats = { totalWatchtime: 0, effectiveWatchtime: 0 };

  function calculatePercentageDaysPassed() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const daysPassed = Math.ceil(
      (currentDate - firstDayOfYear) / (1000 * 60 * 60 * 24)
    );
    const totalDaysInYear = Math.ceil(
      (new Date(currentYear + 1, 0, 1) - firstDayOfYear) / (1000 * 60 * 60 * 24)
    );
    return (daysPassed / totalDaysInYear) * 100;
  }

  const percentageOfTheYear = calculatePercentageDaysPassed();

  productions.forEach((production) => {
    stats.totalWatchtime += production.length;
    if (production.watch_dates.length)
      stats.effectiveWatchtime += production.length;
  });
  return (
    <div className='card'>
      Tu as regardé {stats.effectiveWatchtime} min. <br />
      Il y a au total {stats.totalWatchtime} min. à regarder <br />
      <br />
      Tu as donc regardé{" "}
      {((stats.effectiveWatchtime / stats.totalWatchtime) * 100).toFixed(2)} % !
      <br />
      Nous en sommes à {percentageOfTheYear.toFixed(2)}% de l'année !
    </div>
  );
};

export default ChallengeStats;
