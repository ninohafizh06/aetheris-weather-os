import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import pickle
import json

def train():
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'weather_dataset.csv')
    print(f"Loading dataset from: {csv_path}")

    # Read CSV, skipping NASA header lines if present
    # NASA header starts with '-BEGIN HEADER-' and ends with '-END HEADER-'
    with open(csv_path, 'r') as f:
        lines = f.readlines()

    header_end = 0
    for idx, line in enumerate(lines):
        if 'YEAR,DOY' in line or 'YEAR, DOY' in line:
            header_end = idx
            break

    df = pd.read_csv(csv_path, skiprows=header_end)
    print(f"Dataset loaded. Total rows: {len(df)}")
    print(df.head())

    # Filter out missing/error values (-999)
    df = df[(df['T2M'] != -999) & (df['RH2M'] != -999) & (df['WS2M'] != -999)].copy()

    # Rule Klasifikasi 3 Kategori:
    # 0 = Cerah (RH2M < 75%)
    # 1 = Berawan (75% <= RH2M < 85%)
    # 2 = Hujan (RH2M >= 85%)
    def label_weather(rh):
        if rh < 75.0:
            return 0  # Cerah
        elif rh < 85.0:
            return 1  # Berawan
        else:
            return 2  # Hujan

    df['weather_code'] = df['RH2M'].apply(label_weather)
    weather_labels = {0: 'Cerah', 1: 'Berawan', 2: 'Hujan'}
    df['weather_label'] = df['weather_code'].map(weather_labels)

    print("\nDistribusi Kelas:")
    print(df['weather_label'].value_counts())

    # Features and Target
    # Kita gunakan parameter sensor: T2M (Suhu), RH2M (Kelembapan), WS2M (Kecepatan Angin), plus DOY (musim)
    features = ['T2M', 'RH2M', 'WS2M', 'DOY']
    X = df[features]
    y = df['weather_code']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Inisialisasi Model Random Forest Classifier
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        random_state=42,
        class_weight='balanced'
    )

    rf_model.fit(X_train, y_train)

    # Evaluasi Model
    y_pred = rf_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nAkurasi Model: {acc * 100:.2f}%")
    print("\nClassification Report:")
    target_names = [weather_labels[i] for i in sorted(weather_labels.keys())]
    print(classification_report(y_test, y_pred, target_names=target_names))

    # Feature Importance
    importance = dict(zip(features, rf_model.feature_importances_))
    print("Feature Importances:", importance)

    # Simpan Model ke .pkl
    model_dir = os.path.join(os.path.dirname(__file__), 'model')
    os.makedirs(model_dir, exist_ok=True)
    
    pkl_path = os.path.join(model_dir, 'weather_rf_model.pkl')
    with open(pkl_path, 'wb') as f:
        pickle.dump(rf_model, f)
    print(f"Model saved to: {pkl_path}")

    # Simpan metadata / config model ke json agar bisa dibaca langsung atau dipelajari API
    meta = {
        'features': features,
        'labels': weather_labels,
        'accuracy': float(acc),
        'importance': {k: float(v) for k, v in importance.items()}
    }
    with open(os.path.join(model_dir, 'model_meta.json'), 'w') as f:
        json.dump(meta, f, indent=2)

    print("Training selesai sukses!")

if __name__ == '__main__':
    train()
