import React from "react";
import { useHistory } from "react-router-dom";
import "./CollectionRedirection.css";

export const CollectionRedirection = ({ userId }) => {
  const history = useHistory();

  const items = [
    { label: "MA COLLECTION", route: `/${userId}/collection`, icon: "📚" },
    { label: "MES LECTURES", route: `/${userId}/readlist`, icon: "📖" },
    { label: "MES LISTES", route: `/lists`, icon: "📝" },
    { label: "MES ACHATS", route: `/${userId}/real-purchase`, icon: "💰" },
    { label: "MA LISTE D'ACHAT", route: `/${userId}/wishlist`, icon: "🎁" },
    { label: "MES SORTIES", route: `/${userId}/releases`, icon: "🗓️" },
    { label: "MES STATISTIQUES", route: `/${userId}/stats`, icon: "📊" },
  ];

  return (
    <div className='collection-slider'>
      {items.map((item, index) => (
        <div
          key={index}
          className='collection-item'
          onClick={() => history.push(item.route)}
        >
          <div className='collection-icon'>{item.icon}</div>
          <div className='collection-label'>{item.label}</div>
        </div>
      ))}
    </div>
  );
};
