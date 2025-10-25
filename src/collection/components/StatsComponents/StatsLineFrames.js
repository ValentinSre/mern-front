import React from "react";
import { TbPigMoney, TbBookOff } from "react-icons/tb";
import { BsFillCartPlusFill, BsFillEyeFill, BsBookmarks } from "react-icons/bs";
import { GiReceiveMoney, GiWeight } from "react-icons/gi";
import { MdSpeakerNotes } from "react-icons/md";
import { ImBooks } from "react-icons/im";

import EvolutionFrame from "./EvolutionFrame";

const StatsLineFrames = ({ calculateStats, readBooksByMonthArray }) => {
  const stats = calculateStats();

  const totalPossede = stats.totalPossede ?? 0;
  const originalPossede = stats.originalPossede ?? 0;
  const totalPrixPossede = stats.totalPrixPossede ?? 0;
  const originalPrixPossede = stats.originalPrixPossede ?? 0;
  const totalPoidsPossede = stats.totalPoidsPossede ?? 0;
  const totalSouhaite = stats.totalSouhaite ?? 0;
  const totalPrixSouhaite = stats.totalPrixSouhaite ?? 0;
  const totalLu = stats.totalLu ?? 0;
  const totalCritique = stats.totalCritique ?? 0;
  const totalPagesPossede = stats.totalPagesPossede ?? 0;

  const differencePossede = originalPossede
    ? (((totalPossede - originalPossede) / originalPossede) * 100).toFixed(2)
    : "0";

  const differencePrix = originalPrixPossede
    ? (
        ((totalPrixPossede - originalPrixPossede) / originalPrixPossede) *
        100
      ).toFixed(2)
    : "0";

  const differenceLu =
    readBooksByMonthArray.length > 1 &&
    (readBooksByMonthArray[readBooksByMonthArray.length - 2].livres ?? 0) > 0
      ? (
          ((readBooksByMonthArray[readBooksByMonthArray.length - 1].livres ??
            0) /
            (readBooksByMonthArray[readBooksByMonthArray.length - 2].livres ??
              1) -
            1) *
          100
        ).toFixed(2)
      : "0";

  const positiveLu =
    readBooksByMonthArray.length > 1 &&
    (readBooksByMonthArray[readBooksByMonthArray.length - 1].livres ?? 0) -
      (readBooksByMonthArray[readBooksByMonthArray.length - 2].livres ?? 0) >
      0;

  const percentageCritique =
    totalPossede > 0 ? ((totalCritique / totalPossede) * 100).toFixed(2) : "0";

  return (
    <div className='collection-stats'>
      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres possédés"}
          value={totalPossede}
          positive
          difference={differencePossede}
          icon={<ImBooks />}
          comparisonPhrase={`depuis le 01/09/22 (${originalPossede})`}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Prix des livres possédés"}
          value={totalPrixPossede.toFixed(2) + " €"}
          positive
          difference={differencePrix}
          icon={<GiReceiveMoney />}
          comparisonPhrase={`depuis le 01/09/22 (${originalPrixPossede.toFixed(
            2
          )}€)`}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres à lire"}
          value={totalPossede - totalLu}
          icon={<TbBookOff />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres souhaités"}
          value={totalSouhaite}
          icon={<BsFillCartPlusFill />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Prix des livres souhaités"}
          value={totalPrixSouhaite.toFixed(2) + " €"}
          icon={<TbPigMoney />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres lus"}
          value={totalLu}
          positive={positiveLu}
          difference={differenceLu}
          comparisonPhrase={"par rapport au mois dernier"}
          icon={<BsFillEyeFill />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres critiqués"}
          value={totalCritique}
          percentage={percentageCritique}
          icon={<MdSpeakerNotes />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de pages cumulées"}
          value={totalPagesPossede}
          icon={<BsBookmarks />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Poids total des livres"}
          value={(totalPoidsPossede / 1000).toFixed(2) + " kg"}
          icon={<GiWeight />}
        />
      </div>
    </div>
  );
};

export default StatsLineFrames;
