import React from "react";
import { FaSearch, FaSlidersH, FaUndo } from "react-icons/fa";

const WishlistFilters = ({
  search,
  onSearchChange,
  priceBounds,
  priceRange,
  onPriceRangeChange,
  availability,
  onAvailabilityChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortChange,
  resultCount,
  totalCount,
  hasActiveFilters,
  onReset,
}) => {
  const min = priceBounds.min;
  const max = priceBounds.max;
  const range = max - min || 1;

  const minPercent = ((priceRange[0] - min) / range) * 100;
  const maxPercent = ((priceRange[1] - min) / range) * 100;

  const handleMinChange = (value) => {
    const nextMin = Math.min(Number(value), priceRange[1] - 1);
    onPriceRangeChange([Math.max(min, nextMin), priceRange[1]]);
  };

  const handleMaxChange = (value) => {
    const nextMax = Math.max(Number(value), priceRange[0] + 1);
    onPriceRangeChange([priceRange[0], Math.min(max, nextMax)]);
  };

  return (
    <section className='wishlist-filters'>
      <div className='wishlist-filters__top'>
        <div className='wishlist-filters__title'>
          <FaSlidersH />
          <h2>Filtrer et organiser</h2>
        </div>

        {hasActiveFilters && (
          <button
            type='button'
            className='wishlist-filters__reset'
            onClick={onReset}
          >
            <FaUndo />
            Tout réinitialiser
          </button>
        )}
      </div>

      <div className='wishlist-filters__main'>
        <div className='wishlist-filter wishlist-filter--search'>
          <label htmlFor='wishlist-search'>Recherche</label>
          <div className='wishlist-filter__search'>
            <FaSearch />
            <input
              id='wishlist-search'
              type='search'
              placeholder='Titre ou série...'
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>

        <div className='wishlist-filter wishlist-filter--price'>
          <div className='wishlist-filter__label-row'>
            <label>Budget</label>
            <span>
              {priceRange[0]} € – {priceRange[1]} €
            </span>
          </div>

          <div className='wishlist-price-slider'>
            <div className='wishlist-price-slider__track'>
              <div
                className='wishlist-price-slider__selected'
                style={{
                  left: `${minPercent}%`,
                  width: `${Math.max(0, maxPercent - minPercent)}%`,
                }}
              />
            </div>

            <input
              className='wishlist-price-slider__input wishlist-price-slider__input--min'
              type='range'
              min={min}
              max={max}
              step='1'
              value={priceRange[0]}
              onChange={(event) => handleMinChange(event.target.value)}
              aria-label='Prix minimum'
            />

            <input
              className='wishlist-price-slider__input wishlist-price-slider__input--max'
              type='range'
              min={min}
              max={max}
              step='1'
              value={priceRange[1]}
              onChange={(event) => handleMaxChange(event.target.value)}
              aria-label='Prix maximum'
            />
          </div>

          <div className='wishlist-filter__price-inputs'>
            <label>
              <span>Min.</span>
              <input
                type='number'
                min={min}
                max={priceRange[1] - 1}
                value={priceRange[0]}
                onChange={(event) => handleMinChange(event.target.value)}
              />
              <span>€</span>
            </label>

            <label>
              <span>Max.</span>
              <input
                type='number'
                min={priceRange[0] + 1}
                max={max}
                value={priceRange[1]}
                onChange={(event) => handleMaxChange(event.target.value)}
              />
              <span>€</span>
            </label>
          </div>
        </div>

        <div className='wishlist-filter wishlist-filter--availability'>
          <label>Disponibilité</label>

          <div className='wishlist-filter__segments'>
            <button
              type='button'
              className={availability === "all" ? "active" : ""}
              onClick={() => onAvailabilityChange("all")}
            >
              Tous
            </button>

            <button
              type='button'
              className={availability === "released" ? "active" : ""}
              onClick={() => onAvailabilityChange("released")}
            >
              Déjà parus
            </button>

            <button
              type='button'
              className={availability === "upcoming" ? "active" : ""}
              onClick={() => onAvailabilityChange("upcoming")}
            >
              À paraître
            </button>

            <button
              type='button'
              className={availability === "period" ? "active" : ""}
              onClick={() => onAvailabilityChange("period")}
            >
              Période
            </button>
          </div>

          {availability === "period" && (
            <div className='wishlist-filter__date-range'>
              <label>
                <span>Du</span>
                <input
                  type='date'
                  value={dateRange.start}
                  max={dateRange.end || undefined}
                  onChange={(event) =>
                    onDateRangeChange({
                      ...dateRange,
                      start: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                <span>Au</span>
                <input
                  type='date'
                  value={dateRange.end}
                  min={dateRange.start || undefined}
                  onChange={(event) =>
                    onDateRangeChange({
                      ...dateRange,
                      end: event.target.value,
                    })
                  }
                />
              </label>
            </div>
          )}
        </div>

        <div className='wishlist-filter wishlist-filter--sort'>
          <label htmlFor='wishlist-sort'>Trier par</label>
          <select
            id='wishlist-sort'
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value='alpha'>Titre (A à Z)</option>
            <option value='price-asc'>Prix croissant</option>
            <option value='price-desc'>Prix décroissant</option>
            <option value='date-asc'>Date de parution (plus proche)</option>
            <option value='date-desc'>Date de parution (plus éloignée)</option>
          </select>
        </div>
      </div>

      <div className='wishlist-filters__footer'>
        <span>
          <strong>{resultCount}</strong> résultat{resultCount > 1 ? "s" : ""}
          {resultCount !== totalCount && ` sur ${totalCount}`}
        </span>
      </div>
    </section>
  );
};

export default WishlistFilters;
