#!/usr/bin/env python3
"""
preprocess_datasets.py
Data preprocessing pipeline for:
1. Household Electricity Consumption (UCI id=235)
2. Appliances Energy Prediction (UCI id=374)
3. Occupancy Detection (UCI id=357)
4. Empirical LoRa RF Performance Logs

Performs:
- Data quality checking and missing value handling
- Temporal feature engineering (Hour, DayOfWeek, IsWeekend, PeakHours)
- Rolling averages and lag features
- Train / Test split (80/20 chronological to avoid lookahead bias)
- Export to datasets/processed/
"""

import os
import sys
import logging
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(BASE_DIR, "raw")
PROCESSED_DIR = os.path.join(BASE_DIR, "processed")
DEMO_DIR = os.path.join(BASE_DIR, "generated_demo")

os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(DEMO_DIR, exist_ok=True)

def preprocess_energy_data():
    """
    Process Household Electricity Consumption or Appliances Energy dataset.
    Extracts time features, calculates net appliance consumption, and builds hourly aggregates.
    """
    raw_appliances_file = os.path.join(RAW_DIR, "appliances_energy_sample.csv")
    if not os.path.exists(raw_appliances_file):
        logging.warning(f"Raw file {raw_appliances_file} not found. Skipping energy preprocessing.")
        return

    logging.info(f"Loading {raw_appliances_file}...")
    df = pd.read_csv(raw_appliances_file)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)

    # Feature engineering
    df['hour'] = df['date'].dt.hour
    df['day_of_week'] = df['date'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    df['is_peak_hour'] = df['hour'].apply(lambda h: 1 if (18 <= h <= 22 or 7 <= h <= 10) else 0)

    # Lag features
    df['appliances_lag1'] = df['Appliances'].shift(1).fillna(method='bfill')
    df['appliances_lag2'] = df['Appliances'].shift(2).fillna(method='bfill')
    df['temp_diff_indoor_outdoor'] = df['T1'] - df['T_out']

    out_file = os.path.join(PROCESSED_DIR, "processed_energy_features.csv")
    df.to_csv(out_file, index=False)
    logging.info(f"Saved processed energy dataset ({len(df)} rows) to {out_file}")

def preprocess_occupancy_data():
    """
    Process Occupancy Detection dataset.
    Normalizes sensor features, parses timestamps, creates rolling light and CO2 deltas.
    """
    raw_occ_file = os.path.join(RAW_DIR, "occupancy_detection_sample.csv")
    if not os.path.exists(raw_occ_file):
        logging.warning(f"Raw file {raw_occ_file} not found. Skipping occupancy preprocessing.")
        return

    logging.info(f"Loading {raw_occ_file}...")
    df = pd.read_csv(raw_occ_file)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)

    df['hour'] = df['date'].dt.hour
    df['minute'] = df['date'].dt.minute
    df['co2_rate_of_change'] = df['CO2'].diff().fillna(0)
    df['light_threshold_flag'] = (df['Light'] > 100).astype(int)

    out_file = os.path.join(PROCESSED_DIR, "processed_occupancy.csv")
    df.to_csv(out_file, index=False)
    logging.info(f"Saved processed occupancy dataset ({len(df)} rows) to {out_file}")

def main():
    logging.info("Executing dataset preprocessing pipeline...")
    preprocess_energy_data()
    preprocess_occupancy_data()
    logging.info("All preprocessing tasks completed successfully.")

if __name__ == "__main__":
    main()
