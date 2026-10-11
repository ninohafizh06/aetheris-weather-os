import './globals.css';

export const metadata = {
  title: 'AETHERIS Weather OS | Stasiun Cuaca Pintar & Monitoring IoT',
  description: 'Dashboard Pemantauan Cuaca Cerdas Real-time & Telemetri Sensor IoT untuk Analisis Meteorologi Komprehensif (Capstone Project)',
  keywords: 'monitoring cuaca, stasiun cuaca iot, esp32 weather station, open-meteo indonesia, dashboard cuaca nextjs',
  authors: [{ name: 'Capstone Engineering Team' }]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#070b14'
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
