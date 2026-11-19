import { DateTime } from "luxon";

const API_URL = "/api/weather";

const createApiUrl = (type, params = {}) => {
  const searchParams = new URLSearchParams({ type });
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });
  return `${API_URL}?${searchParams}`;
};

const fetchJson = async (url, signal) => {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${res.status}`);
  }
  return res.json();
};

export const searchCities = async (query, { signal } = {}) => {
  if (!query || query.trim().length < 2) return [];
  const data = await fetchJson(createApiUrl("geocode", { q: query.trim() }), signal);
  return data.map((item) => ({
    name: item.name,
    state: item.state || "",
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  }));
};

export const formatToLocalTime = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy' | Local Time: 'hh:mm a"
) => {
  return DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);
};

export const iconUrlFromCode = (icon, size = "4x") => {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
};

export const getWindDirection = (deg) => {
  if (deg === undefined || deg === null) return "N/A";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(deg / 22.5) % 16;
  return `${directions[index]} (${deg}°)`;
};

export const calculateDewPoint = (temp, humidity, units = "metric") => {
  // Convert to Celsius if Imperial for calculation
  const tempC = units === "metric" ? temp : ((temp - 32) * 5) / 9;
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(humidity / 100);
  const dewPointC = (b * alpha) / (a - alpha);
  if (units === "metric") {
    return Math.round(dewPointC);
  }
  return Math.round((dewPointC * 9) / 5 + 32);
};

export const getAqiDetails = (aqi) => {
  switch (aqi) {
    case 1:
      return {
        level: "Good",
        color: "text-emerald-400",
        badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        barColor: "bg-emerald-400",
        percent: 20,
        description: "Air quality is satisfactory and poses little or no health risk.",
      };
    case 2:
      return {
        level: "Fair",
        color: "text-lime-400",
        badgeBg: "bg-lime-500/20 text-lime-300 border-lime-500/30",
        barColor: "bg-lime-400",
        percent: 40,
        description: "Air quality is acceptable; extremely sensitive individuals may feel slight irritation.",
      };
    case 3:
      return {
        level: "Moderate",
        color: "text-amber-400",
        badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        barColor: "bg-amber-400",
        percent: 60,
        description: "Sensitive groups may experience health effects. General public is less likely affected.",
      };
    case 4:
      return {
        level: "Poor",
        color: "text-orange-400",
        badgeBg: "bg-orange-500/20 text-orange-300 border-orange-500/30",
        barColor: "bg-orange-400",
        percent: 80,
        description: "Everyone may begin to experience minor health effects. Limit prolonged outdoor exertion.",
      };
    case 5:
      return {
        level: "Very Poor",
        color: "text-rose-400",
        badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        barColor: "bg-rose-500",
        percent: 100,
        description: "Health alert: severe risk for all individuals. Avoid strenuous outdoor activities.",
      };
    default:
      return {
        level: "Unknown",
        color: "text-gray-400",
        badgeBg: "bg-gray-500/20 text-gray-300 border-gray-500/30",
        barColor: "bg-gray-400",
        percent: 0,
        description: "Air quality data is currently unavailable.",
      };
  }
};

export const getWeatherConditionTheme = (weatherId, iconCode) => {
  const isNight = iconCode ? iconCode.includes("n") : false;

  // Thunderstorm: 2xx
  if (weatherId >= 200 && weatherId < 300) {
    return {
      type: "thunderstorm",
      isNight,
      gradient: "from-slate-900 via-indigo-950 to-purple-950",
      accent: "text-purple-300",
      pillBg: "bg-purple-500/20 border-purple-500/30",
      glow: "rgba(168, 85, 247, 0.4)",
    };
  }
  // Drizzle / Rain: 3xx, 5xx
  if (weatherId >= 300 && weatherId < 600) {
    return {
      type: "rain",
      isNight,
      gradient: isNight
        ? "from-slate-950 via-cyan-950 to-blue-950"
        : "from-blue-900 via-sky-800 to-slate-900",
      accent: "text-cyan-300",
      pillBg: "bg-cyan-500/20 border-cyan-500/30",
      glow: "rgba(6, 182, 212, 0.4)",
    };
  }
  // Snow: 6xx
  if (weatherId >= 600 && weatherId < 700) {
    return {
      type: "snow",
      isNight,
      gradient: isNight
        ? "from-slate-950 via-blue-950 to-indigo-950"
        : "from-sky-700 via-indigo-600 to-slate-800",
      accent: "text-sky-200",
      pillBg: "bg-sky-400/20 border-sky-400/30",
      glow: "rgba(186, 230, 253, 0.5)",
    };
  }
  // Atmosphere (Mist, Fog, Smoke, Haze): 7xx
  if (weatherId >= 700 && weatherId < 800) {
    return {
      type: "mist",
      isNight,
      gradient: isNight
        ? "from-zinc-950 via-stone-900 to-slate-900"
        : "from-slate-700 via-zinc-600 to-stone-700",
      accent: "text-stone-300",
      pillBg: "bg-stone-500/20 border-stone-500/30",
      glow: "rgba(214, 211, 209, 0.3)",
    };
  }
  // Clear: 800
  if (weatherId === 800) {
    if (isNight) {
      return {
        type: "clear-night",
        isNight: true,
        gradient: "from-slate-950 via-indigo-950 to-slate-900",
        accent: "text-indigo-300",
        pillBg: "bg-indigo-500/20 border-indigo-500/30",
        glow: "rgba(129, 140, 248, 0.4)",
      };
    }
    return {
      type: "clear-day",
      isNight: false,
      gradient: "from-sky-500 via-blue-600 to-amber-600",
      accent: "text-amber-300",
      pillBg: "bg-amber-500/20 border-amber-500/30",
      glow: "rgba(251, 191, 36, 0.4)",
    };
  }
  // Clouds: 80x
  if (isNight) {
    return {
      type: "clouds-night",
      isNight: true,
      gradient: "from-slate-950 via-slate-900 to-indigo-950",
      accent: "text-slate-300",
      pillBg: "bg-slate-500/20 border-slate-500/30",
      glow: "rgba(148, 163, 184, 0.3)",
    };
  }
  return {
    type: "clouds-day",
    isNight: false,
    gradient: "from-blue-600 via-indigo-700 to-slate-800",
    accent: "text-sky-200",
    pillBg: "bg-sky-500/20 border-sky-500/30",
    glow: "rgba(56, 189, 248, 0.4)",
  };
};

const formatCurrent = (data, units) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, humidity, temp_max, temp_min, pressure },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed, deg = 0, gust = 0 },
    visibility = 10000,
    clouds: { all: cloudiness = 0 } = {},
    timezone,
  } = data;

  const { main: details, description, icon, id: weatherId } = weather[0];
  const formattedLocalTime = formatToLocalTime(dt, timezone);
  const isNight = icon.includes("n");
  const theme = getWeatherConditionTheme(weatherId, icon);

  // Daylight calculations
  const totalDaylightSecs = Math.max(0, sunset - sunrise);
  const elapsedDaylightSecs = Math.min(Math.max(0, dt - sunrise), totalDaylightSecs);
  const daylightProgress = totalDaylightSecs > 0 ? Math.round((elapsedDaylightSecs / totalDaylightSecs) * 100) : 0;
  const daylightHours = Math.floor(totalDaylightSecs / 3600);
  const daylightMins = Math.floor((totalDaylightSecs % 3600) / 60);

  // Visibility conversion: km for metric, miles for imperial
  const visibilityFormatted =
    units === "metric"
      ? `${(visibility / 1000).toFixed(1)} km`
      : `${(visibility / 1609.34).toFixed(1)} mi`;

  // Dew point
  const dewPoint = calculateDewPoint(temp, humidity, units);

  return {
    temp,
    feels_like,
    humidity,
    pressure,
    temp_max,
    temp_min,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, "hh:mm a"),
    sunset: formatToLocalTime(sunset, timezone, "hh:mm a"),
    sunriseDt: sunrise,
    sunsetDt: sunset,
    daylightProgress,
    daylightDuration: `${daylightHours}h ${daylightMins}m`,
    speed,
    windDeg: deg,
    windGust: gust,
    windDirection: getWindDirection(deg),
    visibilityFormatted,
    visibilityMeters: visibility,
    cloudiness,
    details,
    description: description.charAt(0).toUpperCase() + description.slice(1),
    icon: iconUrlFromCode(icon, "4x"),
    iconCode: icon,
    weatherId,
    formattedLocalTime,
    dt,
    timezone,
    lat,
    lon,
    dewPoint,
    theme,
    isNight,
  };
};

const formatForecastWeather = (secs, offset, list) => {
  // Hourly Forecast: next 8 3-hour increments (~24 hours)
  const hourly = list
    .filter((f) => f.dt >= secs - 3600)
    .slice(0, 8)
    .map((f) => ({
      temp: f.main.temp,
      feels_like: f.main.feels_like,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon, "2x"),
      description: f.weather[0].description,
      pop: Math.round((f.pop || 0) * 100),
      speed: f.wind ? f.wind.speed : 0,
      dt: f.dt,
      date: f.dt_txt,
    }));

  // Daily Forecast: group all 40 forecast points by local calendar day
  const dailyMap = {};
  list.forEach((item) => {
    // Convert to target local date string YYYY-MM-DD
    const localDate = DateTime.fromSeconds(item.dt + offset, { zone: "utc" }).toFormat("yyyy-MM-dd");
    if (!dailyMap[localDate]) {
      dailyMap[localDate] = [];
    }
    dailyMap[localDate].push(item);
  });

  const dailyKeys = Object.keys(dailyMap).slice(0, 5);

  let overallMin = Infinity;
  let overallMax = -Infinity;

  const daily = dailyKeys.map((dateStr, idx) => {
    const items = dailyMap[dateStr];
    const temps = items.map((i) => i.main.temp);
    const dayMin = Math.min(...temps);
    const dayMax = Math.max(...temps);

    if (dayMin < overallMin) overallMin = dayMin;
    if (dayMax > overallMax) overallMax = dayMax;

    // Pick midday weather block (around 12:00-15:00) or middle of items
    const middayItem =
      items.find((i) => {
        const hour = DateTime.fromSeconds(i.dt + offset, { zone: "utc" }).hour;
        return hour >= 11 && hour <= 15;
      }) || items[Math.floor(items.length / 2)];

    const maxPop = Math.round(Math.max(...items.map((i) => i.pop || 0)) * 100);

    const firstItem = items[0];
    const dayName =
      idx === 0
        ? "Today"
        : DateTime.fromSeconds(firstItem.dt + offset, { zone: "utc" }).toFormat("ccc");
    const displayDate = DateTime.fromSeconds(firstItem.dt + offset, { zone: "utc" }).toFormat("dd LLL");

    return {
      day: dayName,
      date: displayDate,
      temp_min: dayMin,
      temp_max: dayMax,
      icon: iconUrlFromCode(middayItem.weather[0].icon, "2x"),
      description: middayItem.weather[0].description,
      pop: maxPop,
      rawDate: dateStr,
    };
  });

  return { hourly, daily, overallMin, overallMax };
};

const formatAirPollution = (data) => {
  if (!data || !data.list || !data.list[0]) {
    return {
      aqi: null,
      ...getAqiDetails(null),
      components: null,
    };
  }

  const {
    main: { aqi },
    components,
  } = data.list[0];

  return {
    aqi,
    ...getAqiDetails(aqi),
    components,
  };
};

export const getFormattedWeatherData = async (searchParams, { signal } = {}) => {
  const units = searchParams.units || "metric";

  // 1. Current Weather
  const weatherUrl = createApiUrl("current", { ...searchParams, units });
  const currentRaw = await fetchJson(weatherUrl, signal);
  const formattedCurrent = formatCurrent(currentRaw, units);

  const { lat, lon, dt, timezone } = formattedCurrent;

  // 2. 5-Day Forecast & 3. Air Pollution (in parallel)
  const forecastUrl = createApiUrl("forecast", { lat, lon, units });
  const pollutionUrl = createApiUrl("air_pollution", { lat, lon });

  const [forecastRaw, pollutionRaw] = await Promise.all([
    fetchJson(forecastUrl, signal).catch((err) => {
      if (err.name === "AbortError") throw err;
      console.warn("Forecast fetch warning:", err);
      return { list: [] };
    }),
    fetchJson(pollutionUrl, signal).catch((err) => {
      if (err.name === "AbortError") throw err;
      console.warn("Pollution fetch warning:", err);
      return null;
    }),
  ]);

  const formattedForecast = formatForecastWeather(dt, timezone, forecastRaw.list || []);
  const formattedPollution = formatAirPollution(pollutionRaw);

  return {
    ...formattedCurrent,
    ...formattedForecast,
    airPollution: formattedPollution,
    units,
  };
};

export default getFormattedWeatherData;
