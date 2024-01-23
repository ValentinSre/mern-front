import React from "react";

import CustomPieChart from "./stats-components/CustomPieChart";
import CustomCompositeChart from "./stats-components/CustomCompositeChart";

import "./ChallengeStats.css";

const ChallengeStats = ({ productions }) => {
  // Filtrer les éléments vus
  const itemsVus = productions.filter(
    (item) => item.watch_dates && item.watch_dates.length > 0
  );

  // Calculer le pourcentage d'items vus
  const pourcentageItemsVus = (itemsVus.length / productions.length) * 100;

  // Calculer le pourcentage de minutes vues sur le nombre de minutes total
  const minutesVues = itemsVus.reduce((total, item) => total + item.length, 0);
  const minutesTotales = productions.reduce(
    (total, item) => total + item.length,
    0
  );
  const pourcentageMinutesVues = (minutesVues / minutesTotales) * 100;

  // Calculer la durée totale vue
  const dureeTotaleVue = minutesVues;

  // Calculer la progression par semaine
  const semaineProgression = new Array(52).fill(0);
  itemsVus.forEach((item) => {
    const date = new Date(item.watch_dates[0]); // Supposons qu'il y ait une seule date dans watch_dates
    const semaine = Math.ceil(
      (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );
    semaineProgression[semaine - 1] += item.length;
  });

  // Calculer la moyenne de minutes à voir par semaine
  const moyenneMinutesAvoirParSemaine =
    productions.reduce((total, item) => total + item.length, 0) / 52;

  const watchtimeIdealProgression = semaineProgression.map((el, index) => {
    const watchtimeTotalSemaine = semaineProgression
      .slice(0, index)
      .reduce((sum, element) => sum + element, 0);
    const watchtimeRestant = minutesTotales - watchtimeTotalSemaine;
    return parseFloat((watchtimeRestant / (52 - index)).toFixed(2));
  });

  // Calculer la moyenne pour savoir combien de minutes à regarder réellement pour finir l'année
  const semainesRestantes =
    52 - semaineProgression.filter((value) => value > 0).length;
  const minutesRestantesNonVues = productions.reduce(
    (total, item) =>
      total +
      (item.watch_dates && item.watch_dates.length > 0 ? 0 : item.length),
    0
  );
  const moyenneMinutesARegarderRestantes =
    minutesRestantesNonVues / semainesRestantes;

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

  return (
    <div className='container'>
      <div className='card'>
        <h2>Évolution du défi</h2>
        <CustomCompositeChart
          semaineProgression={semaineProgression}
          moyenneMinutesAvoirParSemaine={moyenneMinutesAvoirParSemaine}
          watchtimeIdealProgression={watchtimeIdealProgression}
        />
      </div>

      <div className='card'>
        <h2>Proportion d'oeuvres vues</h2>
        <CustomPieChart
          dataKey={"itemsVus"}
          pourcentage={pourcentageItemsVus}
        />
      </div>

      <div className='card'>
        <h2>Proportion de minutes vues</h2>
        <CustomPieChart
          dataKey={"minutesVues"}
          pourcentage={pourcentageMinutesVues}
        />
      </div>
    </div>
  );
};

export default ChallengeStats;
