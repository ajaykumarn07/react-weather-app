import React from "react";
import { FaThermometerEmpty } from "react-icons/fa";
import { BiSolidDropletHalf } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

const TemperatureAndDetails = ({
  weather: {
    temp,
    details,
    icon,
    temp_min,
    temp_max,
    sunrise,
    sunset,
    humidity,
    feels_like,
    speed,
  },
  units,
}) => {
  const verticalDetails = [
    {
      id: 1,
      Icons: FaThermometerEmpty,
      title: "Real Feel",
      value: `${feels_like.toFixed()}°`,
    },
    {
      id: 2,
      Icons: BiSolidDropletHalf,
      title: "Humidity",
      value: `${humidity.toFixed()}%`,
    },
    {
      id: 3,
      Icons: FiWind,
      title: "Wind",
      value: `${speed.toFixed()} ${units === "metric" ? "km/h" : "m/s"}`,
    },
  ];
  const horizontalDetails = [
    {
      id: 1,
      Icons: GiSunrise,
      title: "Sunrise",
      value: sunrise,
    },
    {
      id: 2,
      Icons: GiSunset,
      title: "Sunset",
      value: sunset,
    },
    {
      id: 3,
      Icons: MdKeyboardArrowUp,
      title: "High",
      value: `${temp_max.toFixed()}°`,
    },
    {
      id: 4,
      Icons: MdKeyboardArrowDown,
      title: "Low",
      value: `${temp_min.toFixed()}°`,
    },
  ];

  return (
    <div className="text-center py-6 sm:py-8 lg:py-10">
      <div className="flex items-center justify-center py-6 text-xl text-cyan-300">
        {/* <p>Rain</p> */}
        <p>{details}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-between py-3">
        <img src={icon} alt="Weather Icon" className="w-20 mb-3 sm:mb-0" />
        <p className="text-4xl sm:text-5xl">{`${temp.toFixed()}°`}</p>

        <div className="flex flex-col  space-y-3 sm:space-y-0 sm:space-x-3 items-center justify-center">
          {verticalDetails.map(({ id, Icons, title, value }) => (
            <div key={id} className="flex text-sm font-light items-center">
              <Icons size={18} className="mr-1" />
              {`${title}:`}
              <span className="font-medium ml-1">{`${value}`}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-10 text-sm py-3">
        {horizontalDetails.map(({ id, Icons, title, value }) => {
          return (
            <div key={id} className="flex items-center">
              <Icons size={30} />
              <p className="font-light ml-1">
                {`${title}:`}
                <span className="font-medium ml-1">{`${value}`}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemperatureAndDetails;
