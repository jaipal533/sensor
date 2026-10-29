#!/usr/bin/env python3
"""
train_occupancy_model.py
Trains classification models for room occupancy detection using environmental sensors
(Temperature, Humidity, Light, CO2, HumidityRatio).
Calculates Accuracy, Precision, Recall, F1-Score, and Confusion Matrix.
"""

import os
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "..", "datasets", "raw", "occupancy_detection_sample.csv")
RESULTS_DIR = os.path.join(BASE_DIR, "..", "results")
os.makedirs(RESULTS_DIR, exist_ok=True)

def train_occupancy_classifier():
    print(f"Loading occupancy dataset from: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)

    features = ['Temperature', 'Humidity', 'Light', 'CO2', 'HumidityRatio']
    X = df[features].values
    y = df['Occupancy'].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

    classifiers = {
        "Logistic_Regression": LogisticRegression(max_iter=1000),
        "Random_Forest_Classifier": RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    }

    metrics_output = {}

    for name, clf in classifiers.items():
        clf.fit(X_train, y_train)
        preds = clf.predict(X_test)

        acc = float(accuracy_score(y_test, preds))
        prec = float(precision_score(y_test, preds, zero_division=0))
        rec = float(recall_score(y_test, preds, zero_division=0))
        f1 = float(f1_score(y_test, preds, zero_division=0))
        cm = confusion_matrix(y_test, preds).tolist()

        metrics_output[name] = {
            "Accuracy": round(acc, 4),
            "Precision": round(prec, 4),
            "Recall": round(rec, 4),
            "F1_Score": round(f1, 4),
            "Confusion_Matrix": {
                "TN": cm[0][0] if len(cm) > 1 else 0,
                "FP": cm[0][1] if len(cm) > 1 and len(cm[0]) > 1 else 0,
                "FN": cm[1][0] if len(cm) > 1 else 0,
                "TP": cm[1][1] if len(cm) > 1 and len(cm[1]) > 1 else 0
            }
        }

        print(f"Classifier: {name} -> Accuracy: {acc*100:.2f}% | F1: {f1:.4f}")

    out_file = os.path.join(RESULTS_DIR, "occupancy_model_evaluation.json")
    with open(out_file, "w") as f:
        json.dump(metrics_output, f, indent=2)

    print(f"Occupancy model metrics saved to: {out_file}")

if __name__ == "__main__":
    train_occupancy_classifier()
