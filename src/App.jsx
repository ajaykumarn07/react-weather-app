import { useEffect, useState, useCallback } from "react";
import getFormattedWeatherData from "./services/weatherService";
import WeatherBackground from "./components/WeatherBackground";
import Navbar from "./components/Navbar";
import FavoritesBar from "./components/FavoritesBar";
import HeroWeather from "./components/HeroWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import WeatherMetrics from "./components/WeatherMetrics";
import WeatherAdvisory from "./components/WeatherAdvisory";
import SkeletonLoader from "./components/SkeletonLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiErrorCircle } from "react-icons/bi";

const readStoredJSON = (key, fallback, isValid) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return fallback;

    const value = JSON.parse(saved);
    if (isValid(value)) return value;
    console.warn(`Ignoring invalid saved setting: ${key}`);
  } catch (err) {
    console.warn(`Unable to read saved setting: ${key}`, err);
  }
  return fallback;
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`Unable to save setting: ${key}`, err);
  }
};

const App = () => {
  // Persistent Settings
  const [query, setQuery] = useState(() =>
    readStoredJSON(
      "skypulse_last_city",
      { q: "Bengaluru" },
      (value) =>
        value &&
        typeof value === "object" &&
        ((typeof value.q === "string" && value.q.trim()) ||
          (Number.isFinite(value.lat) && Number.isFinite(value.lon)))
    )
  );

  const [units, setUnits] = useState(() => {
    try {
      const saved = localStorage.getItem("skypulse_units");
      return saved === "imperial" ? "imperial" : "metric";
    } catch (err) {
      console.warn("Unable to read saved units", err);
      return "metric";
    }
  });

  const [isEffectsEnabled, setIsEffectsEnabled] = useState(() => {
    return readStoredJSON("skypulse_effects", true, (value) => typeof value === "boolean");
  });

  const [favorites, setFavorites] = useState(() => {
    return readStoredJSON(
      "skypulse_favorites",
      [],
      (value) =>
        Array.isArray(value) &&
        value.every((favorite) => favorite && typeof favorite.name === "string")
    );
  });

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Save changes to localStorage
  useEffect(() => {
    saveToStorage("skypulse_units", units);
  }, [units]);

  useEffect(() => {
    saveToStorage("skypulse_effects", JSON.stringify(isEffectsEnabled));
  }, [isEffectsEnabled]);

  useEffect(() => {
    saveToStorage("skypulse_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Dynamic SEO Title & Meta Description update
  useEffect(() => {
    if (weather) {
      const unitSym = units === "metric" ? "°C" : "°F";
      const roundedTemp = Math.round(weather.temp);
      document.title = `${roundedTemp}${unitSym} ${weather.name}, ${weather.country} — SkyPulse Weather`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          `Current weather in ${weather.name}, ${weather.country}: ${weather.description}, ${roundedTemp}${unitSym}, feels like ${Math.round(
            weather.feels_like
          )}${unitSym}, humidity ${weather.humidity}%. View the hourly forecast, 5-day outlook, and air quality on SkyPulse.`
        );
      }
    }
  }, [weather, units]);

  // Fetch weather data
  const fetchWeather = useCallback(async (isSilent = false, signal) => {
    if (!isSilent) setLoading(true);
    setError(null);

    try {
      const data = await getFormattedWeatherData({ ...query, units }, { signal });
      if (signal?.aborted) return false;
      setWeather(data);

      // Save valid city name
      if (data.name) {
        saveToStorage(
          "skypulse_last_city",
          JSON.stringify({ q: data.name })
        );
      }
      return true;
    } catch (err) {
      if (err.name === "AbortError" || signal?.aborted) return false;
      console.error("Fetch weather error:", err);
      const msg = err.message || "Failed to fetch weather data.";
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [query, units]);

  useEffect(() => {
    const controller = new AbortController();
    fetchWeather(false, controller.signal);
    return () => controller.abort();
  }, [fetchWeather]);

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const refreshed = await fetchWeather(true);
    if (refreshed) toast.success("Weather refreshed!");
  };

  // Toggle favorite city
  const handleToggleFavorite = (cityName) => {
    if (!cityName) return;
    const exists = favorites.some(
      (f) => f.name.toLowerCase() === cityName.toLowerCase()
    );
    if (exists) {
      setFavorites(
        favorites.filter((f) => f.name.toLowerCase() !== cityName.toLowerCase())
      );
      toast.info(`Removed ${cityName} from bookmarks`);
    } else {
      setFavorites([...favorites, { name: cityName }]);
      toast.success(`Bookmarked ${cityName}!`);
    }
  };

  return (
    <div className="min-h-screen text-white relative font-sans selection:bg-sky-500 selection:text-white">
      {/* Dynamic Animated Atmospheric Background */}
      <WeatherBackground
        theme={weather?.theme}
        isEffectsEnabled={isEffectsEnabled}
      />

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10 flex flex-col min-h-screen justify-between">
        <div>
          {/* Header & Search Navigation */}
          <Navbar
            setQuery={setQuery}
            units={units}
            setUnits={setUnits}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            isEffectsEnabled={isEffectsEnabled}
            setIsEffectsEnabled={setIsEffectsEnabled}
          />

          {/* Favorites & Quick Cities Bar */}
          <FavoritesBar
            currentCityName={weather?.name}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectCity={setQuery}
          />

          {/* Loading Skeleton */}
          {loading && !weather && <SkeletonLoader />}

          {/* Error State */}
          {error && !loading && (
            <div className="glass-card rounded-3xl p-8 text-center max-w-lg mx-auto my-12 border-rose-500/30">
              <BiErrorCircle className="text-5xl text-rose-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Location Not Found</h2>
              <p className="text-sm text-white/70 mb-6">{error}</p>
              <button
                onClick={() => setQuery({ q: "Bengaluru" })}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg transition"
              >
                Reset to Bengaluru
              </button>
            </div>
          )}

          {/* Main Weather View */}
          {weather && !loading && (
            <main className="space-y-6 animate-in fade-in duration-300">
              {/* Hero Weather Card */}
              <HeroWeather weather={weather} units={units} />

              {/* 24-Hour Hourly Forecast */}
              <HourlyForecast hourly={weather.hourly} units={units} />

              {/* 5-Day Daily Forecast */}
              <DailyForecast
                daily={weather.daily}
                currentTemp={weather.temp}
                overallMin={weather.overallMin}
                overallMax={weather.overallMax}
              />

              {/* 8-Card Detailed Metrics Grid (AQI, Wind, Humidity, Sun, Pressure, Visibility, etc.) */}
              <WeatherMetrics weather={weather} units={units} />

              {/* Smart Lifestyle Advisory (Clothing, Sports, Umbrella, Health) */}
              <WeatherAdvisory weather={weather} units={units} />
            </main>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-white/10 text-center text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} SkyPulse Weather.</p>
          <div className="flex items-center gap-3">
            <span>Built by Ajay Kumar N</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 hover:text-sky-200 hover:underline underline-offset-4"
            >
              Weather data by OpenWeatherMap
            </a>
          </div>
        </footer>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={2200}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;
