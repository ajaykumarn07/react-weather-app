import React from "react";
import { IoWaterOutline } from "react-icons/io5";

const DailyForecast = ({ daily, currentTemp, overallMin, overallMax }) => {
  if (!daily || daily.length === 0) return null;

  // Safe range calculations for temperature bars
  const rangeSpan = Math.max(1, (overallMax || 30) - (overallMin || 10));

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-6 mb-6">
      {/* Title */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
          5-Day Forecast
        </h2>
      </div>

      {/* Daily List */}
      <div className="space-y-3.5">
        {daily.map((item, index) => {
          const isToday = index === 0;

          // Bar calculations
          const minPercent = Math.max(
            0,
            Math.min(100, (((item.temp_min - overallMin) / rangeSpan) * 100))
          );
          const maxPercent = Math.max(
            minPercent + 5,
            Math.min(100, (((item.temp_max - overallMin) / rangeSpan) * 100))
          );
          const barWidth = maxPercent - minPercent;

          // Current temp dot position (for Today)
          const currentDotPercent = isToday && currentTemp !== undefined
            ? Math.max(
                minPercent,
                Math.min(maxPercent, (((currentTemp - overallMin) / rangeSpan) * 100))
              )
            : null;

          return (
            <div
              key={item.rawDate || index}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                isToday
                  ? "bg-white/15 border-white/30 shadow-md"
                  : "bg-white/5 hover:bg-white/10 border-white/10"
              }`}
            >
              {/* Day & Date */}
              <div className="flex items-center justify-between sm:justify-start sm:w-1/4">
                <div>
                  <span className={`text-sm font-bold ${isToday ? "text-sky-300" : "text-white"}`}>
                    {item.day}
                  </span>
                  <span className="text-xs text-white/50 ml-2">
                    {item.date}
                  </span>
                </div>

                {/* Mobile condition icon */}
                <div className="sm:hidden flex items-center space-x-1">
                  <img src={item.icon} alt={item.description} className="w-9 h-9" />
                </div>
              </div>

              {/* Condition Icon & Text (Desktop) */}
              <div className="hidden sm:flex items-center space-x-3 sm:w-1/4">
                <img src={item.icon} alt={item.description} className="w-10 h-10 object-contain drop-shadow" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white/90 capitalize truncate max-w-[130px]">
                    {item.description}
                  </span>
                  {item.pop > 0 && (
                    <span className="flex items-center text-[11px] text-sky-300 font-medium">
                      <IoWaterOutline className="mr-0.5 text-xs text-sky-400" />
                      {item.pop}%
                    </span>
                  )}
                </div>
              </div>

              {/* Temperature Bar & High / Low */}
              <div className="flex items-center justify-between sm:justify-end sm:w-1/2 gap-3 mt-2 sm:mt-0">
                {/* Min Temp */}
                <span className="text-xs sm:text-sm font-semibold text-sky-200 w-8 text-right">
                  {Math.round(item.temp_min)}°
                </span>

                {/* Visual Apple-Style Range Bar */}
                <div className="relative flex-1 h-2 bg-black/30 rounded-full overflow-hidden max-w-[180px] sm:max-w-[200px]">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400 shadow-sm"
                    style={{
                      left: `${minPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />

                  {/* Current Temp Indicator Dot for Today */}
                  {currentDotPercent !== null && (
                    <div
                      className="absolute top-1/2 w-3 h-3 bg-white border-2 border-slate-900 rounded-full shadow transform -translate-y-1/2 -translate-x-1/2 z-10 animate-pulse"
                      style={{ left: `${currentDotPercent}%` }}
                      title={`Current Temp: ${Math.round(currentTemp)}°`}
                    />
                  )}
                </div>

                {/* Max Temp */}
                <span className="text-xs sm:text-sm font-bold text-white w-8 text-left">
                  {Math.round(item.temp_max)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
