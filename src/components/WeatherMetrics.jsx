import React from "react";
import {
  WiSunrise,
  WiSunset,
  WiBarometer,
  WiHumidity,
  WiCloudy,
  WiThermometer,
} from "react-icons/wi";
import { FiEye, FiCompass } from "react-icons/fi";
import { MdOutlineAir } from "react-icons/md";

const WeatherMetrics = ({ weather, units }) => {
  const {
    humidity,
    pressure,
    speed,
    windDeg,
    windGust,
    windDirection,
    visibilityFormatted,
    visibilityMeters,
    cloudiness,
    sunrise,
    sunset,
    daylightProgress,
    daylightDuration,
    feels_like,
    temp,
    dewPoint,
    airPollution,
  } = weather;

  const unitSpeed = units === "metric" ? "km/h" : "mph";
  // Convert m/s to km/h if metric for intuitive display
  const displaySpeed =
    units === "metric" ? Math.round(speed * 3.6) : Math.round(speed);
  const displayGust =
    windGust && units === "metric"
      ? Math.round(windGust * 3.6)
      : windGust
      ? Math.round(windGust)
      : null;

  // Visibility status
  const getVisibilityStatus = () => {
    if (visibilityMeters >= 9000) return "Perfect clarity";
    if (visibilityMeters >= 5000) return "Good visibility";
    if (visibilityMeters >= 2000) return "Moderate haze";
    return "Dense fog / low visibility";
  };

  // Humidity comfort
  const getHumidityComfort = () => {
    if (humidity < 30) return "Dry air";
    if (humidity <= 60) return "Comfortable & pleasant";
    if (humidity <= 75) return "Slightly humid";
    return "Very muggy & humid";
  };

  // Pressure status
  const getPressureStatus = () => {
    if (pressure > 1018) return "High pressure (clear skies)";
    if (pressure < 1008) return "Low pressure (storm risk)";
    return "Normal atmospheric pressure";
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
          Weather Conditions & Details
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Air Quality Index (AQI) */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between col-span-1 sm:col-span-2">
          <div>
            <div className="flex items-center justify-between text-white/70 mb-3">
              <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-sky-200">
                <MdOutlineAir className="text-lg text-emerald-400" />
                <span>Air Quality Index (AQI)</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${airPollution.badgeBg}`}
              >
                {airPollution.aqi === null
                  ? "AQI unavailable"
                  : `${airPollution.level} (${airPollution.aqi}/5)`}
              </span>
            </div>

            {/* AQI Gradient Bar */}
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden mb-3 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${airPollution.barColor}`}
                style={{ width: `${airPollution.percent}%` }}
              />
            </div>

            <p className="text-xs text-white/80 leading-relaxed mb-4">
              {airPollution.description}
            </p>
          </div>

          {/* Pollutant Chips */}
          {airPollution.components ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-white/10 text-center">
              <div>
                <span className="text-[10px] text-white/50 block">PM2.5</span>
                <span className="text-xs font-bold text-white">
                  {Math.round(airPollution.components.pm2_5)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">PM10</span>
                <span className="text-xs font-bold text-white">
                  {Math.round(airPollution.components.pm10)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">O3</span>
                <span className="text-xs font-bold text-white">
                  {Math.round(airPollution.components.o3)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">NO2</span>
                <span className="text-xs font-bold text-white">
                  {Math.round(airPollution.components.no2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">SO2</span>
                <span className="text-xs font-bold text-white">
                  {Math.round(airPollution.components.so2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">CO</span>
                <span className="text-xs font-bold text-white">
                  {Math.round(airPollution.components.co)}
                </span>
              </div>
            </div>
          ) : (
            <p className="pt-2 border-t border-white/10 text-xs text-white/60">
              Pollutant readings are currently unavailable.
            </p>
          )}
        </div>

        {/* 2. Wind & Compass */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="flex items-center space-x-1.5">
              <FiCompass className="text-base text-cyan-400" />
              <span>Wind</span>
            </div>
            <span>{windDirection}</span>
          </div>

          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {displaySpeed}
                <span className="text-sm font-normal text-sky-200 ml-1">
                  {unitSpeed}
                </span>
              </div>
              {displayGust && (
                <span className="text-xs text-white/60">
                  Gusts up to {displayGust} {unitSpeed}
                </span>
              )}
            </div>

            {/* Rotating Wind Needle */}
            <div className="relative w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/20">
              <div
                className="transform transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${windDeg}deg)` }}
                title={`Wind direction: ${windDeg}°`}
              >
                <div className="w-1.5 h-6 bg-gradient-to-t from-transparent via-cyan-400 to-sky-300 rounded-full" />
              </div>
              <span className="absolute text-[8px] font-bold text-white/40 top-0.5">N</span>
            </div>
          </div>

          <p className="text-xs text-white/70 pt-2 border-t border-white/10">
            Blowing from the {windDirection.split(" ")[0]}
          </p>
        </div>

        {/* 3. Humidity & Dew Point */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="flex items-center space-x-1.5">
              <WiHumidity className="text-2xl text-blue-400" />
              <span>Humidity</span>
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-white tracking-tight">
              {humidity}%
            </div>
            <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
                style={{ width: `${humidity}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-xs text-white/70">
            <span>Dew point is {dewPoint}° ({getHumidityComfort()})</span>
          </div>
        </div>

        {/* 4. Sunrise & Sunset / Daylight Arc */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="flex items-center space-x-1.5">
              <WiSunrise className="text-2xl text-amber-400" />
              <span>Sun Schedule</span>
            </div>
            <span className="text-[11px] text-amber-200/80">{daylightDuration}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="flex items-center space-x-2">
              <WiSunrise className="text-3xl text-amber-400" />
              <div>
                <span className="text-[10px] text-white/50 block">Sunrise</span>
                <span className="text-xs font-bold text-white">{sunrise}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <WiSunset className="text-3xl text-orange-400" />
              <div>
                <span className="text-[10px] text-white/50 block">Sunset</span>
                <span className="text-xs font-bold text-white">{sunset}</span>
              </div>
            </div>
          </div>

          {/* Daylight Progress Bar */}
          <div>
            <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                style={{ width: `${daylightProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-white/50">
              {daylightProgress}% of daylight completed
            </span>
          </div>
        </div>

        {/* 5. Visibility */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="flex items-center space-x-1.5">
              <FiEye className="text-base text-teal-400" />
              <span>Visibility</span>
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-white tracking-tight">
              {visibilityFormatted}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-xs text-white/70">
            <span>{getVisibilityStatus()}</span>
          </div>
        </div>

        {/* 6. Pressure */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="flex items-center space-x-1.5">
              <WiBarometer className="text-2xl text-purple-400" />
              <span>Pressure</span>
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-white tracking-tight">
              {pressure}{" "}
              <span className="text-sm font-normal text-sky-200">hPa</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-xs text-white/70">
            <span>{getPressureStatus()}</span>
          </div>
        </div>

        {/* 7. Cloud Cover */}
        <div className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <div className="flex items-center space-x-1.5">
              <WiCloudy className="text-2xl text-indigo-300" />
              <span>Cloud Cover</span>
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-white tracking-tight">
              {cloudiness}%
            </div>
            <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-sky-300 rounded-full"
                style={{ width: `${cloudiness}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-xs text-white/70">
            <span>
              {cloudiness > 70
                ? "Overcast & dense clouds"
                : cloudiness > 30
                ? "Partly cloudy sky"
                : "Mostly clear sky"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMetrics;
