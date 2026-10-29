# Project Datasets Documentation & Data Dictionaries

This directory contains the public datasets, processed datasets, and empirical LoRa RF communication logs utilized in the project:
**"Design and Implementation of Smart Home Automation Using LoRa and IoT Devices with AI-Based Energy Prediction and Smart Monitoring"**.

---

## 1. Dataset Overview

| Dataset | Source | Purpose | Frequency / Span | Status in Project |
|---|---|---|---|---|
| **Dataset A: Household Electricity Consumption** | UCI Machine Learning Repository (`id=235`) | Total household power forecasting, sub-metering analysis, anomaly detection | 1-minute resolution over 47 months (2,075,259 records) | Sample raw + Processed hourly aggregated dataset included |
| **Dataset B: Appliances Energy Prediction** | UCI Machine Learning Repository (`id=374`) | Micro-level appliance energy modeling with indoor/outdoor environmental telemetry | 10-minute resolution (19,735 records) | Sample raw + Processed feature-engineered dataset included |
| **Dataset C: Occupancy Detection** | UCI Machine Learning Repository (`id=357`) | Supervised classification of room occupancy for lighting and HVAC automation | 1-minute resolution (20,560 instances across train/test) | Cleaned train/test subsets with normalized environmental features |
| **Dataset D: LoRa Communication Performance** | Empirical ESP32 + SX1278 (Ra-02) Hardware Measurements (865-867 MHz) | Radio frequency telemetry: RSSI, SNR, Packet Delivery Ratio (PDR), Latency, Packet Loss | 500+ transmission trials across indoor obstacles (walls, concrete slabs, line-of-sight) | Real hardware-logged and simulated validation datasets |

---

## 2. Official Download Links and Verification

### Dataset A: Individual Household Electric Power Consumption
- **Official UCI Link**: https://archive.ics.uci.edu/dataset/235/individual+household+electric+power+consumption
- **Direct Zip Archive**: `https://archive.ics.uci.edu/static/public/235/individual+household+electric+power+consumption.zip`
- **Citation**: Hebrail, Georges & Berard, Alice. (2012). Individual household electric power consumption. UCI Machine Learning Repository.

### Dataset B: Appliances Energy Prediction
- **Official UCI Link**: https://archive.ics.uci.edu/dataset/374/appliances+energy+prediction
- **Direct Zip Archive**: `https://archive.ics.uci.edu/static/public/374/appliances+energy+prediction.zip`
- **Citation**: Luis M. Candanedo, Veronique Feldheim, Dominique Deramaix. (2017). Appliances energy prediction. UCI Machine Learning Repository.

### Dataset C: Occupancy Detection Data Set
- **Official UCI Link**: https://archive.ics.uci.edu/dataset/357/occupancy+detection
- **Direct Zip Archive**: `https://archive.ics.uci.edu/static/public/357/occupancy+detection.zip`
- **Citation**: Luis M. Candanedo, Veronique Feldheim. (2016). Accurate occupancy detection of an office room from light, temperature, humidity and CO2 measurements using statistical learning models. *Energy and Buildings*, 112, 28-39.

---

## 3. Data Dictionaries

### Dataset A: Household Electric Power Consumption
- `Date`: Date in format dd/mm/yyyy
- `Time`: Time in format hh:mm:ss
- `Global_active_power`: Household global minute-averaged active power (in kilowatt kW)
- `Global_reactive_power`: Household global minute-averaged reactive power (in kilowatt kW)
- `Voltage`: Minute-averaged voltage (in volts V)
- `Global_intensity`: Household global minute-averaged current intensity (in ampere A)
- `Sub_metering_1`: Energy sub-metering No. 1 (in watt-hour of active energy): kitchen (dishwasher, microwave)
- `Sub_metering_2`: Energy sub-metering No. 2 (in watt-hour of active energy): laundry room (washing machine, tumble-drier, refrigerator, light)
- `Sub_metering_3`: Energy sub-metering No. 3 (in watt-hour of active energy): electric water-heater and air-conditioner

### Dataset B: Appliances Energy Prediction
- `date`: Timestamp year-month-day hour:minute:second
- `Appliances`: Energy use in Wh
- `lights`: Energy use of light fixtures in the house in Wh
- `T1` to `T9`: Temperature in kitchen, living room, laundry, office, bathroom, outside, ironing, teens room, parents room (°C)
- `RH_1` to `RH_9`: Relative Humidity in the respective 9 zones (%)
- `T_out`: Temperature outside (from Chievres weather station) (°C)
- `Press_mm_hg`: Atmospheric pressure (mm Hg)
- `RH_out`: Humidity outside (%)
- `Windspeed`: Wind speed (m/s)
- `Visibility`: Visibility (km)
- `Tdewpoint`: Dew point temperature (°C)

### Dataset C: Occupancy Detection
- `date`: Timestamp
- `Temperature`: Temperature in °C
- `Humidity`: Relative Humidity in %
- `Light`: Illuminance in Lux
- `CO2`: Carbon dioxide concentration in ppm
- `HumidityRatio`: Derived humidity ratio (kg of water vapor per kg of dry air)
- `Occupancy`: Binary ground truth (0 = Not Occupied, 1 = Occupied)

### Dataset D: LoRa Communication Performance
- `timestamp`: ISO 8601 transmission timestamp
- `node_id`: ESP32 LoRa transmitter identifier (e.g. `NODE_ESP32_01`)
- `packet_seq`: Incrementing 16-bit packet sequence number
- `frequency_mhz`: Operational carrier frequency (865.2 MHz to 867.0 MHz)
- `spreading_factor`: LoRa Spreading Factor (SF7 - SF12)
- `bandwidth_khz`: LoRa Bandwidth (125 kHz)
- `coding_rate`: Error Correction Coding Rate (4/5)
- `rssi_dbm`: Received Signal Strength Indicator in dBm (-125 to -40 dBm)
- `snr_db`: Signal-to-Noise Ratio in dB (-12 to +12 dB)
- `latency_ms`: Round-trip communication latency from node to gateway (ms)
- `packet_size_bytes`: Payload size in bytes
- `delivery_status`: Binary success indicator (1 = Delivered, 0 = Packet Dropped)
- `battery_voltage_v`: Monitored 18650 Li-ion battery voltage (3.2V to 4.2V)
- `environment_zone`: Obstacle context (Line of Sight, 1 Brick Wall, 2 Concrete Walls, Multi-floor)
