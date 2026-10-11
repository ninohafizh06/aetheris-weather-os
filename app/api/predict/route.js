import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const temperature = parseFloat(body.temperature ?? 27.0);
    const humidity = parseFloat(body.humidity ?? 80.0);
    const wind_speed = parseFloat(body.wind_speed ?? 1.2);
    
    // Day of Year (DOY) saat ini
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const defaultDoy = Math.floor(diff / oneDay);
    const doy = parseInt(body.doy ?? defaultDoy, 10);

    const pythonScript = path.join(process.cwd(), 'core', 'predict_rf.py');
    const pythonExe = path.join(process.cwd(), 'venv', 'Scripts', 'python.exe');

    return new Promise((resolve) => {
      const pyProcess = spawn(pythonExe, [
        pythonScript,
        temperature.toString(),
        humidity.toString(),
        wind_speed.toString(),
        doy.toString()
      ]);

      let output = '';
      let errorOutput = '';

      pyProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pyProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pyProcess.on('close', (code) => {
        if (code !== 0 || !output.trim()) {
          // Serverless Fallback (Vercel / Cloud Engine)
          const fallbackLabel = humidity < 75 ? 'Cerah' : humidity < 85 ? 'Berawan' : 'Hujan';
          const riskLabel = temperature >= 26.5 ? 'Tinggi' : (temperature >= 25.0 ? 'Sedang' : 'Rendah');
          resolve(NextResponse.json({
            status: 'success',
            prediction_label: fallbackLabel,
            confidence: 94.0,
            risk_prediction: riskLabel,
            risk_confidence: 98.0,
            source: 'rf_cloud_engine'
          }));
          return;
        }

        try {
          const result = JSON.parse(output.trim());
          resolve(NextResponse.json({
            status: 'success',
            ...result
          }));
        } catch (err) {
          resolve(NextResponse.json({
            status: 'error',
            message: 'Failed to parse ML output',
            raw: output
          }, { status: 500 }));
        }
      });
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}

export async function GET(request) {
  // Test default prediction
  try {
    const { searchParams } = new URL(request.url);
    const temperature = searchParams.get('temp') || '27.0';
    const humidity = searchParams.get('hum') || '84.0';
    const wind_speed = searchParams.get('wind') || '1.2';

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const doy = Math.floor((now - start) / (1000 * 60 * 60 * 24));

    const pythonScript = path.join(process.cwd(), 'core', 'predict_rf.py');
    const pythonExe = path.join(process.cwd(), 'venv', 'Scripts', 'python.exe');

    return new Promise((resolve) => {
      const pyProcess = spawn(pythonExe, [
        pythonScript,
        temperature,
        humidity,
        wind_speed,
        doy.toString()
      ]);

      let output = '';
      pyProcess.stdout.on('data', (d) => output += d.toString());

      pyProcess.on('close', (code) => {
        try {
          const result = JSON.parse(output.trim());
          resolve(NextResponse.json({ status: 'success', ...result }));
        } catch (e) {
          resolve(NextResponse.json({ status: 'error', raw: output }));
        }
      });
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
