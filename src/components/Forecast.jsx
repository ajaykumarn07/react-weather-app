import React from "react";

const Forecast = ({ title, data }) => {
  return (
    <div>
      <div className="flex items-center justify-center sm:justify-start mt-6">
        <p className="font-medium uppercase">{title}</p>
      </div>
      <hr className="my-1" />

      <div className="flex flex-row sm:flex-row items-center justify-center sm:justify-between">
        {data &&
          data.map((d, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center mx-2 my-2 sm:mx-0"
            >
              <p className="font-light text-sm">{d.title}</p>
              <img src={d.icon} alt="Forecast-icons" className="w-12 my-1" />
              <p className="font-medium">{`${d.temp.toFixed()}°`}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Forecast;
