import assert from "node:assert/strict";
import test from "node:test";
import { createWeatherHandler } from "../api/weather.js";

const createResponse = () => ({
  headers: {},
  statusCode: 200,
  setHeader(name, value) {
    this.headers[name] = value;
  },
  end(body) {
    this.body = body;
  },
});

test("rejects unsupported routes without contacting the provider", async () => {
  const handler = createWeatherHandler(() => "server-key");
  const response = createResponse();

  await handler({ method: "GET", query: { type: "unknown" } }, response);

  assert.equal(response.statusCode, 400);
  assert.equal(JSON.parse(response.body).message, "Unsupported weather request.");
});

test("rejects invalid coordinates without contacting the provider", async () => {
  const handler = createWeatherHandler(() => "server-key");
  const response = createResponse();

  await handler(
    { method: "GET", query: { type: "forecast", lat: "91", lon: "10" } },
    response
  );

  assert.equal(response.statusCode, 400);
  assert.match(JSON.parse(response.body).message, /latitude and longitude/);
});

test("adds the server key only to the allow-listed upstream request", async () => {
  const originalFetch = globalThis.fetch;
  let upstreamUrl;

  globalThis.fetch = async (url) => {
    upstreamUrl = new URL(url);
    return new Response(JSON.stringify({ name: "London" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    const handler = createWeatherHandler(() => "server-key");
    const response = createResponse();

    await handler(
      { method: "GET", query: { type: "current", q: "London", units: "metric" } },
      response
    );

    assert.equal(response.statusCode, 200);
    assert.equal(upstreamUrl.origin, "https://api.openweathermap.org");
    assert.equal(upstreamUrl.pathname, "/data/2.5/weather");
    assert.equal(upstreamUrl.searchParams.get("appid"), "server-key");
    assert.equal(response.body.includes("server-key"), false);
    assert.deepEqual(JSON.parse(response.body), { name: "London" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
