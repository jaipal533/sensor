#!/usr/bin/env python3
"""
download_datasets.py
Automated downloader for public datasets used in Smart Home Automation Project.
Downloads and extracts:
1. Individual Household Electric Power Consumption (UCI id=235)
2. Appliances Energy Prediction (UCI id=374)
3. Occupancy Detection (UCI id=357)
"""

import os
import sys
import zipfile
import urllib.request
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(BASE_DIR, "raw")
os.makedirs(RAW_DIR, exist_ok=True)

DATASETS = {
    "household_power": {
        "url": "https://archive.ics.uci.edu/static/public/235/individual+household+electric+power+consumption.zip",
        "zip_name": "household_power.zip",
        "expected_file": "household_power_consumption.txt",
        "description": "UCI Household Electricity Consumption (2006-2010)"
    },
    "appliances_energy": {
        "url": "https://archive.ics.uci.edu/static/public/374/appliances+energy+prediction.zip",
        "zip_name": "appliances_energy.zip",
        "expected_file": "energydata_complete.csv",
        "description": "UCI Appliances Energy Prediction Dataset"
    },
    "occupancy_detection": {
        "url": "https://archive.ics.uci.edu/static/public/357/occupancy+detection.zip",
        "zip_name": "occupancy_detection.zip",
        "expected_file": "datatraining.txt",
        "description": "UCI Occupancy Detection Dataset"
    }
}

def download_and_extract(key: str, info: dict):
    zip_path = os.path.join(RAW_DIR, info["zip_name"])
    logging.info(f"Checking {info['description']}...")

    try:
        logging.info(f"Downloading from {info['url']} -> {zip_path}")
        # Add User-Agent header for academic downloads
        req = urllib.request.Request(
            info["url"],
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BTechProjectAcademicResearch"}
        )
        with urllib.request.urlopen(req, timeout=60) as response, open(zip_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        
        logging.info(f"Extracting {zip_path} into {RAW_DIR}...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(RAW_DIR)
        logging.info(f"Successfully processed {key}")

    except Exception as e:
        logging.warning(f"Could not automatically download {key}: {e}")
        logging.info(f"Manual download instructions: Visit the verified UCI page, download zip to {RAW_DIR}, and extract.")

def main():
    logging.info("Starting public datasets acquisition script...")
    for key, info in DATASETS.items():
        download_and_extract(key, info)
    logging.info("Download routine completed. Check datasets/raw/ folder.")

if __name__ == "__main__":
    main()
