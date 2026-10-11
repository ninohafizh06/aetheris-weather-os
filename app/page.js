'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import WeatherCanvas from '../components/WeatherCanvas';
import AlertBanner from '../components/AlertBanner';
import CurrentWeatherCard from '../components/CurrentWeatherCard';
import MetricsGrid from '../components/MetricsGrid';
import SolarCycleCard from '../components/SolarCycleCard';
import HourlyForecastChart from '../components/HourlyForecastChart';
import DailyForecastList from '../components/DailyForecastList';
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

      // Format 24-hr hourly
      const hourlyList = [];
      const nowHour = new Date().getHours();
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

      // Format 7-day daily
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

  // Initial load
  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity, fetchWeatherData]);

  // Fetch initial telemetry logs from /api/telemetry
  useEffect(() => {
    async function loadTelemetry() {
      try {
        const res = await fetch('/api/telemetry');
        const json = await res.json();
        if (json.success && json.history) {
          setTelemetryLogs(json.history);
        }
      } catch (e) {
        // Fallback default logs
      }
    }
    loadTelemetry();
  }, []);

  // IoT Live Telemetry Stream Interval
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setTelemetryLogs((prev) => {
        const last = prev[0] || {
          temperature: 29.5,
          humidity: 74,
          pressure: 1011.5,
          windSpeed: 14.0,
          windDirection: 145,
          rainRate: 0.0,
          pm25: 20.0,
          batteryVoltage: 4.12
        };

        // Realistic subtle micro-variations
        const newTemp = Math.round((last.temperature + (Math.random() - 0.49) * 0.4) * 10) / 10;
        const newHum = Math.min(98, Math.max(40, Math.round(last.humidity + (Math.random() - 0.5) * 1.5)));
        const newPres = Math.round((last.pressure + (Math.random() - 0.5) * 0.2) * 10) / 10;
        const newWind = Math.round((Math.max(1, last.windSpeed + (Math.random() - 0.5) * 1.8)) * 10) / 10;
        const newDir = Math.round((last.windDirection + (Math.random() - 0.5) * 12 + 360) % 360);
        const newRain = Math.max(0, Math.round((last.rainRate + (Math.random() > 0.85 ? (Math.random() - 0.4) * 0.5 : 0)) * 10) / 10);
        const newPM = Math.round((Math.max(5, last.pm25 + (Math.random() - 0.48) * 0.8)) * 10) / 10;
        const newBatt = Math.round((Math.max(3.6, last.batteryVoltage - 0.0001)) * 100) / 100;

        let status = 'NORMAL';
        if (newTemp > thresholds.maxTemp || newWind > thresholds.maxWind || newRain > thresholds.maxRain || newPM > thresholds.maxPM25) {
          status = 'WARNING';
        }

        const newPacket = {
          id: (prev[0]?.id || 0) + 1,
          stationId: 'ESP32-WX-CAPSTONE',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          temperature: newTemp,
          humidity: newHum,
          pressure: newPres,
          windSpeed: newWind,
          windDirection: newDir,
          rainRate: newRain,
          pm25: newPM,
          batteryVoltage: newBatt,
          status
        };

        // If in IoT Mode, update the main current card view too!
        if (activeMode === 'iot') {
          setWeatherData((prevW) => {
            if (!prevW) return prevW;
            return {
              ...prevW,
              city: 'Stasiun IoT ESP32 (Laboratorium)',
              province: 'Hardware Sensor Node',
              current: {
                ...prevW.current,
                temperature: newTemp,
                humidity: newHum,
                pressure: newPres,
                windSpeed: newWind,
                windDirection: newDir,
                rainRate: newRain,
                pm25: newPM,
                batteryVoltage: newBatt,
                stationId: 'ESP32-NODE-01',
                updatedAt: newPacket.timestamp
              }
            };
          });
        }

        return [newPacket, ...prev.slice(0, 49)];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isStreaming, activeMode, thresholds]);

  // Check and update alerts
  useEffect(() => {
    if (!weatherData) return;
    const cur = weatherData.current;
    const activeAlerts = [];

    if (cur.temperature > thresholds.maxTemp) {
      activeAlerts.push({
        title: lang === 'id' ? 'Suhu Udara Ekstrem' : 'Extreme Heat Alert',
        message: lang === 'id' ? `Suhu terukur ${cur.temperature}°C melampaui batas aman (${thresholds.maxTemp}°C). Bahaya dehidrasi.` : `Temperature reached ${cur.temperature}°C, exceeding limit.`,
        level: 'SIAGA SUHU'
      });
    }

    if (cur.windSpeed > thresholds.maxWind) {
      activeAlerts.push({
        title: lang === 'id' ? 'Peringatan Angin Kencang' : 'High Wind Warning',
        message: lang === 'id' ? `Kecepatan angin ${cur.windSpeed} km/h berisiko menerbangkan benda ringan.` : `Wind gusts at ${cur.windSpeed} km/h detected.`,
        level: 'WASPADA ANGIN'
      });
    }

    if (cur.rainRate > thresholds.maxRain) {
      activeAlerts.push({
        title: lang === 'id' ? 'Peringatan Hujan Lebat' : 'Heavy Rain Warning',
        message: lang === 'id' ? `Intensitas hujan ${cur.rainRate} mm/jam berpotensi menyebabkan genangan air.` : `Heavy precipitation detected: ${cur.rainRate} mm/h.`,
        level: 'SIAGA BANJIR'
      });
    }

    if (cur.weatherCode >= 95) {
      activeAlerts.push({
        title: lang === 'id' ? 'Peringatan Badai Petir' : 'Thunderstorm Alert',
        message: lang === 'id' ? 'Aktivitas petir dan kilat terdeteksi di sekitar stasiun pemantau.' : 'Lightning activity detected.',
        level: 'AWAS PETIR'
      });
    }

    setAlerts(activeAlerts);
  }, [weatherData, thresholds, lang]);

  // Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'id' ? 'Geolokasi tidak didukung oleh browser Anda' : 'Geolocation is not supported');
      return;
    }
    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const customLoc = {
          id: 'user-loc',
          name: lang === 'id' ? 'Lokasi Perangkat Anda' : 'Your Device Location',
          province: 'GPS Koordinator',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timezone: 'auto'
        };
        setSelectedCity(customLoc);
        setIsGeoLoading(false);
      },
      () => {
        alert(lang === 'id' ? 'Gagal mendapatkan izin GPS' : 'Failed to retrieve GPS location');
        setIsGeoLoading(false);
      }
    );
  };

  // Anomaly Injection button action
  const handleInjectAnomaly = () => {
    setTelemetryLogs((prev) => {
      const anomalyPacket = {
        id: (prev[0]?.id || 0) + 1,
        stationId: 'ESP32-WX-CAPSTONE',
        timestamp: new Date().toLocaleTimeString('id-ID'),
        temperature: 23.4,
        humidity: 97,
        pressure: 1002.4,
        windSpeed: 52.8,
        windDirection: 215,
        rainRate: 34.6,
        pm25: 88.0,
        batteryVoltage: 3.98,
        status: 'CRITICAL'
      };

      if (activeMode === 'iot') {
        setWeatherData((prevW) => ({
          ...prevW,
          current: {
            ...prevW.current,
            temperature: 23.4,
            humidity: 97,
            pressure: 1002.4,
            windSpeed: 52.8,
            windDirection: 215,
            rainRate: 34.6,
            pm25: 88.0,
            weatherCode: 95,
            condition: interpretWeatherCode(95, 1, lang),
            updatedAt: anomalyPacket.timestamp
          }
        }));
      }

      return [anomalyPacket, ...prev];
    });
  };

  const weatherType = weatherData?.current?.condition?.type || 'clear';
  const isDay = weatherData?.current?.isDay ?? 1;

  return (
    <div className="app-container">
      {/* Background Animated Atmosphere */}
      <WeatherCanvas weatherType={weatherType} isDay={isDay} />

      <main className="dashboard-content-layer">
        {/* Header Navigation & Global Controls */}
        <Header
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          onUseCurrentLocation={handleUseCurrentLocation}
          isGeoLoading={isGeoLoading}
          activeMode={activeMode}
          onChangeMode={(mode) => {
            setActiveMode(mode);
            if (mode === 'meteo') {
              fetchWeatherData(selectedCity);
            }
          }}
          unit={unit}
          onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
          lang={lang}
          onToggleLang={() => setLang(lang === 'id' ? 'en' : 'id')}
          onRefresh={() => fetchWeatherData(selectedCity)}
          isRefreshing={isRefreshing}
          onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
          onOpenThresholdModal={() => setIsThresholdModalOpen(true)}
        />

        {/* Dynamic Warning Alert Banner */}
        <AlertBanner
          alerts={alerts}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />

        {/* Primary Dashboard Grid: Left Column (Hero & Solar) + Right Column (Metrics, Chart, Daily) */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="column-stack">
            <CurrentWeatherCard
              weatherData={weatherData}
              unit={unit}
              activeMode={activeMode}
              lang={lang}
            />

            <SolarCycleCard
              solarData={weatherData?.solar}
              lang={lang}
            />
          </div>

          {/* Right Column */}
          <div className="column-stack">
            <MetricsGrid
              weatherData={weatherData}
              lang={lang}
            />

            <HourlyForecastChart
              hourly={weatherData?.hourly}
              unit={unit}
              lang={lang}
            />

            <DailyForecastList
              daily={weatherData?.daily}
              unit={unit}
              lang={lang}
            />
          </div>
        </div>

        {/* Live IoT Sensor Telemetry Logs & Export Table */}
        <TelemetryLogsTable
          logs={telemetryLogs}
          isStreaming={isStreaming}
          onToggleStreaming={() => setIsStreaming(!isStreaming)}
          onInjectAnomaly={handleInjectAnomaly}
          lang={lang}
        />
      </main>

      {/* Hardware Documentation & ESP32 Code Modal */}
      <HardwareModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        lang={lang}
      />

      {/* Threshold Alarms Settings Modal */}
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
