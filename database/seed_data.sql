-- Smart Home Automation Seed Data

INSERT OR IGNORE INTO devices (id, name, room_zone, device_type, relay_pin, is_active, current_state, rated_wattage, manual_override) VALUES
('dev_ac_01', 'Living Room Inverter AC (1.5 Ton)', 'Living Room', 'ac', 25, 1, 1, 1450.0, 0),
('dev_fan_01', 'Master Bedroom BLDC Smart Fan', 'Master Bedroom', 'fan', 26, 1, 1, 28.0, 0),
('dev_light_01', 'Main Hall Ambient Lighting', 'Living Room', 'light', 27, 1, 1, 45.0, 0),
('dev_fridge_01', 'Kitchen 350L Double-Door Refrigerator', 'Kitchen', 'refrigerator', 32, 1, 1, 160.0, 0),
('dev_heater_01', 'Bathroom Storage Geyser (15L)', 'Bathroom', 'water_heater', 22, 1, 0, 2000.0, 0),
('dev_balcony_light', 'Balcony Security Floodlight', 'Outdoor / Balcony', 'light', 21, 1, 0, 30.0, 0);

INSERT OR IGNORE INTO automation_rules (id, rule_name, trigger_condition, target_device_id, action, is_enabled, execution_count) VALUES
('rule_auto_ac_off', 'Auto-Turn OFF AC when Room Unoccupied > 10m', 'Occupancy == 0 FOR 10m', 'dev_ac_01', 'TURN_OFF', 1, 14),
('rule_auto_fan_on', 'Auto-Turn ON Bedroom Fan on High Temp (> 27°C)', 'Temperature > 27.0°C AND Occupancy == 1', 'dev_fan_01', 'TURN_ON', 1, 29),
('rule_night_light_off', 'Eco-Midnight Lighting Shutdown', 'Time >= 23:30 AND Motion == 0', 'dev_light_01', 'TURN_OFF', 1, 42),
('rule_geyser_safeguard', 'Geyser Auto-Cutoff after 25 Minutes', 'Geyser Runtime > 25m', 'dev_heater_01', 'TURN_OFF', 1, 8);

INSERT OR IGNORE INTO alerts (alert_type, severity, device_id, message, root_cause_explanation, is_resolved) VALUES
('POWER_SURGE', 'CRITICAL', 'dev_ac_01', 'Continuous high current draw (1820W vs rated 1450W)', 'Compressor condenser coil clogged or abnormal voltage drop causing overcurrent.', 0),
('VAMPIRE_DRAIN', 'WARNING', 'dev_heater_01', 'Standby thermal losses detected during off-peak hours', 'Thermostat hysteresis cycle triggered repeatedly without occupant water draw.', 0),
('RF_SIGNAL_DEGRADATION', 'INFO', NULL, 'LoRa RSSI dropped to -108 dBm on Node 01', 'Severe RF path loss due to newly closed reinforced concrete partition door.', 1);
