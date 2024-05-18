import React from "react";

const cities = [
  {
    id: 1,
    name: "Bengaluru",
  },
  {
    id: 2,
    name: "New York",
  },
  {
    id: 3,
    name: "London",
  },
  {
    id: 4,
    name: "Russia",
  },
  {
    id: 5,
    name: "Sydney",
  },
];

const TopButtons = ({ setQuery }) => {
  return (
    <div className="flex item flex-wrap justify-around my-6">
      {cities.map((city) => {
        return (
          <button
            key={city.id}
            className="text-lg font-medium hover:bg-gray-700/20 px-3 py-2 rounded-md m-2 transition ease-in"
            onClick={() => setQuery({ q: city.name })}
          >
            {city.name}
          </button>
        );
      })}
    </div>
  );
};

export default TopButtons;
