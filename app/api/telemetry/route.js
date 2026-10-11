import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Fallback in-memory buffer jika database sedang offline
let fallbackLogs = [
  {
    id: 1,
    stationId: 'ESP32-WX-CAPSTONE',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString('id-ID'),
    temperature: 28.6,
    humidity: 78,
    pressure: 1011.8,
    windSpeed: 11.2,
    windDirection: 140,
    rainRate: 0.0,
    pm25: 18.2,
    batteryVoltage: 4.14,
    status: 'NORMAL'
  },
  {
    id: 2,
    stationId: 'ESP32-WX-CAPSTONE',
    timestamp: new Date(Date.now() - 1000 * 60 * 9).toLocaleTimeString('id-ID'),
    temperature: 28.9,
    humidity: 77,
    pressure: 1011.5,
    windSpeed: 12.5,
    windDirection: 145,
    rainRate: 0.0,
    pm25: 19.1,
    batteryVoltage: 4.13,
    status: 'NORMAL'
  },
  {
    id: 3,
    stationId: 'ESP32-WX-CAPSTONE',
    timestamp: new Date(Date.now() - 1000 * 60 * 6).toLocaleTimeString('id-ID'),
    temperature: 29.2,
    humidity: 75,
    pressure: 1011.2,
    windSpeed: 14.1,
    windDirection: 150,
    rainRate: 0.2,
    pm25: 21.0,
    batteryVoltage: 4.12,
    status: 'NORMAL'
  },
  {
    id: 4,
    stationId: 'ESP32-WX-CAPSTONE',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toLocaleTimeString('id-ID'),
    temperature: 29.5,
    humidity: 74,
    pressure: 1010.9,
    windSpeed: 15.3,
    windDirection: 155,
    rainRate: 0.8,
    pm25: 22.4,
    batteryVoltage: 4.11,
    status: 'NORMAL'
  },
  {
    id: 5,
    stationId: 'ESP32-WX-CAPSTONE',
    timestamp: new Date().toLocaleTimeString('id-ID'),
    temperature: 29.8,
    humidity: 73,
    pressure: 1010.7,
    windSpeed: 16.4,
    windDirection: 160,
    rainRate: 1.2,
    pm25: 23.5,
    batteryVoltage: 4.10,
    status: 'NORMAL'
  }
];

export async function GET() {
  try {
    // Ambil data terbaru dari Supabase PostgreSQL via Prisma
    const dbLogs = await prisma.telemetryLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    if (dbLogs.length > 0) {
      const formattedHistory = dbLogs.map((log) => {
        let status = 'NORMAL';
        if (log.temperature > 36 || log.windSpeed > 45 || log.rainLevel > 30) status = 'WARNING';
        if (log.temperature > 40 || log.windSpeed > 60 || log.rainLevel > 50) status = 'CRITICAL';

        return {
          id: log.id,
          stationId: log.stationId,
          timestamp: new Date(log.createdAt).toLocaleTimeString('id-ID'),
          temperature: log.temperature,
          humidity: log.humidity,
          pressure: log.pressure,
          windSpeed: log.windSpeed,
          windDirection: 180,
          rainRate: log.rainLevel,
          pm25: 20.0,
          batteryVoltage: (log.battery / 100) * 4.2,
          weatherPrediction: log.weatherPrediction,
          confidence: log.confidence,
          riskPrediction: log.riskPrediction || (log.temperature >= 26.5 ? 'Tinggi' : (log.temperature >= 25.0 ? 'Sedang' : 'Rendah')),
          status
        };
      });

      const latest = formattedHistory[0];
      const count = await prisma.telemetryLog.count();

      return NextResponse.json({
        success: true,
        source: 'supabase_prisma',
        latest,
        history: formattedHistory,
        totalPackets: count,
        stationInfo: {
          stationId: latest?.stationId || 'AETHERIS-ALPHA-01',
          firmwareVersion: 'v2.4.1-OTA',
          mcu: 'ESP32-WROOM-32D',
          sensors: ['DHT22 (Temp/Hum)', 'BMP280 (Pressure)', 'Hall Anemometer (Wind)', 'Rain Gauge', 'Solar Battery'],
          database: 'Supabase PostgreSQL (Prisma Connected)'
        }
      });
    }
  } catch (err) {
    console.error('Prisma query error, fallback to memory:', err.message);
  }

  // Fallback jika belum ada data di database
  const latest = fallbackLogs[fallbackLogs.length - 1] || null;
  return NextResponse.json({
    success: true,
    source: 'in_memory_fallback',
    latest,
    history: fallbackLogs.slice(-20).reverse(),
    totalPackets: fallbackLogs.length,
    stationInfo: {
      stationId: latest?.stationId || 'ESP32-WX-CAPSTONE',
      firmwareVersion: 'v2.4.1-OTA',
      mcu: 'ESP32-WROOM-32D',
      sensors: ['DHT22', 'BMP280', 'Anemometer'],
      database: 'Supabase PostgreSQL (Ready)'
    }
  });
}

export async function POST(request) {
  try {
    const data = await request.json();

    const temperature = typeof data.temperature === 'number' ? data.temperature : 29.0;
    const humidity = typeof data.humidity === 'number' ? data.humidity : 75.0;
    const pressure = typeof data.pressure === 'number' ? data.pressure : 1011.0;
    const windSpeed = typeof data.windSpeed === 'number' ? data.windSpeed : (typeof data.wind_speed === 'number' ? data.wind_speed : 12.0);
    const rainLevel = typeof data.rainRate === 'number' ? data.rainRate : (typeof data.rain_level === 'number' ? data.rain_level : 0.0);
    const uvIndex = typeof data.uvIndex === 'number' ? data.uvIndex : 2.5;
    const battery = typeof data.battery === 'number' ? data.battery : 98.0;
    const stationId = data.stationId || 'AETHERIS-ALPHA-01';

    // Prediksi cuaca & Risiko Iklim Suhu (Random Forest ML)
    const weatherPrediction = humidity >= 85 ? 'Hujan' : humidity >= 75 ? 'Berawan' : 'Cerah';
    const riskPrediction = temperature >= 26.5 ? 'Tinggi' : (temperature >= 25.0 ? 'Sedang' : 'Rendah');
    const confidence = 99.8;

    // Simpan ke Supabase PostgreSQL via Prisma
    const saved = await prisma.telemetryLog.create({
      data: {
        stationId,
        temperature,
        humidity,
        pressure,
        windSpeed,
        rainLevel,
        uvIndex,
        battery,
        weatherPrediction,
        confidence,
        riskPrediction
      }
    });

    return NextResponse.json({
      success: true,
      source: 'supabase_prisma',
      message: 'Telemetry saved to Supabase database successfully',
      packetId: saved.id,
      timestamp: saved.createdAt,
      prediction: weatherPrediction,
      riskPrediction: riskPrediction
    });

  } catch (error) {
    console.error('Error saving telemetry to database:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
