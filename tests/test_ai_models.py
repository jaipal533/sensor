#!/usr/bin/env python3
"""
Unit and Integration Tests for AI Models & Dataset Consistency
"""

import os
import unittest
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))

class TestSmartHomeAI(unittest.TestCase):

    def test_datasets_exist(self):
        """Check raw and demo datasets are present."""
        raw_appliances = os.path.join(PROJECT_ROOT, "datasets", "raw", "appliances_energy_sample.csv")
        raw_occupancy = os.path.join(PROJECT_ROOT, "datasets", "raw", "occupancy_detection_sample.csv")
        demo_lora = os.path.join(PROJECT_ROOT, "datasets", "generated_demo", "lora_rf_performance.csv")

        self.assertTrue(os.path.exists(raw_appliances), "Appliances dataset missing")
        self.assertTrue(os.path.exists(raw_occupancy), "Occupancy dataset missing")
        self.assertTrue(os.path.exists(demo_lora), "LoRa RF dataset missing")

    def test_appliances_columns_and_values(self):
        """Validate energy dataset column schema and numerical validity."""
        file_path = os.path.join(PROJECT_ROOT, "datasets", "raw", "appliances_energy_sample.csv")
        df = pd.read_csv(file_path)

        self.assertIn("Appliances", df.columns)
        self.assertIn("T1", df.columns)
        self.assertIn("RH_1", df.columns)
        self.assertIn("T_out", df.columns)
        self.assertFalse(df['Appliances'].isnull().any(), "Null values detected in target column")
        self.assertTrue((df['Appliances'] > 0).all(), "Energy usage must be positive")

    def test_occupancy_binary_labels(self):
        """Ensure occupancy target contains strictly binary labels (0 or 1)."""
        file_path = os.path.join(PROJECT_ROOT, "datasets", "raw", "occupancy_detection_sample.csv")
        df = pd.read_csv(file_path)

        self.assertIn("Occupancy", df.columns)
        unique_labels = set(df['Occupancy'].unique())
        self.assertTrue(unique_labels.issubset({0, 1}), "Occupancy must be 0 or 1")

    def test_lora_rf_parameters(self):
        """Verify LoRa parameters conform to Indian 865-867 MHz band and valid ranges."""
        file_path = os.path.join(PROJECT_ROOT, "datasets", "generated_demo", "lora_rf_performance.csv")
        df = pd.read_csv(file_path)

        self.assertIn("frequency_mhz", df.columns)
        self.assertIn("rssi_dbm", df.columns)
        self.assertIn("snr_db", df.columns)

        # Check frequency is in 865-867 MHz
        self.assertTrue(((df['frequency_mhz'] >= 865.0) & (df['frequency_mhz'] <= 867.0)).all())
        # Check RSSI is within realistic sub-GHz bounds
        self.assertTrue(((df['rssi_dbm'] >= -140) & (df['rssi_dbm'] <= -30)).all())

if __name__ == '__main__':
    unittest.main()
