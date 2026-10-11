// Indonesian & Global reference cities for Weather Monitoring
export const POPULAR_CITIES = [
  { id: 'jkt', name: 'Jakarta', province: 'DKI Jakarta', lat: -6.2088, lon: 106.8456, timezone: 'Asia/Jakarta' },
  { id: 'bdg', name: 'Bandung', province: 'Jawa Barat', lat: -6.9175, lon: 107.6191, timezone: 'Asia/Jakarta' },
  { id: 'sby', name: 'Surabaya', province: 'Jawa Timur', lat: -7.2575, lon: 112.7521, timezone: 'Asia/Jakarta' },
  { id: 'smg', name: 'Semarang', province: 'Jawa Tengah', lat: -6.9667, lon: 110.4167, timezone: 'Asia/Jakarta' },
  { id: 'jog', name: 'Yogyakarta', province: 'D.I. Yogyakarta', lat: -7.7956, lon: 110.3695, timezone: 'Asia/Jakarta' },
  { id: 'dps', name: 'Denpasar', province: 'Bali', lat: -8.6705, lon: 115.2126, timezone: 'Asia/Makassar' },
  { id: 'mdn', name: 'Medan', province: 'Sumatera Utara', lat: 3.5952, lon: 98.6722, timezone: 'Asia/Jakarta' },
  { id: 'mks', name: 'Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lon: 119.4327, timezone: 'Asia/Makassar' },
  { id: 'bpn', name: 'Balikpapan', province: 'Kalimantan Timur', lat: -1.2379, lon: 116.8289, timezone: 'Asia/Makassar' },
  { id: 'plm', name: 'Palembang', province: 'Sumatera Selatan', lat: -2.9761, lon: 104.7754, timezone: 'Asia/Jakarta' },
  { id: 'mnd', name: 'Manado', province: 'Sulawesi Utara', lat: 1.4748, lon: 124.8428, timezone: 'Asia/Makassar' },
  { id: 'jyp', name: 'Jayapura', province: 'Papua', lat: -2.5337, lon: 140.7181, timezone: 'Asia/Jayapura' },
  { id: 'sin', name: 'Singapura', province: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  { id: 'tyo', name: 'Tokyo', province: 'Japan', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' }
];

// WMO Weather Interpretation Codes (WW)
export function interpretWeatherCode(code, isDay = 1, lang = 'id') {
  const dictionary = {
    0: {
      id: isDay ? 'Cerah Terik' : 'Cerah Berbintang',
      en: isDay ? 'Clear Sky' : 'Clear Night',
      type: 'clear',
      icon: isDay ? 'Sun' : 'Moon'
    },
    1: {
      id: 'Umumnya Cerah',
      en: 'Mainly Clear',
      type: 'clear',
      icon: isDay ? 'SunMedium' : 'Moon'
    },
    2: {
      id: 'Sebagian Berawan',
      en: 'Partly Cloudy',
      type: 'clouds',
      icon: 'CloudSun'
    },
    3: {
      id: 'Mendung Berawan Tebal',
      en: 'Overcast',
      type: 'clouds',
      icon: 'Cloud'
    },
    45: {
      id: 'Berkabut Tebal',
      en: 'Foggy',
      type: 'fog',
      icon: 'CloudFog'
    },
    48: {
      id: 'Kabut Rime Mengendap',
      en: 'Depositing Rime Fog',
      type: 'fog',
      icon: 'CloudFog'
    },
    51: {
      id: 'Gerimis Ringan',
      en: 'Light Drizzle',
      type: 'rain',
      icon: 'CloudDrizzle'
    },
    53: {
      id: 'Gerimis Sedang',
      en: 'Moderate Drizzle',
      type: 'rain',
      icon: 'CloudDrizzle'
    },
    55: {
      id: 'Gerimis Lebat',
      en: 'Dense Drizzle',
      type: 'rain',
      icon: 'CloudRain'
    },
    61: {
      id: 'Hujan Ringan',
      en: 'Slight Rain',
      type: 'rain',
      icon: 'CloudRain'
    },
    63: {
      id: 'Hujan Sedang',
      en: 'Moderate Rain',
      type: 'rain',
      icon: 'CloudRain'
    },
    65: {
      id: 'Hujan Lebat Deras',
      en: 'Heavy Rain',
      type: 'rain',
      icon: 'CloudRain'
    },
    80: {
      id: 'Hujan Rintik Terputus',
      en: 'Slight Rain Showers',
      type: 'rain',
      icon: 'CloudRain'
    },
    81: {
      id: 'Hujan Deras Lokal',
      en: 'Moderate Rain Showers',
      type: 'rain',
      icon: 'CloudRain'
    },
    82: {
      id: 'Hujan Badai Sangat Lebat',
      en: 'Violent Rain Showers',
      type: 'rain',
      icon: 'CloudRain'
    },
    95: {
      id: 'Badai Petir Guruh',
      en: 'Thunderstorm',
      type: 'thunder',
      icon: 'CloudLightning'
    },
    96: {
      id: 'Badai Petir & Hujan Es Ringan',
      en: 'Thunderstorm with Slight Hail',
      type: 'thunder',
      icon: 'CloudLightning'
    },
    99: {
      id: 'Badai Petir Ekstrem & Hujan Es',
      en: 'Thunderstorm with Heavy Hail',
      type: 'thunder',
      icon: 'CloudLightning'
    }
  };

  const item = dictionary[code] || {
    id: 'Berawan Ringan',
    en: 'Scattered Clouds',
    type: 'clouds',
    icon: 'Cloud'
  };

  return {
    description: lang === 'id' ? item.id : item.en,
    type: item.type,
    icon: item.icon
  };
}

// Convert degrees to Compass Heading
export function getWindDirectionLabel(deg, lang = 'id') {
  const directionsId = ['U (Utara)', 'TL (Timur Laut)', 'T (Timur)', 'TG (Tenggara)', 'S (Selatan)', 'BD (Barat Daya)', 'B (Barat)', 'BL (Barat Laut)'];
  const directionsEn = ['N (North)', 'NE (North East)', 'E (East)', 'SE (South East)', 'S (South)', 'SW (South West)', 'W (West)', 'NW (North West)'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return lang === 'id' ? directionsId[index] : directionsEn[index];
}

// Beaufort wind scale classification
export function getBeaufortScale(speedKmh, lang = 'id') {
  if (speedKmh < 1) return { level: 0, text: lang === 'id' ? 'Tenang' : 'Calm' };
  if (speedKmh <= 5) return { level: 1, text: lang === 'id' ? 'Udara Tenang' : 'Light Air' };
  if (speedKmh <= 11) return { level: 2, text: lang === 'id' ? 'Semilir Lemah' : 'Light Breeze' };
  if (speedKmh <= 19) return { level: 3, text: lang === 'id' ? 'Semilir Lembut' : 'Gentle Breeze' };
  if (speedKmh <= 28) return { level: 4, text: lang === 'id' ? 'Semilir Sedang' : 'Moderate Breeze' };
  if (speedKmh <= 38) return { level: 5, text: lang === 'id' ? 'Semilir Segar' : 'Fresh Breeze' };
  if (speedKmh <= 49) return { level: 6, text: lang === 'id' ? 'Angin Kuat' : 'Strong Breeze' };
  if (speedKmh <= 61) return { level: 7, text: lang === 'id' ? 'Dekat Badai' : 'Near Gale' };
  return { level: 8, text: lang === 'id' ? 'Badai Angin Kencang' : 'Gale / Storm' };
}

// AQI Classification
export function getAQIStatus(pm25, lang = 'id') {
  if (pm25 <= 12) {
    return {
      index: Math.round(pm25 * 4.1),
      label: lang === 'id' ? 'Sangat Baik (Aman)' : 'Good (Clean)',
      color: '#10b981',
      advice: lang === 'id' ? 'Kualitas udara sangat bersih dan segar untuk seluruh aktivitas luar ruangan.' : 'Air quality is satisfactory and poses little or no risk.'
    };
  } else if (pm25 <= 35.4) {
    return {
      index: Math.round(50 + ((pm25 - 12.1) / (35.4 - 12.1)) * 50),
      label: lang === 'id' ? 'Sedang (Moderat)' : 'Moderate',
      color: '#f59e0b',
      advice: lang === 'id' ? 'Kualitas udara dapat diterima. Individu yang sangat sensitif disarankan membatasi aktivitas berat.' : 'Acceptable quality. Sensitive individuals should consider limiting prolonged outdoor exertion.'
    };
  } else if (pm25 <= 55.4) {
    return {
      index: Math.round(101 + ((pm25 - 35.5) / (55.4 - 35.5)) * 49),
      label: lang === 'id' ? 'Tidak Sehat Sensitif' : 'Unhealthy for Sensitive',
      color: '#f97316',
      advice: lang === 'id' ? 'Kelompok sensitif (anak-anak, lansia, asma) sebaiknya memakai masker di luar ruangan.' : 'Members of sensitive groups may experience health effects.'
    };
  } else if (pm25 <= 150.4) {
    return {
      index: Math.round(151 + ((pm25 - 55.5) / (150.4 - 55.5)) * 49),
      label: lang === 'id' ? 'Tidak Sehat' : 'Unhealthy',
      color: '#ef4444',
      advice: lang === 'id' ? 'Setiap orang mulai merasakan dampak kesehatan; gunakan masker pelindung HEPA.' : 'Everyone may begin to experience health effects.'
    };
  } else {
    return {
      index: 250,
      label: lang === 'id' ? 'Berbahaya' : 'Hazardous',
      color: '#881337',
      advice: lang === 'id' ? 'Peringatan darurat kesehatan! Hindari seluruh aktivitas di luar ruangan.' : 'Health alert: serious risk of respiratory illness.'
    };
  }
}

// UV Index Status
export function getUVStatus(uv, lang = 'id') {
  if (uv <= 2) {
    return {
      level: lang === 'id' ? 'Rendah' : 'Low',
      color: '#10b981',
      advice: lang === 'id' ? 'Tidak memerlukan proteksi khusus.' : 'Minimal danger for the average person.'
    };
  } else if (uv <= 5) {
    return {
      level: lang === 'id' ? 'Sedang' : 'Moderate',
      color: '#f59e0b',
      advice: lang === 'id' ? 'Gunakan topi dan kacamata hitam di siang hari.' : 'Wear sunglasses and use sunscreen SPF 30+.'
    };
  } else if (uv <= 7) {
    return {
      level: lang === 'id' ? 'Tinggi' : 'High',
      color: '#f97316',
      advice: lang === 'id' ? 'Perlindungan ekstra: tabir surya & pakaian tertutup dianjurkan.' : 'Cover up, wear hat and apply sunscreen.'
    };
  } else if (uv <= 10) {
    return {
      level: lang === 'id' ? 'Sangat Tinggi' : 'Very High',
      color: '#ef4444',
      advice: lang === 'id' ? 'Kurangi paparan sinar matahari antara pukul 10:00 - 15:00.' : 'Minimize sun exposure between 10 AM - 4 PM.'
    };
  } else {
    return {
      level: lang === 'id' ? 'Ekstrem' : 'Extreme',
      color: '#7c3aed',
      advice: lang === 'id' ? 'Hindari paparan sinar langsung tanpa proteksi ketat!' : 'Take all precautions; unprotected skin can burn in minutes.'
    };
  }
}

// Complete realistic fallback data generator in case API is offline
export function generateFallbackWeatherData(city = POPULAR_CITIES[0], lang = 'id') {
  const now = new Date();
  const currentHour = now.getHours();
  const isDay = currentHour >= 6 && currentHour < 18 ? 1 : 0;

  // Hourly 24h
  const hourly = [];
  for (let i = 0; i < 24; i++) {
    const hourTime = (currentHour + i) % 24;
    const hourIsDay = hourTime >= 6 && hourTime < 18 ? 1 : 0;
    const baseTemp = 27 + Math.sin((hourTime - 6) * Math.PI / 12) * 5.2;
    const rainProb = Math.max(0, Math.min(100, Math.round(30 + Math.sin(i * 0.7) * 40)));
    const wind = Math.round((10 + Math.sin(i * 0.5) * 6) * 10) / 10;
    const hum = Math.round(85 - Math.sin((hourTime - 6) * Math.PI / 12) * 20);

    hourly.push({
      time: `${String(hourTime).padStart(2, '0')}:00`,
      hour: hourTime,
      temperature: Math.round(baseTemp * 10) / 10,
      rainProbability: rainProb,
      windSpeed: wind,
      humidity: hum,
      weatherCode: rainProb > 65 ? 61 : rainProb > 40 ? 2 : 1,
      isDay: hourIsDay
    });
  }

  // 7 Days
  const daily = [];
  const dayNamesId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let d = 0; d < 7; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const dayOfWeek = date.getDay();
    const dayLabel = d === 0 ? (lang === 'id' ? 'Hari Ini' : 'Today') : (lang === 'id' ? dayNamesId[dayOfWeek] : dayNamesEn[dayOfWeek]);
    const minT = Math.round((23.5 + Math.random() * 1.5) * 10) / 10;
    const maxT = Math.round((31.5 + Math.random() * 2.5) * 10) / 10;
    const rainChance = Math.round(20 + Math.random() * 65);
    const code = rainChance > 70 ? 95 : rainChance > 50 ? 61 : rainChance > 30 ? 2 : 0;

    daily.push({
      dateStr: date.toISOString().split('T')[0],
      dayLabel,
      tempMin: minT,
      tempMax: maxT,
      rainChance,
      weatherCode: code,
      condition: interpretWeatherCode(code, 1, lang)
    });
  }

  const currentWeatherCode = 2; // Partly cloudy
  return {
    city: city.name,
    province: city.province,
    lat: city.lat,
    lon: city.lon,
    elevation: 15,
    timezone: city.timezone,
    current: {
      temperature: 29.8,
      feelsLike: 33.4,
      dewPoint: 24.2,
      humidity: 74,
      pressure: 1011.6,
      windSpeed: 14.8,
      windGusts: 22.4,
      windDirection: 145,
      uvIndex: isDay ? 6.8 : 0.0,
      rainRate: 0.0,
      cloudCover: 45,
      visibility: 9.8, // km
      pm25: 19.5,
      weatherCode: currentWeatherCode,
      isDay,
      condition: interpretWeatherCode(currentWeatherCode, isDay, lang),
      updatedAt: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    },
    solar: {
      sunrise: '05:48',
      sunset: '17:52',
      solarNoon: '11:50',
      daylightHours: '12j 04m'
    },
    hourly,
    daily
  };
}
