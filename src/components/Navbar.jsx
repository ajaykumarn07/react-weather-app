import { useState, useEffect, useRef } from "react";
import { BiSearch, BiCurrentLocation, BiRefresh, BiX } from "react-icons/bi";
import { IoSparklesOutline, IoSparkles } from "react-icons/io5";
import { WiDaySunny } from "react-icons/wi";
import { searchCities } from "../services/weatherService";

const Navbar = ({
  setQuery,
  units,
  setUnits,
  onRefresh,
  isRefreshing,
  isEffectsEnabled,
  setIsEffectsEnabled,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced auto-complete
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(searchTerm, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("City search error:", err);
          setSuggestions([]);
          setShowDropdown(false);
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city) => {
    setQuery({ lat: city.lat, lon: city.lon });
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setQuery({ q: searchTerm.trim() });
      setShowDropdown(false);
      setSearchTerm("");
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setQuery({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setIsLocating(false);
        alert("Unable to retrieve location. Please check browser permissions.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <header className="relative z-40 w-full mb-6">
      <div className="glass-card rounded-3xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Status */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <button
            type="button"
            className="flex items-center space-x-2.5 text-left"
            onClick={() => setQuery({ q: "Bengaluru" })}
            aria-label="SkyPulse home"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <WiDaySunny className="text-3xl text-white animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                SkyPulse
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] tracking-wider font-semibold text-emerald-300 uppercase">
                  Live Radar
                </span>
              </div>
            </div>
          </button>
          {/* Mobile unit switch & actions */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setIsEffectsEnabled(!isEffectsEnabled)}
              title={isEffectsEnabled ? "Disable Particle Effects" : "Enable Particle Effects"}
              aria-label={isEffectsEnabled ? "Disable particle effects" : "Enable particle effects"}
              className={`p-2 rounded-xl transition ${
                isEffectsEnabled ? "bg-sky-500/20 text-sky-300" : "bg-white/5 text-gray-400"
              }`}
            >
              {isEffectsEnabled ? <IoSparkles size={18} /> : <IoSparklesOutline size={18} />}
            </button>
            <div className="flex bg-black/30 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                aria-label="Show temperatures in Celsius"
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                  units === "metric" ? "bg-white/20 text-white shadow" : "text-gray-400"
                }`}
                onClick={() => setUnits("metric")}
              >
                °C
              </button>
              <button
                type="button"
                aria-label="Show temperatures in Fahrenheit"
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                  units === "imperial" ? "bg-white/20 text-white shadow" : "text-gray-400"
                }`}
                onClick={() => setUnits("imperial")}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Search Input with Autocomplete */}
        <div ref={dropdownRef} className="relative w-full md:max-w-md lg:max-w-lg">
          <form onSubmit={handleManualSubmit} className="relative flex items-center">
            <BiSearch className="absolute left-3.5 text-sky-200/70 text-xl pointer-events-none" />
            <label className="sr-only" htmlFor="city-search">Search for a city</label>
            <input
              id="city-search"
              type="text"
              placeholder="Search any city, country or place..."
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={showDropdown}
              aria-controls="city-suggestions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              className="w-full pl-10 pr-20 py-2.5 bg-black/25 focus:bg-black/40 text-white text-sm placeholder-gray-400/80 rounded-2xl border border-white/15 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition-all shadow-inner"
            />
            <span className="sr-only" role="status" aria-live="polite">
              {isSearching ? "Searching cities" : ""}
            </span>

            <div className="absolute right-2 flex items-center space-x-1">
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear city search"
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded-full text-gray-400 hover:text-white transition"
                >
                  <BiX size={18} />
                </button>
              )}
              <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={isLocating}
                title="Use Current Location"
                aria-label={isLocating ? "Finding your location" : "Use current location"}
                className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 transition hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <BiCurrentLocation className={`text-lg ${isLocating ? "animate-spin" : ""}`} />
              </button>
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div id="city-suggestions" role="listbox" className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-50 divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-sky-400 uppercase bg-white/5">
                Suggested Locations
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={`${item.lat}-${item.lon}-${idx}`}
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => handleSelectCity(item)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-sky-500/20 flex items-center justify-between transition group"
                >
                  <div>
                    <span className="font-medium text-white group-hover:text-sky-200 text-sm">
                      {item.name}
                    </span>
                    {item.state && (
                      <span className="text-xs text-gray-400 ml-1.5">
                        {item.state}
                      </span>
                    )}
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide rounded-md bg-white/10 text-sky-300 border border-white/10">
                    {item.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Live Data"
            aria-label={isRefreshing ? "Refreshing weather" : "Refresh weather"}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 hover:text-white transition active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <BiRefresh className={`text-xl ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          {/* Effects Toggle */}
          <button
            onClick={() => setIsEffectsEnabled(!isEffectsEnabled)}
            title={isEffectsEnabled ? "Disable Ambient Weather Particles" : "Enable Ambient Weather Particles"}
            aria-label={isEffectsEnabled ? "Disable particle effects" : "Enable particle effects"}
            className={`p-2 rounded-2xl border transition active:scale-95 shadow-sm ${
              isEffectsEnabled
                ? "bg-sky-500/25 text-sky-300 border-sky-400/40"
                : "bg-white/10 text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            {isEffectsEnabled ? <IoSparkles size={20} /> : <IoSparklesOutline size={20} />}
          </button>

          {/* Metric / Imperial Segmented Pill */}
          <div className="flex bg-black/35 p-1 rounded-2xl border border-white/15 shadow-inner">
            <button
              type="button"
              aria-label="Show temperatures in Celsius"
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                units === "metric"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setUnits("metric")}
            >
              °C (Metric)
            </button>
            <button
              type="button"
              aria-label="Show temperatures in Fahrenheit"
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                units === "imperial"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setUnits("imperial")}
            >
              °F (Imperial)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
