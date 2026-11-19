import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import {
  MdOutlineArrowUpward,
  MdOutlineArrowDownward,
  MdLocationOn,
} from "react-icons/md";
import { WiThermometer, WiHumidity } from "react-icons/wi";

const HeroWeather = ({ weather, units }) => {
  const {
    name,
    country,
    temp,
    feels_like,
    temp_min,
    temp_max,
    details,
    description,
    icon,
    timezone,
    theme,
    dewPoint,
    humidity,
  } = weather;

  // Live ticking clock for the target location's timezone
  const [liveTime, setLiveTime] = useState("");
  const [liveDate, setLiveDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      // Offset is in seconds from UTC
      const localDt = DateTime.now().toUTC().plus({ seconds: timezone });
      setLiveTime(localDt.toFormat("hh:mm:ss a"));
      setLiveDate(localDt.toFormat("cccc, dd MMMM yyyy"));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  // Dynamic friendly summary
  const getSummary = () => {
    const unitSymbol = units === "metric" ? "°C" : "°F";
    let humidityNote = "";
    if (humidity > 70) {
      humidityNote = "High humidity will make it feel warmer.";
    } else if (humidity < 30) {
      humidityNote = "Air is dry and crisp.";
    } else {
      humidityNote = "Comfortable humidity levels today.";
    }
    return `Today in ${name}: expect ${description.toLowerCase()} with temperatures ranging from ${Math.round(
      temp_min
    )}${unitSymbol} to ${Math.round(temp_max)}${unitSymbol}. ${humidityNote}`;
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 lg:p-10 mb-6 transition-all relative overflow-hidden">
      {/* Decorative subtle backdrop gradient inside hero */}
      <div
        className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: theme?.glow || "rgba(56, 189, 248, 0.4)" }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8">
        {/* Left Column: Location & Live Local Clock */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
          <div className="flex items-center space-x-2 text-sky-200">
            <MdLocationOn className="text-2xl text-sky-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {name}
              <span className="text-xl sm:text-2xl font-light text-sky-300/80 ml-2">
                {country}
              </span>
            </h1>
          </div>

          {/* Live Clock & Date Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <div className="px-3.5 py-1 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm font-medium tracking-wide text-white/90">
              {liveDate || "Loading date..."}
            </div>
            <div className="px-3.5 py-1 rounded-xl bg-sky-500/20 border border-sky-400/30 text-xs sm:text-sm font-mono font-bold text-sky-200">
              {liveTime || "Loading time..."}
            </div>
          </div>

          {/* Quick Summary Banner */}
          <p className="text-xs sm:text-sm text-sky-100/80 max-w-lg pt-2 leading-relaxed font-light">
            {getSummary()}
          </p>
        </div>

        {/* Right Column: Hero Temp & Animated Icon */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          {/* Animated Weather Icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl transform scale-75 animate-pulse-slow" />
            <img
              src={icon}
              alt={description}
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-2xl animate-float"
            />
          </div>

          {/* Temperature & High / Low / Feels like */}
          <div className="flex flex-col items-center sm:items-start space-y-2">
            <div className="flex items-start">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-md text-glow">
                {Math.round(temp)}
              </span>
              <span className="text-3xl sm:text-4xl font-light text-sky-200 mt-2">
                {units === "metric" ? "°C" : "°F"}
              </span>
            </div>

            {/* Condition Badge */}
            <div
              className={`px-4 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide border uppercase ${
                theme?.pillBg || "bg-sky-500/20 text-sky-200 border-sky-400/30"
              }`}
            >
              {description}
            </div>

            {/* Micro stats: High / Low / Real feel */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm text-white/90">
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">
                <MdOutlineArrowUpward className="text-rose-400" />
                <span>{Math.round(temp_max)}°</span>
                <MdOutlineArrowDownward className="text-sky-400 ml-1" />
                <span>{Math.round(temp_min)}°</span>
              </div>

              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">
                <WiThermometer className="text-amber-400 text-lg" />
                <span>Feels {Math.round(feels_like)}°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroWeather;
