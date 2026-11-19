import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createWeatherHandler } from "./api/weather.js";

const registerWeatherApi = (server, weatherHandler) => {
  server.middlewares.use("/api/weather", (req, res) => {
    const requestUrl = new URL(req.url, "http://localhost");
    req.query = Object.fromEntries(requestUrl.searchParams);
    return weatherHandler(req, res);
  });
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const weatherHandler = createWeatherHandler(() => env.OPENWEATHER_API_KEY);

  return {
    plugins: [
      react(),
      {
        name: "local-weather-api",
        configureServer: (server) => registerWeatherApi(server, weatherHandler),
        configurePreviewServer: (server) => registerWeatherApi(server, weatherHandler),
      },
    ],
    server: {
      port: 3000,
    },
  };
});
