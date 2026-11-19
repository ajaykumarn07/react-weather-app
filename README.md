# SkyPulse - Weather Intelligence & Forecast Dashboard

A weather application built with React, Vite, and Tailwind CSS, featuring glassmorphism aesthetics, live atmospheric particle animations, and meteorological telemetry powered by the OpenWeatherMap API.

🌐 **Live Demo:** [https://akn-weather-app.vercel.app/](https://akn-weather-app.vercel.app/)

## Features

- **Live Local Time**: Dynamic ticking clock calibrated to the exact timezone of the target location.
- **Air Quality Index (AQI)**: Real-time air pollution levels (1–5 scale) with component breakdown (PM2.5, PM10, O3, NO2, SO2, CO) and health recommendations.
- **24-Hour Hourly Timeline**: Interactive hourly forecast with rain chance percentages (`PoP %`) and wind stats.
- **5-Day Extended Forecast**: Apple Weather-style forecast with visual min/max gradient temperature bars and a current temperature indicator.
- **8-Card Metrics Grid**: Wind & rotating compass, humidity & calculated dew point, solar schedule with daylight arc, visibility, atmospheric pressure, and cloud cover.
- **Smart Advisory**: Dynamic suggestions for clothing, outdoor workouts, umbrella needs, and commuting.
- **Search with Autocomplete**: Real-time city search via OpenWeatherMap Geocoding API with state and country badges.
- **Favorites & Bookmarks**: Save custom cities to local storage with quick-access chip pills.
- **Dynamic Themes & Particle Effects**: Ambient rain, snow, or star animations tailored to current conditions (with on/off toggle).
- **Unit Switching**: One-click toggle between Metric (°C, km/h) and Imperial (°F, mph).

## Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd react-weather-app
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open [.env](file:///d:/AjayKumar/source/VSCodeEditor/weather-app/react-weather-app/.env) and enter your [OpenWeatherMap API Key](https://home.openweathermap.org/api_keys):
```env
VITE_API_KEY=your_openweathermap_api_key_here
```

`VITE_` variables are embedded in the browser bundle and are **not secrets**. This setup is suitable for local development only. Before a public production deployment, route weather-provider requests through a server-side function/API that keeps the provider key in server-only configuration, validates inputs, applies rate limits, and returns only the data the client needs. Restrict the provider key where supported, monitor its usage, and rotate it if it has ever been committed or exposed.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## Production readiness

- Deploy behind HTTPS. Browser geolocation requires a secure context and explicit user permission.
- Keep provider credentials out of client-side `VITE_*` variables in production; see the development-only warning above.
- Configure deployment security headers (including a Content Security Policy) for the actual host and API origins, and review external asset/font providers against that policy.
- Add automated tests for weather parsing, failed/partial provider responses, search, and persisted settings before expanding the feature set.
- Set provider usage alerts/quotas and define a privacy/retention policy for any location data. This app currently stores preferences and favorite city names in browser local storage.
