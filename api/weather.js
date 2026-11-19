import process from "node:process";

const OPENWEATHER_BASE_URL = "https://api.openweathermap.org";
const ROUTES = {
  current: "/data/2.5/weather",
  forecast: "/data/2.5/forecast",
  air_pollution: "/data/2.5/air_pollution",
  geocode: "/geo/1.0/direct",
};

const sendJson = (res, status, data) => {
  res.setHeader("Cache-Control", "no-store");
  if (typeof res.status === "function") {
    return res.status(status).json(data);
  }

  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};

const getQueryValue = (req, key) => {
  const value = req.query?.[key];
  return typeof value === "string" ? value : undefined;
};

const parseCoordinate = (value, min, max) => {
  if (typeof value !== "string" || value.trim() === "") return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) && coordinate >= min && coordinate <= max
    ? coordinate
    : null;
};

const validateUnits = (value) => {
  if (value !== "metric" && value !== "imperial") {
    throw Object.assign(new Error("Units must be metric or imperial."), { statusCode: 400 });
  }
  return value;
};

const buildProviderParams = (req, type) => {
  const params = new URLSearchParams();

  if (type === "geocode") {
    const query = getQueryValue(req, "q")?.trim();
    if (!query || query.length < 2 || query.length > 100) {
      throw Object.assign(new Error("Search text must be between 2 and 100 characters."), {
        statusCode: 400,
      });
    }
    params.set("q", query);
    params.set("limit", "6");
    return params;
  }

  if (type === "current") {
    const query = getQueryValue(req, "q")?.trim();
    if (query) {
      if (query.length > 100) {
        throw Object.assign(new Error("Search text must be 100 characters or fewer."), {
          statusCode: 400,
        });
      }
      params.set("q", query);
    } else {
      const lat = parseCoordinate(getQueryValue(req, "lat"), -90, 90);
      const lon = parseCoordinate(getQueryValue(req, "lon"), -180, 180);
      if (lat === null || lon === null) {
        throw Object.assign(new Error("A valid city or latitude/longitude is required."), {
          statusCode: 400,
        });
      }
      params.set("lat", String(lat));
      params.set("lon", String(lon));
    }
    params.set("units", validateUnits(getQueryValue(req, "units") || "metric"));
    return params;
  }

  const lat = parseCoordinate(getQueryValue(req, "lat"), -90, 90);
  const lon = parseCoordinate(getQueryValue(req, "lon"), -180, 180);
  if (lat === null || lon === null) {
    throw Object.assign(new Error("Valid latitude and longitude are required."), {
      statusCode: 400,
    });
  }
  params.set("lat", String(lat));
  params.set("lon", String(lon));

  if (type === "forecast") {
    params.set("units", validateUnits(getQueryValue(req, "units") || "metric"));
  }
  return params;
};

export const createWeatherHandler = (getApiKey = () => process.env.OPENWEATHER_API_KEY) =>
  async (req, res) => {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return sendJson(res, 405, { message: "Method not allowed." });
    }

    const type = getQueryValue(req, "type");
    const route = Object.prototype.hasOwnProperty.call(ROUTES, type)
      ? ROUTES[type]
      : undefined;
    if (!route) {
      return sendJson(res, 400, { message: "Unsupported weather request." });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      console.error("OPENWEATHER_API_KEY is not configured.");
      return sendJson(res, 500, { message: "Weather service is not configured." });
    }

    try {
      const url = new URL(route, OPENWEATHER_BASE_URL);
      url.search = buildProviderParams(req, type).toString();
      url.searchParams.set("appid", apiKey);

      const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const data = await response.json();
      return sendJson(res, response.status, data);
    } catch (err) {
      if (err.statusCode === 400) {
        return sendJson(res, 400, { message: err.message });
      }
      console.error("Weather provider request failed:", err);
      return sendJson(res, 502, { message: "Weather provider is temporarily unavailable." });
    }
  };

export default createWeatherHandler();
