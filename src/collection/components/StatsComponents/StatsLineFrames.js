import React from "react";
import { TbPigMoney, TbBookOff } from "react-icons/tb";
import { BsFillCartPlusFill, BsFillEyeFill, BsBookmarks } from "react-icons/bs";
import { GiReceiveMoney, GiWeight } from "react-icons/gi";
import { MdSpeakerNotes } from "react-icons/md";
import { ImBooks } from "react-icons/im";

import EvolutionFrame from "./EvolutionFrame";

const StatsLineFrames = ({ calculateStats, readBooksByMonthArray }) => {
  return (
    <div className='collection-stats'>
      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres possédés"}
          value={calculateStats().totalPossede}
          positive
          difference={(
            ((calculateStats().totalPossede -
              calculateStats().originalPossede) /
              calculateStats().originalPossede) *
            100
          ).toFixed(2)}
          icon={<ImBooks />}
          comparisonPhrase={`depuis le 01/09/22 (${
            calculateStats().originalPossede
          })`}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Prix des livres possédés"}
          value={calculateStats().totalPrixPossede.toFixed(2) + " €"}
          positive
          difference={(
            ((calculateStats().totalPrixPossede -
              calculateStats().originalPrixPossede) /
              calculateStats().originalPrixPossede) *
            100
          ).toFixed(2)}
          icon={<GiReceiveMoney />}
          comparisonPhrase={`depuis le 01/09/22 (${calculateStats().originalPrixPossede.toFixed(
            2
          )}€)`}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres à lire"}
          value={calculateStats().totalPossede - calculateStats().totalLu}
          icon={<TbBookOff />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres souhaités"}
          value={calculateStats().totalSouhaite}
          icon={<BsFillCartPlusFill />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Prix des livres souhaités"}
          value={calculateStats().totalPrixSouhaite.toFixed(2) + " €"}
          icon={<TbPigMoney />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres lus"}
          value={calculateStats().totalLu}
          positive={
            readBooksByMonthArray.length > 2
              ? (readBooksByMonthArray[readBooksByMonthArray.length - 1]
                  .livres /
                  readBooksByMonthArray[readBooksByMonthArray.length - 2]
                    .livres -
                  1) *
                  100 >
                0
              : true
          }
          difference={
            readBooksByMonthArray.length > 2
              ? (
                  (readBooksByMonthArray[readBooksByMonthArray.length - 1]
                    .livres /
                    readBooksByMonthArray[readBooksByMonthArray.length - 2]
                      .livres -
                    1) *
                  100
                ).toFixed(2)
              : null
          }
          comparisonPhrase={"par rapport au mois dernier"}
          icon={<BsFillEyeFill />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de livres critiqués"}
          value={calculateStats().totalCritique}
          percentage={(
            (calculateStats().totalCritique / calculateStats().totalPossede) *
            100
          ).toFixed(2)}
          icon={<MdSpeakerNotes />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Nb. de pages cumulées"}
          value={calculateStats().totalPagesPossede}
          icon={<BsBookmarks />}
        />
      </div>

      <div className='collection-stats__frame'>
        <EvolutionFrame
          title={"Poids total des livres"}
          value={(calculateStats().totalPoidsPossede / 1000).toFixed(2) + " kg"}
          icon={<GiWeight />}
        />
      </div>
    </div>
  );
};

export default StatsLineFrames;
