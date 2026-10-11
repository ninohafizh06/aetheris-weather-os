'use client';

import { useState } from 'react';
import { X, Check, Copy, Cpu, Terminal, Wifi, Cable } from 'lucide-react';

export default function HardwareModal({ isOpen, onClose, lang = 'id' }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const esp32Code = `/*
 * AETHERIS IoT Weather Station Node Firmware
 * Platform: ESP32 Dev Module (WROOM-32)
 * Capstone Project Weather Telemetry
 * Sensors: DHT22 (Temp & Hum), BMP280 (Pressure), Tipping Bucket Rain Gauge
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <Adafruit_BMP280.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
// Ganti dengan IP server Next.js Anda (cth: http://192.168.1.10:3000/api/telemetry)
const char* serverUrl = "http://localhost:3000/api/telemetry";

#define DHTPIN 4
#define DHTTYPE DHT22
#define RAIN_PIN 34
#define ANEMOMETER_PIN 35

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");

  dht.begin();
  if (!bmp.begin(0x76)) {
    Serial.println("BMP280 tidak terdeteksi!");
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    float pressure = bmp.readPressure() / 100.0F;
    float windSpeed = analogRead(ANEMOMETER_PIN) * (45.0 / 4095.0);
    float batteryV = 4.12;

    StaticJsonDocument<256> doc;
    doc["stationId"] = "ESP32-WX-CAPSTONE";
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["pressure"] = pressure;
    doc["windSpeed"] = windSpeed;
    doc["windDirection"] = 160;
    doc["rainRate"] = 0.0;
    doc["pm25"] = 18.5;
    doc["batteryVoltage"] = batteryV;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    http.end();
  }
  delay(5000); // Kirim paket setiap 5 detik
}`;

  const curlTest = `curl -X POST http://localhost:3000/api/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{"stationId":"ESP32-TEST","temperature":31.2,"humidity":68,"pressure":1011.5,"windSpeed":16.8,"windDirection":140,"rainRate":2.4,"pm25":24.5,"batteryVoltage":4.15}'`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(esp32Code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlTest);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Cpu size={20} color="var(--accent-cyan)" />
            <span>{lang === 'id' ? 'Integrasi Perangkat Keras ESP32 / Arduino' : 'ESP32 / Arduino Hardware Integration'}</span>
          </div>
          <button className="btn-glass" style={{ padding: '6px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {lang === 'id'
              ? 'Dashboard ini dilengkapi dengan REST API endpoint mandiri (/api/telemetry). Anda dapat mengunggah kode berikut ke mikrokontroler ESP32 atau Raspberry Pi Anda untuk mengirim telemetri sensor langsung ke dashboard ini secara nirkabel (Wi-Fi).'
              : 'This dashboard features a built-in REST API endpoint (/api/telemetry). Flash the sketch below to your ESP32 or Raspberry Pi to stream live telemetry packets directly.'}
          </p>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={14} color="#38bdf8" />
                <span>Test via cURL (Terminal)</span>
              </span>
              <button className="copy-btn" onClick={handleCopyCurl} style={{ position: 'static' }}>
                {copiedCurl ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                <span style={{ marginLeft: '4px' }}>{copiedCurl ? 'Tersalin' : 'Salin cURL'}</span>
              </button>
            </div>
            <div className="code-snippet-box">
              <code>{curlTest}</code>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cable size={14} color="#34d399" />
                <span>Firmware ESP32 C++ Arduino IDE</span>
              </span>
              <button className="copy-btn" onClick={handleCopyCode} style={{ position: 'static' }}>
                {copiedCode ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                <span style={{ marginLeft: '4px' }}>{copiedCode ? 'Tersalin' : 'Salin Kode C++'}</span>
              </button>
            </div>
            <div className="code-snippet-box" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              <pre>{esp32Code}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
