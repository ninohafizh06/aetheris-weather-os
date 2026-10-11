'use client';

import { useState, useEffect, useCallback } from 'react';
import WeatherCanvas from '../components/WeatherCanvas';
import AlertBanner from '../components/AlertBanner';
import WindowChrome from '../components/WindowChrome';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import TopHeroCards from '../components/TopHeroCards';
import ActiveStationHero from '../components/ActiveStationHero';
import BottomMetricsRow from '../components/BottomMetricsRow';
import TelemetryLogsTable from '../components/TelemetryLogsTable';
import HardwareModal from '../components/HardwareModal';
import ThresholdModal from '../components/ThresholdModal';
import {
  POPULAR_CITIES,
  interpretWeatherCode,
  generateFallbackWeatherData
} from '../lib/weatherData';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(POPULAR_CITIES[0]);
  const [activeMode, setActiveMode] = useState('meteo'); // 'meteo' | 'iot'
  const [unit, setUnit] = useState('C'); // 'C' | 'F'
  const [lang, setLang] = useState('id'); // 'id' | 'en'
  const [weatherData, setWeatherData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // IoT Simulation & Live Telemetry
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);

  // Modals & Alerts
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [thresholds, setThresholds] = useState({
    maxTemp: 35.0,
    maxWind: 40.0,
    maxRain: 20.0,
    maxPM25: 65.0
  });
  const [alerts, setAlerts] = useState([]);

  // Fetch real weather from Open-Meteo
  const fetchWeatherData = useCallback(async (city) => {
    setIsRefreshing(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Response Error');
      const data = await res.json();

      const currentCode = data.current?.weather_code ?? 1;
      const isDay = data.current?.is_day ?? 1;

      const hourlyList = [];
      if (data.hourly?.time) {
        for (let i = 0; i < Math.min(24, data.hourly.time.length); i++) {
          const tStr = data.hourly.time[i];
          const hour = new Date(tStr).getHours();
          hourlyList.push({
            time: `${String(hour).padStart(2, '0')}:00`,
            hour,
            temperature: data.hourly.temperature_2m?.[i] ?? 28,
            rainProbability: data.hourly.precipitation_probability?.[i] ?? 10,
            windSpeed: data.hourly.wind_speed_10m?.[i] ?? 12,
            humidity: data.hourly.relative_humidity_2m?.[i] ?? 70,
            weatherCode: data.hourly.weather_code?.[i] ?? 1,
            isDay: hour >= 6 && hour < 18 ? 1 : 0
          });
        }
      }

      const dailyList = [];
      const dayNamesId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      if (data.daily?.time) {
        for (let d = 0; d < Math.min(7, data.daily.time.length); d++) {
          const dateObj = new Date(data.daily.time[d]);
          const dayName = d === 0
            ? (lang === 'id' ? 'Hari Ini' : 'Today')
            : (lang === 'id' ? dayNamesId[dateObj.getDay()] : dayNamesEn[dateObj.getDay()]);
          const code = data.daily.weather_code?.[d] ?? 1;
          dailyList.push({
            dateStr: data.daily.time[d],
            dayLabel: dayName,
            tempMin: data.daily.temperature_2m_min?.[d] ?? 24,
            tempMax: data.daily.temperature_2m_max?.[d] ?? 32,
            rainChance: data.daily.precipitation_probability_max?.[d] ?? 20,
            weatherCode: code,
            condition: interpretWeatherCode(code, 1, lang)
          });
        }
      }

      const sunriseStr = data.daily?.sunrise?.[0]?.slice(11, 16) || '05:48';
      const sunsetStr = data.daily?.sunset?.[0]?.slice(11, 16) || '17:54';

      const formatted = {
        city: city.name,
        province: city.province,
        lat: city.lat,
        lon: city.lon,
        elevation: data.elevation || 15,
        timezone: data.timezone,
        current: {
          temperature: data.current?.temperature_2m ?? 29.5,
          feelsLike: data.current?.apparent_temperature ?? 32.8,
          dewPoint: Math.round(((data.current?.temperature_2m ?? 29) - ((100 - (data.current?.relative_humidity_2m ?? 75)) / 5)) * 10) / 10,
          humidity: data.current?.relative_humidity_2m ?? 75,
          pressure: data.current?.pressure_msl ?? 1011.8,
          windSpeed: data.current?.wind_speed_10m ?? 13.5,
          windGusts: data.current?.wind_gusts_10m ?? 18.2,
          windDirection: data.current?.wind_direction_10m ?? 145,
          uvIndex: data.current?.uv_index ?? 5.5,
          rainRate: data.current?.precipitation ?? 0.0,
          cloudCover: data.current?.cloud_cover ?? 40,
          visibility: 10.0,
          pm25: 18.5,
          weatherCode: currentCode,
          isDay,
          condition: interpretWeatherCode(currentCode, isDay, lang),
          updatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        },
        solar: {
          sunrise: sunriseStr,
          sunset: sunsetStr,
          daylightHours: '12j 06m'
        },
        hourly: hourlyList.length > 0 ? hourlyList : generateFallbackWeatherData(city, lang).hourly,
        daily: dailyList.length > 0 ? dailyList : generateFallbackWeatherData(city, lang).daily
      };

      setWeatherData(formatted);
    } catch (err) {
      console.warn('Using fallback weather simulator:', err);
      setWeatherData(generateFallbackWeatherData(city, lang));
    } finally {
      setIsRefreshing(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity, fetchWeatherData]);

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const res = await fetch('/api/telemetry');
        const json = await res.json();
        if (json.success && json.history) {
          setTelemetryLogs(json.history);
        }
      } catch (e) { /* silent */ }
    }
    loadTelemetry();
  }, []);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setTelemetryLogs((prev) => {
        const last = prev[0] || {
          temperature: 29.5, humidity: 74, pressure: 1011.5,
          windSpeed: 14.0, windDirection: 145, rainRate: 0.0,
          pm25: 20.0, batteryVoltage: 4.12
        };
        const newTemp = Math.round((last.temperature + (Math.random() - 0.49) * 0.4) * 10) / 10;
        const newHum = Math.min(98, Math.max(40, Math.round(last.humidity + (Math.random() - 0.5) * 1.5)));
        const newPres = Math.round((last.pressure + (Math.random() - 0.5) * 0.2) * 10) / 10;
        const newWind = Math.round((Math.max(1, last.windSpeed + (Math.random() - 0.5) * 1.8)) * 10) / 10;
        const newDir = Math.round((last.windDirection + (Math.random() - 0.5) * 12 + 360) % 360);
        const newRain = Math.max(0, Math.round((last.rainRate + (Math.random() > 0.85 ? (Math.random() - 0.4) * 0.5 : 0)) * 10) / 10);
        const newPM = Math.round((Math.max(5, last.pm25 + (Math.random() - 0.48) * 0.8)) * 10) / 10;
        const newBatt = Math.round((Math.max(3.6, last.batteryVoltage - 0.0001)) * 100) / 100;
        let status = 'NORMAL';
        if (newTemp > thresholds.maxTemp || newWind > thresholds.maxWind || newRain > thresholds.maxRain || newPM > thresholds.maxPM25) status = 'WARNING';
        const riskPrediction = newTemp >= 26.5 ? 'Tinggi' : (newTemp >= 25.0 ? 'Sedang' : 'Rendah');
        const newPacket = {
          id: (prev[0]?.id || 0) + 1, stationId: 'ESP32-WX-CAPSTONE',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          temperature: newTemp, humidity: newHum, pressure: newPres,
          windSpeed: newWind, windDirection: newDir, rainRate: newRain,
          pm25: newPM, batteryVoltage: newBatt, status, riskPrediction
        };
        if (activeMode === 'iot') {
          setWeatherData((prevW) => {
            if (!prevW) return prevW;
            return {
              ...prevW,
              city: 'Stasiun IoT ESP32 (Laboratorium)',
              province: 'Hardware Sensor Node',
              current: { ...prevW.current, temperature: newTemp, humidity: newHum, pressure: newPres, windSpeed: newWind, windDirection: newDir, rainRate: newRain, pm25: newPM, batteryVoltage: newBatt, stationId: 'ESP32-NODE-01', riskPrediction, updatedAt: newPacket.timestamp }
            };
          });
        }
        return [newPacket, ...prev.slice(0, 49)];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isStreaming, activeMode, thresholds]);

  useEffect(() => {
    if (!weatherData) return;
    const cur = weatherData.current;
    const activeAlerts = [];
    if (cur.temperature > thresholds.maxTemp) activeAlerts.push({ title: lang === 'id' ? 'Suhu Udara Ekstrem' : 'Extreme Heat Alert', message: lang === 'id' ? `Suhu terukur ${cur.temperature}Â°C melampaui batas aman (${thresholds.maxTemp}Â°C).` : `Temperature reached ${cur.temperature}Â°C.`, level: 'SIAGA SUHU' });
    if (cur.windSpeed > thresholds.maxWind) activeAlerts.push({ title: lang === 'id' ? 'Peringatan Angin Kencang' : 'High Wind Warning', message: lang === 'id' ? `Kecepatan angin ${cur.windSpeed} km/h berisiko tinggi.` : `Wind gusts at ${cur.windSpeed} km/h.`, level: 'WASPADA ANGIN' });
    if (cur.rainRate > thresholds.maxRain) activeAlerts.push({ title: lang === 'id' ? 'Peringatan Hujan Lebat' : 'Heavy Rain Warning', message: lang === 'id' ? `Intensitas hujan ${cur.rainRate} mm/jam.` : `Precipitation: ${cur.rainRate} mm/h.`, level: 'SIAGA BANJIR' });
    if (cur.weatherCode >= 95) activeAlerts.push({ title: lang === 'id' ? 'Peringatan Badai Petir' : 'Thunderstorm Alert', message: lang === 'id' ? 'Aktivitas petir terdeteksi.' : 'Lightning activity detected.', level: 'AWAS PETIR' });
    setAlerts(activeAlerts);
  }, [weatherData, thresholds, lang]);

  const handleInjectAnomaly = () => {
    setTelemetryLogs((prev) => {
      const anomalyPacket = { id: (prev[0]?.id || 0) + 1, stationId: 'ESP32-WX-CAPSTONE', timestamp: new Date().toLocaleTimeString('id-ID'), temperature: 23.4, humidity: 97, pressure: 1002.4, windSpeed: 52.8, windDirection: 215, rainRate: 34.6, pm25: 88.0, batteryVoltage: 3.98, status: 'CRITICAL' };
      if (activeMode === 'iot') {
        setWeatherData((prevW) => ({ ...prevW, current: { ...prevW.current, temperature: 23.4, humidity: 97, pressure: 1002.4, windSpeed: 52.8, windDirection: 215, rainRate: 34.6, pm25: 88.0, weatherCode: 95, condition: interpretWeatherCode(95, 1, lang), updatedAt: anomalyPacket.timestamp } }));
      }
      return [anomalyPacket, ...prev];
    });
  };

  const weatherType = weatherData?.current?.condition?.type || 'clear';
  const isDay = weatherData?.current?.isDay ?? 1;

  return (
    <div className="app-container">
      {/* Atmospheric animated background */}
      <WeatherCanvas weatherType={weatherType} isDay={isDay} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* OS Window Chrome bar */}
        <WindowChrome />

        {/* Top Navigation Bar */}
        <TopNavbar
          activeMode={activeMode}
          onInjectAnomaly={handleInjectAnomaly}
          onOpenThresholdModal={() => setIsThresholdModalOpen(true)}
          alertCount={alerts.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Alert Banner (only when alerts exist) */}
        {alerts.length > 0 && (
          <AlertBanner
            alerts={alerts}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
          />
        )}

        {/* Main Layout: Sidebar + Content Area */}
        <div className="app-layout-wrapper">
          {/* Left Sidebar: Mode toggle, Nav, Active Stations */}
          <Sidebar
            activeMode={activeMode}
            onChangeMode={(mode) => {
              setActiveMode(mode);
              if (mode === 'meteo') fetchWeatherData(selectedCity);
            }}
            selectedCity={selectedCity}
            onSelectCity={(city) => {
              setActiveMode('meteo');
              setSelectedCity(city);
            }}
            onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
            activeNav={activeNav}
            onSelectNav={setActiveNav}
          />

          {/* Main Content Area */}
          <main className="dashboard-main-area">
            {/* Row 1: 3 Parameter Stat Cards + 1 Purple Hero Action Card */}
            <TopHeroCards
              weatherData={weatherData}
              unit={unit}
              onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
              onOpenThresholdModal={() => setIsThresholdModalOpen(true)}
              onInjectAnomaly={handleInjectAnomaly}
              lang={lang}
            />

            {/* Row 2: Active Station Big Panel (big temp + solar slider) */}
            <ActiveStationHero
              weatherData={weatherData}
              activeMode={activeMode}
              unit={unit}
              onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
              onRefresh={() => fetchWeatherData(selectedCity)}
              isRefreshing={isRefreshing}
              onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
              lang={lang}
            />

            {/* Row 3: Bottom 4-column Metric Boxes */}
            <BottomMetricsRow weatherData={weatherData} lang={lang} />

            {/* Row 4: Live IoT Telemetry Log Table */}
            <TelemetryLogsTable
              logs={telemetryLogs}
              isStreaming={isStreaming}
              onToggleStreaming={() => setIsStreaming(!isStreaming)}
              onInjectAnomaly={handleInjectAnomaly}
              lang={lang}
            />
          </main>
        </div>
      </div>

      {/* Modals */}
      <HardwareModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        lang={lang}
      />
      <ThresholdModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        thresholds={thresholds}
        onSaveThresholds={setThresholds}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        lang={lang}
      />
    </div>
  );
}
