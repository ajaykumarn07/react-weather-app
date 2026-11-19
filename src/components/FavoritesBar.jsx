import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiX } from "react-icons/bi";

const DEFAULT_CITIES = [
  { name: "Bengaluru", query: "Bengaluru" },
  { name: "New York", query: "New York" },
  { name: "London", query: "London" },
  { name: "Tokyo", query: "Tokyo" },
  { name: "Paris", query: "Paris" },
  { name: "Sydney", query: "Sydney" },
];

const FavoritesBar = ({
  currentCityName,
  favorites,
  onToggleFavorite,
  onSelectCity,
}) => {
  const isCurrentFavorited =
    currentCityName &&
    favorites.some(
      (f) => f.name.toLowerCase() === currentCityName.toLowerCase()
    );

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        {/* City Chips */}
        <div className="flex items-center space-x-2">
          {/* Quick presets & user favorites */}
          {DEFAULT_CITIES.map((city) => {
            const isActive =
              currentCityName &&
              currentCityName.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.name}
                onClick={() => onSelectCity({ q: city.query })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? "bg-white text-slate-900 border-white shadow-lg shadow-white/20 font-bold scale-105"
                    : "glass-card text-white/80 hover:text-white hover:bg-white/15 border-white/15"
                }`}
              >
                {city.name}
              </button>
            );
          })}

          {/* User Custom Bookmarked Cities (if not already in default) */}
          {favorites
            .filter(
              (fav) =>
                !DEFAULT_CITIES.some(
                  (d) => d.name.toLowerCase() === fav.name.toLowerCase()
                )
            )
            .map((fav) => {
              const isActive =
                currentCityName &&
                currentCityName.toLowerCase() === fav.name.toLowerCase();
              return (
                <div
                  key={fav.name}
                  className={`group inline-flex items-center rounded-full border transition-all duration-200 ${
                    isActive
                      ? "bg-white text-slate-900 border-white shadow-lg shadow-white/20 font-bold scale-105"
                      : "glass-card text-white/80 hover:text-white hover:bg-white/15 border-white/15"
                  }`}
                >
                  <button
                    onClick={() => onSelectCity({ q: fav.name })}
                    className="pl-3.5 pr-1.5 py-1.5 text-xs font-semibold whitespace-nowrap"
                  >
                    ★ {fav.name}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(fav.name);
                    }}
                    title="Remove from bookmarks"
                    className="pr-2 pl-0.5 py-1 text-gray-400 hover:text-rose-400 transition"
                  >
                    <BiX size={14} />
                  </button>
                </div>
              );
            })}
        </div>

        {/* Bookmark Current City Button */}
        {currentCityName && (
          <button
            onClick={() => onToggleFavorite(currentCityName)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-200 ${
              isCurrentFavorited
                ? "bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm"
                : "glass-card text-sky-200 hover:text-white hover:bg-white/15 border-white/15"
            }`}
          >
            {isCurrentFavorited ? (
              <>
                <AiFillStar className="text-amber-400 text-sm" />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <AiOutlineStar className="text-sm" />
                <span>+ Bookmark</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FavoritesBar;
