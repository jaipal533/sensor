-- Smart Home Automation Using LoRa and IoT with AI-Based Energy Prediction
-- Database Schema for SQLite / MySQL Compatible Implementation

-- 1. Devices Table
CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    room_zone TEXT NOT NULL,
    device_type TEXT NOT NULL,         -- 'ac', 'fan', 'light', 'refrigerator', 'water_heater'
    relay_pin INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    current_state BOOLEAN DEFAULT 0,    -- 0 = OFF, 1 = ON
    rated_wattage REAL NOT NULL,        -- Rated power consumption in Watts
    manual_override BOOLEAN DEFAULT 0,  -- 1 if user locked state manually
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sensor Readings Table (DHT22, PIR, Light, Battery)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id TEXT NOT NULL,
    temperature REAL NOT NULL,          -- in Celsius
    humidity REAL NOT NULL,             -- in %
    motion_detected BOOLEAN NOT NULL,   -- 1 = Motion, 0 = Clear
    battery_voltage REAL,               -- in Volts (e.g. 4.12V)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Energy Readings Table
CREATE TABLE IF NOT EXISTS energy_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    voltage REAL DEFAULT 230.0,         -- in Volts
    current_amperes REAL NOT NULL,       -- in Amperes
    active_power_watts REAL NOT NULL,   -- in Watts
    apparent_power_va REAL,             -- in VA
    energy_kwh REAL NOT NULL,           -- Cumulative kWh
    cost_incurred REAL,                 -- Cost based on local tariff
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(device_id) REFERENCES devices(id)
);

-- 4. Automation Rules Table
CREATE TABLE IF NOT EXISTS automation_rules (
    id TEXT PRIMARY KEY,
    rule_name TEXT NOT NULL,
    trigger_condition TEXT NOT NULL,    -- e.g. "temperature > 28 AND occupancy == 1"
    target_device_id TEXT NOT NULL,
    action TEXT NOT NULL,               -- "TURN_ON" or "TURN_OFF"
    is_enabled BOOLEAN DEFAULT 1,
    last_triggered_at TIMESTAMP,
    execution_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(target_device_id) REFERENCES devices(id)
);

-- 5. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type TEXT NOT NULL,           -- 'POWER_SURGE', 'VAMPIRE_DRAIN', 'SENSOR_TIMEOUT', 'LOW_BATTERY'
    severity TEXT NOT NULL,             -- 'INFO', 'WARNING', 'CRITICAL'
    device_id TEXT,
    message TEXT NOT NULL,
    root_cause_explanation TEXT,
    is_resolved BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(device_id) REFERENCES devices(id)
);

-- 6. Device Commands Table (Audit log for manual & automated toggles)
CREATE TABLE IF NOT EXISTS device_commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    command TEXT NOT NULL,              -- 'SET_STATE_ON', 'SET_STATE_OFF'
    source TEXT NOT NULL,               -- 'WEB_UI', 'AI_AUTOMATION', 'MANUAL_PHYSICAL_OVERRIDE'
    status TEXT NOT NULL,               -- 'SENT', 'ACKNOWLEDGED_BY_LORA', 'FAILED'
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(device_id) REFERENCES devices(id)
);

-- 7. LoRa Communication Logs Table
CREATE TABLE IF NOT EXISTS communication_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id TEXT NOT NULL,
    packet_seq INTEGER NOT NULL,
    frequency_mhz REAL DEFAULT 865.2,
    rssi_dbm INTEGER NOT NULL,
    snr_db REAL NOT NULL,
    packet_size_bytes INTEGER NOT NULL,
    latency_ms REAL NOT NULL,
    delivery_status BOOLEAN NOT NULL,   -- 1 = Success, 0 = Packet Loss
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Model Predictions Table
CREATE TABLE IF NOT EXISTS model_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_name TEXT NOT NULL,           -- 'RandomForest_Energy_Forecaster', 'Logistic_Occupancy_Classifier'
    predicted_target TEXT NOT NULL,     -- 'next_hour_energy_kwh', 'occupancy_probability'
    predicted_value REAL NOT NULL,
    actual_value REAL,
    error_mae REAL,
    predicted_for_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_time ON sensor_readings(created_at);
CREATE INDEX IF NOT EXISTS idx_energy_readings_time ON energy_readings(created_at);
CREATE INDEX IF NOT EXISTS idx_comm_logs_time ON communication_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_unresolved ON alerts(is_resolved);
