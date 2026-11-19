import React from "react";
import {
  MdOutlineDirectionsRun,
  MdOutlineUmbrella,
  MdOutlineHealthAndSafety,
} from "react-icons/md";
import { IoShirtOutline } from "react-icons/io5";

const WeatherAdvisory = ({ weather, units }) => {
  const {
    temp,
    details,
    humidity,
    speed,
    airPollution,
    visibilityMeters,
  } = weather;

  const tempC = units === "metric" ? temp : ((temp - 32) * 5) / 9;

  // 1. Clothing Recommendation
  const getClothingAdvice = () => {
    const isRaining =
      details.toLowerCase().includes("rain") ||
      details.toLowerCase().includes("drizzle") ||
      details.toLowerCase().includes("thunderstorm");

    if (tempC < 5) {
      return {
        title: "Heavy Winter Wear",
        desc: "Wear thermal layers, a heavy winter coat, gloves, and a warm beanie.",
      };
    } else if (tempC < 15) {
      return {
        title: "Layered Light Jacket",
        desc: "A hoodie, sweater, or windbreaker will keep you comfortable.",
      };
    } else if (tempC < 25) {
      return {
        title: "Comfortable Casuals",
        desc: isRaining
          ? "Light clothing with a waterproof jacket or poncho."
          : "T-shirt and jeans or light trousers. Ideal temperature.",
      };
    } else {
      return {
        title: "Light & Breathable",
        desc: "Lightweight cotton or linen clothes. Stay hydrated and avoid dark fabrics.",
      };
    }
  };

  // 2. Outdoor Activity / Workout Condition
  const getActivityAdvice = () => {
    const isRaining = details.toLowerCase().includes("rain");
    const isAQIBad = airPollution.aqi >= 4;

    if (isRaining) {
      return {
        status: "Indoor Workout Advised",
        color: "text-amber-300",
        desc: "Wet conditions outside. Gym sessions or indoor workouts are best.",
      };
    }
    if (isAQIBad) {
      return {
        status: "Avoid Strenuous Outdoor Cardio",
        color: "text-rose-400",
        desc: "Elevated pollutant levels may cause respiratory strain.",
      };
    }
    if (airPollution.aqi === null) {
      return {
        status: "Check Local Air Quality",
        color: "text-amber-300",
        desc: "Air-quality data is unavailable. Check local guidance before strenuous outdoor activity.",
      };
    }
    if (tempC > 33) {
      return {
        status: "Exercise Early or Late",
        color: "text-orange-300",
        desc: "High heat during midday. Exercise in the early morning or evening.",
      };
    }
    return {
      status: "Great for Running & Sports",
      color: "text-emerald-300",
      desc: "Weather conditions are optimal for outdoor workouts and leisure walks.",
    };
  };

  // 3. Umbrella Alert
  const getUmbrellaAdvice = () => {
    const isRaining =
      details.toLowerCase().includes("rain") ||
      details.toLowerCase().includes("drizzle") ||
      details.toLowerCase().includes("thunderstorm");

    if (isRaining) {
      return {
        needed: true,
        desc: "Rain or showers active. Keep an umbrella or raincoat handy!",
      };
    }
    return {
      needed: false,
      desc: "No immediate rain detected. You can travel without an umbrella.",
    };
  };

  // 4. Health & Commute
  const getHealthAdvice = () => {
    if (visibilityMeters < 3000) {
      return "Low road visibility due to mist/fog. Drive with fog lights.";
    }
    if (humidity > 75 && tempC > 26) {
      return "High humidity index. Drink plenty of water throughout the day.";
    }
    if (airPollution.aqi >= 3) {
      return "Sensitive individuals should wear an N95 mask when commuting.";
    }
    if (airPollution.aqi === null) {
      return "Air-quality data is unavailable. Check local conditions if you are sensitive to pollution.";
    }
    return "Great air and climate conditions. Enjoy your day!";
  };

  const clothing = getClothingAdvice();
  const activity = getActivityAdvice();
  const umbrella = getUmbrellaAdvice();

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
          Smart Weather Insights & Lifestyle Advice
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clothing Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <div className="flex items-center space-x-2 text-sky-300 mb-2">
            <IoShirtOutline className="text-xl" />
            <span className="text-xs font-bold uppercase tracking-wider">What to Wear</span>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">{clothing.title}</h3>
          <p className="text-xs text-white/70 leading-relaxed">{clothing.desc}</p>
        </div>

        {/* Outdoor Activity Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <div className="flex items-center space-x-2 text-emerald-300 mb-2">
            <MdOutlineDirectionsRun className="text-xl" />
            <span className="text-xs font-bold uppercase tracking-wider">Outdoor Sports</span>
          </div>
          <h3 className={`text-sm font-semibold mb-1 ${activity.color}`}>{activity.status}</h3>
          <p className="text-xs text-white/70 leading-relaxed">{activity.desc}</p>
        </div>

        {/* Umbrella Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <div className="flex items-center space-x-2 text-cyan-300 mb-2">
            <MdOutlineUmbrella className="text-xl" />
            <span className="text-xs font-bold uppercase tracking-wider">Umbrella</span>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">
            {umbrella.needed ? "Umbrella Needed" : "Umbrella Not Needed"}
          </h3>
          <p className="text-xs text-white/70 leading-relaxed">{umbrella.desc}</p>
        </div>

        {/* Health & Commute Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <div className="flex items-center space-x-2 text-amber-300 mb-2">
            <MdOutlineHealthAndSafety className="text-xl" />
            <span className="text-xs font-bold uppercase tracking-wider">Health & Travel</span>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Daily Wellness Tip</h3>
          <p className="text-xs text-white/70 leading-relaxed">{getHealthAdvice()}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherAdvisory;
