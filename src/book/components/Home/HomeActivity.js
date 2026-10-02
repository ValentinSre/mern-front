import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import makeTitle from "../../../shared/util/makeTitle";

import "./HomeActivity.css";

const FILTERS = {
  all: "Tous",
  readings: "Mes lectures",
  purchases: "Mes achats",
};

const HomeActivity = ({ activities }) => {
  const history = useHistory();
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedGroups, setExpandedGroups] = useState({});

  const filteredActivities = useMemo(() => {
    if (activeFilter === "purchases") {
      return activities.filter((activity) => activity.type === "purchase");
    }

    if (activeFilter === "readings") {
      return activities.filter((activity) => activity.type === "reading");
    }

    return activities;
  }, [activities, activeFilter]);

  const groupedActivities = useMemo(() => {
    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const weekStart = new Date(todayStart);
    const dayOfWeek = weekStart.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(weekStart.getDate() - daysSinceMonday);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const groups = {
      today: [],
      week: [],
      month: [],
    };

    filteredActivities.forEach((activity) => {
      const date = new Date(activity.date);

      if (date >= todayStart) {
        groups.today.push(activity);
      } else if (date >= weekStart) {
        groups.week.push(activity);
      } else if (date >= monthStart) {
        groups.month.push(activity);
      }
    });

    Object.values(groups).forEach((group) => {
      group.sort((a, b) =>
        makeTitle(a.book).localeCompare(makeTitle(b.book), "fr", {
          sensitivity: "base",
        }),
      );
    });

    return groups;
  }, [filteredActivities]);

  const totalVisibleActivities =
    groupedActivities.today.length +
    groupedActivities.week.length +
    groupedActivities.month.length;

  if (!activities || activities.length === 0) {
    return null;
  }

  const openBook = (book) => {
    history.push(`/book/${book.id}`);
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups((current) => ({
      ...current,
      [groupKey]: !current[groupKey],
    }));
  };

  const renderGroup = (groupKey, title, items) => {
    if (items.length === 0) {
      return null;
    }

    const isExpanded = Boolean(expandedGroups[groupKey]);
    const visibleItems = isExpanded ? items : items.slice(0, 3);
    const remainingCount = items.length - visibleItems.length;

    return (
      <div className='activity-group'>
        <h3 className='activity-group-title'>{title}</h3>

        <div className='activity-list'>
          {visibleItems.map((activity) => (
            <div
              key={activity.id}
              className='activity-item'
              onClick={() => openBook(activity.book)}
            >
              <img
                src={activity.book.image}
                alt={makeTitle(activity.book)}
                className='activity-image'
              />

              <div className='activity-content'>
                <p className='activity-title'>{makeTitle(activity.book)}</p>

                <p className='activity-action'>
                  {activity.type === "purchase"
                    ? "Ajouté à votre collection"
                    : "Lu"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {items.length > 3 && (
          <button
            type='button'
            className='activity-more-btn'
            onClick={() => toggleGroup(groupKey)}
          >
            {isExpanded
              ? "Réduire"
              : `Voir les ${remainingCount} autres livres`}
          </button>
        )}
      </div>
    );
  };

  return (
    <section className='home-activity-container'>
      <div className='activity-header'>
        <div>
          <span className='section-kicker'>Mon activité</span>

          <p className='activity-summary'>
            {groupedActivities.today.length > 0
              ? `Vous avez ${groupedActivities.today.length} activité${
                  groupedActivities.today.length > 1 ? "s" : ""
                } aujourd'hui.`
              : "Votre activité récente apparaît ici."}
          </p>
        </div>

        <div className='activity-filters'>
          {Object.entries(FILTERS).map(([key, label]) => (
            <button
              key={key}
              type='button'
              className={`activity-filter ${
                activeFilter === key ? "active" : ""
              }`}
              onClick={() => {
                setActiveFilter(key);
                setExpandedGroups({});
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {totalVisibleActivities > 0 ? (
        <div className='activity-groups'>
          {renderGroup("today", "Aujourd’hui", groupedActivities.today)}

          {renderGroup("week", "Cette semaine", groupedActivities.week)}

          {renderGroup("month", "Ce mois-ci", groupedActivities.month)}
        </div>
      ) : (
        <p className='activity-empty'>Aucune activité pour cette période.</p>
      )}
    </section>
  );
};

HomeActivity.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["purchase", "reading"]).isRequired,
      date: PropTypes.string.isRequired,
      book: PropTypes.shape({
        id: PropTypes.string.isRequired,
        titre: PropTypes.string.isRequired,
        serie: PropTypes.string,
        tome: PropTypes.number,
        version: PropTypes.string,
        image: PropTypes.string.isRequired,
        type: PropTypes.string,
      }).isRequired,
    }),
  ).isRequired,
};

export default HomeActivity;
