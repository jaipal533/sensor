#!/usr/bin/env python3
"""
train_energy_model.py
Trains baseline (Linear Regression) and advanced (Random Forest / Ridge) models
for household appliances energy forecasting using historical sensor telemetry.
Outputs MAE, RMSE, R² metrics and predictions comparison.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "..", "datasets", "raw", "appliances_energy_sample.csv")
RESULTS_DIR = os.path.join(BASE_DIR, "..", "results")
os.makedirs(RESULTS_DIR, exist_ok=True)

def train_and_evaluate():
    print(f"Loading dataset from: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)

    # Feature engineering
    df['date'] = pd.to_datetime(df['date'])
    df['hour'] = df['date'].dt.hour
    df['temp_diff'] = df['T1'] - df['T_out']

    feature_cols = ['T1', 'RH_1', 'T2', 'RH_2', 'T3', 'RH_3', 'T_out', 'Press_mm_hg', 'RH_out', 'Windspeed', 'lights', 'hour', 'temp_diff']
    target_col = 'Appliances'

    X = df[feature_cols].values
    y = df[target_col].values

    # 80/20 train/test split without shuffle (time-series continuity)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    models = {
        "Baseline_Linear_Regression": LinearRegression(),
        "Ridge_Regression_L2": Ridge(alpha=1.0),
        "Random_Forest_Regressor": RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    }

    results = {}
    predictions_dump = []

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred))

        results[name] = {
            "MAE": round(mae, 2),
            "RMSE": round(rmse, 2),
            "R2": round(r2, 4),
            "sample_predictions": [round(float(p), 1) for p in y_pred[:10]]
        }

        print(f"Model: {name} -> MAE: {mae:.2f} Wh | RMSE: {rmse:.2f} Wh | R²: {r2:.4f}")

    # Save metrics summary
    out_path = os.path.join(RESULTS_DIR, "energy_model_evaluation.json")
    with open(out_path, "w") as f:
        json.dump(results, f, indent=2)

    print(f"Evaluation report successfully saved to: {out_path}")

if __name__ == "__main__":
    train_and_evaluate()
