# 🌤️ AETHERIS Weather OS — Dashboard Monitoring Cuaca & IoT Sensor
> **Tugas Akhir / Capstone Project**: Sistem Pemantauan Cuaca Cerdas Real-time & Telemetri Sensor Terpadu berbasis Next.js & ESP32.

---

## 🌟 Fitur Utama

1. **Dual-Mode Data Feeds**:
   - **Mode Stasiun BMKG / Open-Meteo**: Data cuaca langsung dari satelit & stasiun cuaca regional di seluruh kota Indonesia (Jakarta, Bandung, Surabaya, Medan, Denpasar, Makassar, dll.) dan global secara real-time.
   - **Mode Stasiun Cuaca IoT (ESP32)**: Streaming data telemetri real-time dari mikrokontroler (DHT22, BMP280, Anemometer, Rain Gauge, PMS5003).

2. **Visual & UI Aesthetics Glassmorphism**:
   - Dynamic Animated Atmosphere: Kanvas latar dinamis yang merespons cuaca langsung (hujan berpetir dengan kilat acak, kabut, partikel terik matahari, bintang malam).
   - Glassmorphism dark-mode bertaraf industri dengan aksen neon cyan, amber, dan emerald.
   - Tipografi modern (*Plus Jakarta Sans* & *JetBrains Mono*).

3. **Indikator Metrik Cuaca Komprehensif (6 Parameter)**:
   - **Suhu Udara & Rentang Diurnal** (°C / °F) lengkap dengan *Feels Like* dan *Titik Embun (Dew Point)*.
   - **Kelembaban Relatif (%)** dengan level kenyamanan tropis (DHT22).
   - **Tekanan Barometrik (hPa)** dengan tren barometrik naik/turun (BMP280).
   - **Arah & Kecepatan Angin (km/h)** dilengkapi animasi jarum kompas berputar dan skala Beaufort.
   - **Indeks Kualitas Udara (AQI & PM2.5)** dengan panduan kesehatan WHO.
   - **Indeks Radiasi UV (0-11+)** beserta anjuran tabir surya SPF.
   - **Curah Hujan & Intensitas (mm/jam)** dengan sensor Tipping Bucket.

4. **Siklus Matahari & Efemeris (Solar Arc Tracker)**:
   - Visualisasi lintasan orbit matahari berbentuk busur dengan pelacakan waktu nyata (Terbit, Zenith, Terbenam).

5. **Grafik Interaktif 24 Jam**:
   - Kurva spline SVG resolusi tinggi dengan gradien bercahaya.
   - Tab parameter interaktif: *Suhu*, *Peluang Hujan*, *Kecepatan Angin*, dan *Kelembaban*.
   - Kursor inspeksi hover dengan nilai presisi.

6. **Prakiraan Cuaca 7 Hari**:
   - Batang spektrum suhu dinamis mingguan dan persentase peluang hujan.

7. **Sistem Peringatan Dini Cuaca Ekstrem (Early Warning Alert)**:
   - Banner peringatan visual + alarm suara (Web Audio API).
   - Modal konfigurasi batas alarm (*Threshold Settings*).

8. **Ekspor Data untuk Laporan Tugas Akhir / Skripsi**:
   - 1-Klik Unduh Log Sensor ke format **CSV** & **JSON** (siap dianalisis di Microsoft Excel atau Python / Pandas).
   - Fitur **Injeksi Anomali** untuk mendemonstrasikan respon sistem terhadap badai petir mendadak kepada penguji capstone.

9. **REST API Telemetri Mandiri (`/api/telemetry`)**:
   - Siap menerima `POST` request dari mikrokontroler ESP32, Arduino, Raspberry Pi, atau LoRaWAN Gateway.

---

## 🚀 Cara Menjalankan Project

### Opsi 1: 1-Klik Tanpa Membuka IDE (Paling Praktis)
Cukup **klik 2x (double-click)** pada file:
```text
JALANKAN_WEB.bat
```
*(Server akan otomatis berjalan dan browser akan langsung terbuka ke `http://localhost:3000`).*

### Opsi 2: Menggunakan Terminal Manual
```bash
npm run dev
```
Buka browser di: `http://localhost:3000`

---

## 📡 Integrasi Hardware ESP32 (REST API)

### 1. Endpoint URL
```http
POST http://<IP_KOMPUTER_ANDA>:3000/api/telemetry
Content-Type: application/json
```

### 2. Format JSON Payload:
```json
{
  "stationId": "ESP32-NODE-01",
  "temperature": 29.8,
  "humidity": 74,
  "pressure": 1011.5,
  "windSpeed": 14.5,
  "windDirection": 140,
  "rainRate": 1.2,
  "pm25": 19.5,
  "batteryVoltage": 4.12
}
```

### 3. Pengujian Cepat via cURL:
```bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{"stationId":"ESP32-TEST","temperature":31.2,"humidity":68,"pressure":1011.5,"windSpeed":16.8,"windDirection":140,"rainRate":2.4,"pm25":24.5,"batteryVoltage":4.15}'
```

---

## 📁 Struktur Direktori
```
d:/TUGAS CAPSTONE/
├── app/
│   ├── api/telemetry/route.js   # Next.js API Route untuk data sensor IoT
│   ├── globals.css              # Design system tokens & glassmorphism
│   ├── layout.js                # SEO, metadata & viewport
│   └── page.js                  # Main dashboard orchestration
├── components/
│   ├── AlertBanner.js           # Peringatan dini cuaca & buzzer
│   ├── CurrentWeatherCard.js    # Hero card temperatur & kondisi
│   ├── DailyForecastList.js     # Prakiraan cuaca 7 hari
│   ├── HardwareModal.js         # Kode C++ Arduino ESP32 & wiring
│   ├── Header.js                # Navigasi, ganti kota, mode, unit
│   ├── HourlyForecastChart.js   # Grafik kurva 24 jam SVG interaktif
│   ├── MetricsGrid.js           # 6 Kartu sensor meteorologi
│   ├── SolarCycleCard.js        # Busur orbit matahari & efemeris
│   ├── TelemetryLogsTable.js    # Tabel log telemetri & ekspor CSV/JSON
│   ├── ThresholdModal.js        # Konfigurasi batas alarm
│   └── WeatherCanvas.js         # Kanvas partikel cuaca dinamis
└── lib/
    └── weatherData.js           # Dataset kota Indonesia & utilitas cuaca
```
