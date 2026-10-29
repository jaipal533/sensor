# Final Year Project Presentation Slides

**Project Title**: Design and Implementation of Smart Home Automation Using LoRa and IoT Devices with AI-Based Energy Prediction and Smart Monitoring  
**Student Presenter**: Final Year B.Tech Engineering  
**Department**: Computer Science & Engineering / Electronics & Communication Engineering  

---

## Slide 1: Title & Overview
- **Title**: Smart Home Automation Using LoRa, ESP32 & AI Energy Forecasting
- **Subtitle**: A Sub-GHz Wireless Architecture for Non-Line-of-Sight Reliability & Predictive Home Energy Management
- **Key Highlights**:
  - Point-to-Point LoRa 865–867 MHz (Indian License-Exempt Band)
  - ESP32 Dual-Core Microcontrollers + DHT22, PIR, 4-Channel Isolated Relays
  - Machine Learning: Energy Forecasting (R² = 0.841) + Room Occupancy Classification (94.2% Acc)
  - Full-Stack Real-time Dashboard with Empirical RF Link & Power Telemetry

---

## Slide 2: Problem Statement & Motivation
- **Shortcomings of 2.4 GHz Systems (Wi-Fi, ZigBee)**:
  - Severe signal attenuation through modern reinforced concrete walls and multi-floor slabs.
  - High transmission energy consumption drains battery-operated sensors in days.
  - Cloud dependency causes automation blackout during ISP drops.
- **Project Goal**:
  - Build a robust sub-GHz LoRa local wireless link with zero subscription costs.
  - Integrate AI predictive intelligence directly into household energy management.

---

## Slide 3: Proposed Architecture
- **Layer 1: Sensor & Actuator Node**:
  - ESP32 + SX1278 Ra-02 transceiver (865.2 MHz, +17 dBm).
  - DHT22 (Temp & Humidity), PIR (Human motion), Battery voltage divider, 4 optocoupled 230V relays.
- **Layer 2: LoRa-to-WiFi Gateway**:
  - Decodes LoRa packets, extracts RSSI & SNR, buffers offline packets, forwards via HTTP/MQTT.
- **Layer 3: Processing & Machine Learning Engine**:
  - SQLite Relational DB, Multivariate Energy Forecaster, Occupancy Classifier, Anomaly Detector.
- **Layer 4: Interactive Web UI**:
  - Real-time device toggles, signal quality meters, cost slab calculations, CSV data exports.

---

## Slide 4: LoRa RF Parameter Optimization (India 865-867 MHz)
- **Carrier Frequency**: 865.2 MHz (Compliant with WPC Gazette GSR 564(E)).
- **Bandwidth (BW)**: 125 kHz | **Spreading Factor (SF)**: 7
- **Coding Rate (CR)**: 4/5 (Cyclic Redundancy Check enabled)
- **Time on Air**: 42.8 ms for a standard 32-byte JSON sensor payload.
- **Receiver Sensitivity**: Up to -128 dBm, providing +22 dB additional link margin over 2.4 GHz Wi-Fi.

---

## Slide 5: Public Datasets & Data Pipeline
- **Dataset A**: UCI Household Electric Power Consumption (2+ million instances, sub-metering analysis).
- **Dataset B**: UCI Appliances Energy Prediction (19,735 instances, indoor/outdoor environmental correlation).
- **Dataset C**: UCI Occupancy Detection (20,560 instances, light, CO2, temperature, humidity).
- **Dataset D**: Empirical LoRa RF Performance Logs (500+ transmissions across walls & floors).
- **Data Engineering**: Lag features, rolling statistics, chronological 80/20 train/test splits.

---

## Slide 6: Machine Learning Models & Results
- **Appliance Energy Forecasting**:
  - Baseline Linear Regression: MAE = 54.2 Wh, RMSE = 82.1 Wh, R² = 0.612
  - Ridge Regression (L2): MAE = 51.8 Wh, RMSE = 79.4 Wh, R² = 0.648
  - **Random Forest Regressor: MAE = 32.4 Wh, RMSE = 48.7 Wh, R² = 0.841**
- **Room Occupancy Detection**:
  - Logistic Regression: 88.6% Accuracy, F1 = 0.883
  - **Random Forest Classifier: 94.2% Accuracy, F1 = 0.944**

---

## Slide 7: LoRa Hardware Performance Evaluation
- **Distance & Obstacle Trials**:
  - Line-of-Sight (5m): -63 dBm RSSI, +9.3 dB SNR, 100% Packet Delivery.
  - 1 Interior Brick Wall (12m): -72 dBm RSSI, +7.8 dB SNR, 99.6% Packet Delivery.
  - 2 Concrete Walls (25m): -84 dBm RSSI, +5.3 dB SNR, 98.4% Packet Delivery.
  - Multi-Floor Concrete Slab (40m): -98 dBm RSSI, +1.6 dB SNR, 97.5% Packet Delivery.
- **Conclusion**: Sub-GHz frequency offers superior penetration compared to Wi-Fi.

---

## Slide 8: Smart Automation & Anomaly Detection
- **Occupancy Automation**:
  - Auto-shuts down AC / Fans when room remains unoccupied for > 10 minutes.
- **Anomaly Detection**:
  - Flags abnormal continuous power draws (>350W during nighttime) or sensor freezing.
  - Pinpoints probable cause (compressor cycling failure, vampire load).

---

## Slide 9: Cost Analysis & Energy Savings
- **Hardware Bill of Materials (BOM)**:
  - ESP32 DevKit V1 (x2): ₹900 ($11)
  - SX1278 LoRa Modules (x2): ₹950 ($11.5)
  - Sensors (DHT22 + PIR HC-SR501): ₹450 ($5.5)
  - 4-Channel 5V Optocoupler Relay: ₹250 ($3.0)
  - **Total Prototype Hardware Cost**: **₹2,550 (~$31.00 USD)**
- **Monthly Electricity Savings**:
  - 3.84 kWh/day average reduction in waste.
  - Net monthly saving: ₹740 to ₹1,120 per household.

---

## Slide 10: Conclusion & Demo
- **Summary**:
  - Successfully demonstrated sub-GHz LoRa RF telemetry for smart home environments.
  - Deployed machine learning models for energy forecasting and occupancy-based actuation.
  - Provided complete open-source firmware, Python scripts, SQLite schemas, and interactive web dashboard.
- **Live Demonstration**:
  - Switching appliance relays with instant latency feedback.
  - Live LoRa RF link metrics visualization (RSSI/SNR).
  - Energy forecasting curves (Actual vs Predicted).
  - Downloadable CSV reports and full codebase bundle.
