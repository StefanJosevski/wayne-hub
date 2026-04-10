import React, { useState, useEffect } from 'react';

const API_KEY = '87529a030f3f34a9276af5351ba868eb';

const WEATHER_ICONS = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
  Smoke: '🌫️',
};

function WeatherWidget({ coords }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState('');
  const [currentCity, setCurrentCity] = useState('Gotham City');
  const [useGeo, setUseGeo] = useState(false);

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error('LOCATION NOT FOUND IN DATABASE');
        if (res.status === 401) throw new Error('API KEY INVALID — CHECK CONFIGURATION');
        throw new Error(`SERVER ERROR [${res.status}]`);
      }
      const data = await res.json();
      setWeather(data);
      setCurrentCity(data.name);
    } catch (err) {
      setError(err.message || 'WEATHER DATA UNAVAILABLE. PLEASE TRY AGAIN LATER.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      if (!res.ok) throw new Error(`WEATHER DATA UNAVAILABLE [${res.status}]`);
      const data = await res.json();
      setWeather(data);
      setCurrentCity(data.name);
    } catch (err) {
      setError(err.message || 'WEATHER DATA UNAVAILABLE. PLEASE TRY AGAIN LATER.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch from geolocation if available
  useEffect(() => {
    if (coords && useGeo) {
      fetchWeatherByCoords(coords.lat, coords.lon);
    }
  }, [coords, useGeo]);

  const handleCityFetch = () => {
    if (cityInput.trim()) {
      setUseGeo(false);
      fetchWeatherByCity(cityInput.trim());
      setCityInput('');
    }
  };

  const handleGeoFetch = () => {
    if (coords) {
      setUseGeo(true);
      fetchWeatherByCoords(coords.lat, coords.lon);
    } else {
      setError('GEOLOCATION ACCESS DENIED OR UNAVAILABLE');
    }
  };

  const icon = weather ? WEATHER_ICONS[weather.weather[0].main] || '🌡️' : null;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">⬡ ATMOSPHERIC INTEL</span>
        <span className="panel-badge">NOAA FEED</span>
      </div>
      <div className="panel-body">
        <div className="weather-search">
          <input
            className="weather-city-input"
            type="text"
            placeholder="ENTER SECTOR / CITY..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCityFetch()}
          />
          <button className="fetch-btn" onClick={handleCityFetch}>SCAN</button>
          {coords && (
            <button className="geo-btn" onClick={handleGeoFetch} title="Use your location">
              ◎
            </button>
          )}
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <span className="loading-text">SCANNING ATMOSPHERIC DATA...</span>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            ⚠ {error}
            <button className="retry-btn" onClick={() => fetchWeatherByCity(currentCity)}>
              RETRY
            </button>
          </div>
        )}

        {weather && !loading && !error && (
          <>
            <div className="weather-main">
              <div>
                <div className="weather-temp">
                  {Math.round(weather.main.temp)}
                  <span className="weather-unit">°F</span>
                </div>
              </div>
              <div className="weather-info">
                <div className="weather-city">{weather.name.toUpperCase()}</div>
                <div className="weather-desc">{weather.weather[0].description.toUpperCase()}</div>
              </div>
              <div className="weather-icon">{icon}</div>
            </div>

            <div className="weather-stats">
              <div className="weather-stat">
                <span className="stat-label">FEELS LIKE</span>
                <div className="stat-value">{Math.round(weather.main.feels_like)}°F</div>
              </div>
              <div className="weather-stat">
                <span className="stat-label">HUMIDITY</span>
                <div className="stat-value">{weather.main.humidity}%</div>
              </div>
              <div className="weather-stat">
                <span className="stat-label">WIND</span>
                <div className="stat-value">{Math.round(weather.wind.speed)} mph</div>
              </div>
              <div className="weather-stat">
                <span className="stat-label">VISIBILITY</span>
                <div className="stat-value">
                  {weather.visibility ? `${(weather.visibility / 1609).toFixed(1)} mi` : 'N/A'}
                </div>
              </div>
            </div>
          </>
        )}

        {!weather && !loading && !error && (
          <div className="empty-state">
            ENTER A CITY OR USE GEOLOCATION TO GET WEATHER DATA
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherWidget;
