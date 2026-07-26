import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const distDirectory = path.resolve(process.cwd(), 'dist');
const endpointDirectory = path.join(distDirectory, 'api', 'weather');
const apiKey = process.env.OPENWEATHER_API_KEY;
const city = process.env.OPENWEATHER_CITY || 'Colombo';

const publicEvidence = {
  task: 'T07',
  provider: 'openweather',
  city,
  keyExposed: false,
};

let weatherResponse;

if (!apiKey) {
  weatherResponse = {
    ok: false,
    ...publicEvidence,
    error: 'Weather data is unavailable in this build.',
  };
  console.warn(
    'OPENWEATHER_API_KEY is not configured; generated a safe unavailable response.',
  );
} else {
  const requestUrl = new URL(
    'https://api.openweathermap.org/data/2.5/weather',
  );
  requestUrl.searchParams.set('q', city);
  requestUrl.searchParams.set('units', 'metric');
  requestUrl.searchParams.set('appid', apiKey);

  const response = await fetch(requestUrl, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`OpenWeather request failed with HTTP ${response.status}.`);
  }

  const payload = await response.json();
  const observedAt = Number.isFinite(payload.dt)
    ? new Date(payload.dt * 1000).toISOString()
    : new Date().toISOString();

  weatherResponse = {
    ok: true,
    ...publicEvidence,
    weather: {
      summary: payload.weather?.[0]?.description || 'Current conditions',
      temperatureC: payload.main?.temp,
      feelsLikeC: payload.main?.feels_like,
      humidityPercent: payload.main?.humidity,
      windSpeedMps: payload.wind?.speed,
      observedAt,
    },
  };
}

await mkdir(endpointDirectory, { recursive: true });
await writeFile(
  path.join(endpointDirectory, 'index.html'),
  `${JSON.stringify(weatherResponse, null, 2)}\n`,
  'utf8',
);

console.log(`Generated safe OpenWeather evidence for ${city}.`);
