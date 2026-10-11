import { NextResponse } from 'next/server';

// In-memory telemetry log buffer for IoT Capstone Station
let telemetryLogs = [
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
  const latest = telemetryLogs[telemetryLogs.length - 1] || null;
  return NextResponse.json({
    success: true,
    latest,
    history: telemetryLogs.slice(-20).reverse(),
    totalPackets: telemetryLogs.length,
    stationInfo: {
      stationId: latest?.stationId || 'ESP32-WX-CAPSTONE',
      firmwareVersion: 'v2.4.1-OTA',
      mcu: 'ESP32-WROOM-32D',
      sensors: ['DHT22 (Temp/Hum)', 'BMP280 (Pressure)', 'Hall Anemometer (Wind)', 'Tipping Bucket Rain Gauge', 'MQ-135 / PMS5003 (AQI)'],
      rssi: -64, // dBm
      uptimeMinutes: 412
    }
  });
}

export async function POST(request) {
  try {
    const data = await request.json();

    const timestamp = new Date().toLocaleTimeString('id-ID');
    const temperature = typeof data.temperature === 'number' ? data.temperature : 29.0;
    const humidity = typeof data.humidity === 'number' ? data.humidity : 75;
    const pressure = typeof data.pressure === 'number' ? data.pressure : 1011.0;
    const windSpeed = typeof data.windSpeed === 'number' ? data.windSpeed : 12.0;
    const windDirection = typeof data.windDirection === 'number' ? data.windDirection : 180;
    const rainRate = typeof data.rainRate === 'number' ? data.rainRate : 0.0;
    const pm25 = typeof data.pm25 === 'number' ? data.pm25 : 20.0;
    const batteryVoltage = typeof data.batteryVoltage === 'number' ? data.batteryVoltage : 4.1;
    const stationId = data.stationId || 'ESP32-WX-CUSTOM';

    let status = 'NORMAL';
    if (temperature > 36 || windSpeed > 45 || rainRate > 30 || pm25 > 100) {
      status = 'WARNING';
    }
    if (temperature > 40 || windSpeed > 60 || rainRate > 50 || pm25 > 250) {
      status = 'CRITICAL';
    }

    const newPacket = {
      id: telemetryLogs.length + 1,
      stationId,
      timestamp,
      temperature,
      humidity,
      pressure,
      windSpeed,
      windDirection,
      rainRate,
      pm25,
      batteryVoltage,
      status
    };

    telemetryLogs.push(newPacket);
    if (telemetryLogs.length > 200) {
      telemetryLogs.shift();
    }

    return NextResponse.json({
      success: true,
      message: 'Telemetry received successfully',
      packetId: newPacket.id,
      timestamp
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}
