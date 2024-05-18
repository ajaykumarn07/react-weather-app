import React from "react";

const TimeAndLocation = ({
  weather: { formattedLocalTime, name, country },
}) => {
  return (
    <div>
      <div className="flex justify-center items-center my-6">
        <p className="text-xl font-extralight">
          {/* Saturday, 18th May 2024 | Local Time: 12:13 PM */}
          {formattedLocalTime}
        </p>
      </div>
      <div className="flex items-center justify-center my-3">
        <p className="text-3xl font-medium">{`${name}, ${country}`}</p>
      </div>
    </div>
  );
};

export default TimeAndLocation;
