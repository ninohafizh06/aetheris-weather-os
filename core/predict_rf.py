import sys
import json
import os
import warnings
warnings.filterwarnings('ignore')

import pickle
import joblib
import numpy as np
import pandas as pd

def main():
    payload = {}
    if len(sys.argv) >= 5:
        # Format: python predict_rf.py <temperature> <humidity> <wind_speed> <doy>
        payload = {
            'temperature': float(sys.argv[1]),
            'humidity': float(sys.argv[2]),
            'wind_speed': float(sys.argv[3]),
            'doy': int(sys.argv[4])
        }
    else:
        raw_input = ""
        if len(sys.argv) > 1:
            raw_input = sys.argv[1]
        else:
            raw_input = sys.stdin.read().strip()

        if not raw_input:
            print(json.dumps({"error": "No input payload provided"}))
            return

        try:
            payload = json.loads(raw_input)
        except Exception:
            import re
            t_match = re.search(r'temperature["\']?\s*:\s*([\d.]+)', raw_input)
            h_match = re.search(r'humidity["\']?\s*:\s*([\d.]+)', raw_input)
            w_match = re.search(r'wind_speed["\']?\s*:\s*([\d.]+)', raw_input)
            d_match = re.search(r'doy["\']?\s*:\s*([\d]+)', raw_input)
            payload = {
                'temperature': float(t_match.group(1)) if t_match else 26.5,
                'humidity': float(h_match.group(1)) if h_match else 80.0,
                'wind_speed': float(w_match.group(1)) if w_match else 1.2,
                'doy': int(d_match.group(1)) if d_match else 180
            }

    try:
        t2m = float(payload.get('temperature', 26.5))
        rh2m = float(payload.get('humidity', 82.0))
        ws2m = float(payload.get('wind_speed', 1.2))
        doy = int(payload.get('doy', 180))

        model_dir = os.path.join(os.path.dirname(__file__), 'model')
        weather_model_path = os.path.join(model_dir, 'weather_rf_model.pkl')
        risk_model_path = os.path.join(model_dir, 'model_risiko_suhu.pkl')

        # 1. Prediksi Cuaca (Cerah, Berawan, Hujan)
        weather_prediction = 'Berawan'
        weather_confidence = 90.0
        weather_probabilities = {}
        weather_code = 1

        if os.path.exists(weather_model_path):
            try:
                with open(weather_model_path, 'rb') as f:
                    weather_model = pickle.load(f)
                features = pd.DataFrame([{
                    'T2M': t2m,
                    'RH2M': rh2m,
                    'WS2M': ws2m,
                    'DOY': doy
                }])
                weather_code = int(weather_model.predict(features)[0])
                pred_probs = weather_model.predict_proba(features)[0]
                weather_map = {0: 'Cerah', 1: 'Berawan', 2: 'Hujan'}
                weather_prediction = weather_map.get(weather_code, 'Berawan')
                weather_confidence = round(float(np.max(pred_probs)) * 100, 2)
                weather_probabilities = {
                    weather_map[i]: round(float(prob) * 100, 2)
                    for i, prob in enumerate(pred_probs)
                }
            except Exception as e:
                # Rule-based fallback
                weather_prediction = 'Hujan' if rh2m >= 85 else ('Berawan' if rh2m >= 75 else 'Cerah')
        else:
            weather_prediction = 'Hujan' if rh2m >= 85 else ('Berawan' if rh2m >= 75 else 'Cerah')

        # 2. Prediksi Risiko Suhu Iklim (model_risiko_suhu.pkl dari Colab)
        risk_prediction = 'Sedang'
        risk_confidence = 95.0
        risk_probabilities = {}

        if os.path.exists(risk_model_path):
            try:
                risk_model = joblib.load(risk_model_path)
                risk_features = pd.DataFrame({'suhu': [t2m]})
                risk_pred = risk_model.predict(risk_features)[0]
                risk_prediction = str(risk_pred)

                if hasattr(risk_model, 'predict_proba') and hasattr(risk_model, 'classes_'):
                    r_probs = risk_model.predict_proba(risk_features)[0]
                    risk_confidence = round(float(np.max(r_probs)) * 100, 2)
                    risk_probabilities = {
                        str(cls): round(float(prob) * 100, 2)
                        for cls, prob in zip(risk_model.classes_, r_probs)
                    }
            except Exception as e:
                # Fallback rule
                risk_prediction = 'Tinggi' if t2m >= 26.5 else ('Sedang' if t2m >= 25.0 else 'Rendah')
        else:
            risk_prediction = 'Tinggi' if t2m >= 26.5 else ('Sedang' if t2m >= 25.0 else 'Rendah')

        result = {
            "prediction_code": weather_code,
            "prediction_label": weather_prediction,
            "confidence": weather_confidence,
            "probabilities": weather_probabilities,
            "risk_prediction": risk_prediction,
            "risk_confidence": risk_confidence,
            "risk_probabilities": risk_probabilities,
            "input": {
                "temperature": t2m,
                "humidity": rh2m,
                "wind_speed": ws2m,
                "doy": doy
            }
        }
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == '__main__':
    main()
