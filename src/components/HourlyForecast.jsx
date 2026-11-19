import React, { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { IoWaterOutline } from "react-icons/io5";
import { FiWind } from "react-icons/fi";

const HourlyForecast = ({ hourly, units }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
            Hourly Forecast (Next 24 Hours)
          </h2>
        </div>

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition active:scale-95"
            title="Scroll Left"
          >
            <BiChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition active:scale-95"
            title="Scroll Right"
          >
            <BiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Hourly Timeline Cards */}
      <div
        ref={scrollRef}
        className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none snap-x"
      >
        {hourly.map((item, index) => {
          const isFirst = index === 0;
          return (
            <div
              key={item.dt || index}
              className={`flex-shrink-0 flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[105px] sm:min-w-[115px] border transition-all duration-300 hover:scale-105 snap-start ${
                isFirst
                  ? "bg-white/20 border-white/40 shadow-lg shadow-sky-500/10"
                  : "bg-white/5 hover:bg-white/15 border-white/10"
              }`}
            >
              {/* Time Label */}
              <span className={`text-xs font-semibold ${isFirst ? "text-sky-300" : "text-white/80"}`}>
                {isFirst ? "Now" : item.title}
              </span>

              {/* Weather Icon */}
              <img
                src={item.icon}
                alt={item.description}
                className="w-12 h-12 my-1 object-contain drop-shadow"
              />

              {/* Rain Chance if any */}
              <div className="h-5 flex items-center justify-center">
                {item.pop > 0 ? (
                  <div className="flex items-center space-x-0.5 text-[11px] font-semibold text-sky-300">
                    <IoWaterOutline className="text-xs text-sky-400" />
                    <span>{item.pop}%</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-white/40">—</span>
                )}
              </div>

              {/* Temperature */}
              <span className="text-lg font-bold text-white mt-1">
                {Math.round(item.temp)}°
              </span>

              {/* Wind mini stat */}
              <div className="flex items-center space-x-1 mt-1 text-[10px] text-white/60">
                <FiWind className="text-[10px]" />
                <span>
                  {Math.round(item.speed)} {units === "metric" ? "m/s" : "mph"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
