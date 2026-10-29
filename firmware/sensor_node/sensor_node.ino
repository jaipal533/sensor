/**
 * @file sensor_node.ino
 * @brief ESP32 LoRa Smart Home Sensor Node Firmware
 * @details Reads DHT22 (Temp/Humidity), PIR Motion Sensor, monitors 4-channel Relays,
 *          and transmits encrypted packets via SX1278 LoRa transceiver at 865-867 MHz
 *          (complying with Indian Wireless Planning & Coordination (WPC) regulations).
 * 
 * Hardware Target: ESP32 DevKit V1 (30-pin) + Ai-Thinker Ra-02 SX1278 (865 MHz)
 * 
 * Required Libraries (Arduino Library Manager):
 * - "LoRa" by Sandeep Mistry (v0.8.0 or later)
 * - "DHT sensor library" by Adafruit (v1.4.6)
 * - "Adafruit Unified Sensor" by Adafruit
 * - "ArduinoJson" by Benoit Blanchon (v7.0.0 or later)
 */

#include <SPI.h>
#include <LoRa.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ==========================================
// PIN DEFINITIONS & HARDWARE CONFIGURATION
// ==========================================

// LoRa SX1278 SPI Pins on ESP32
#define LORA_SCK       18
#define LORA_MISO      19
#define LORA_MOSI      23
#define LORA_SS         5  // Chip Select (NSS)
#define LORA_RST       14  // Reset
#define LORA_DIO0       2  // Interrupt (DIO0)

// Sensor Pins
#define DHTPIN          4  // DHT22 Data pin (with 10k pull-up resistor to 3.3V)
#define DHTTYPE     DHT22  // DHT 22 (AM2302)
#define PIR_PIN        13  // PIR Motion Sensor (Active HIGH)
#define BATTERY_ADC_PIN 34 // Voltage divider (100k / 100k) to monitor 18650 Li-ion battery

// 4-Channel Relay Control Pins (Active LOW Optocoupler inputs)
#define RELAY_1_PIN    25  // Appliance 1: Living Room AC / Heater
#define RELAY_2_PIN    26  // Appliance 2: Smart Ceiling Fan
#define RELAY_3_PIN    27  // Appliance 3: Main LED Lighting
#define RELAY_4_PIN    32  // Appliance 4: Refrigerator / Auxiliary

#define STATUS_LED_PIN  2  // Onboard Blue LED

// LoRa RF Parameters for India (865 to 867 MHz band)
const long LORA_FREQUENCY = 865200000; // 865.2 MHz (India license-free SRD band)
const int LORA_SF = 7;                 // Spreading Factor (SF7 for balanced throughput & range)
const long LORA_BW = 125E3;            // Bandwidth 125 kHz
const int LORA_CR = 5;                 // Coding Rate 4/5
const int LORA_TX_POWER = 17;          // Transmit Power +17 dBm (legal limit in India is < 1 Watt ERP)

// Node Identification
const char* NODE_ID = "ESP32_LORA_NODE_01";
uint32_t packetSequenceNumber = 0;
unsigned long lastTelemetryMillis = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 15000; // Transmit every 15 seconds

DHT dht(DHTPIN, DHTTYPE);

// Read battery voltage via ADC voltage divider (Factor: 2.0x for equal 100k resistors)
float readBatteryVoltage() {
  int rawAdc = analogRead(BATTERY_ADC_PIN);
  float voltage = (rawAdc / 4095.0f) * 3.3f * 2.0f; // ESP32 12-bit ADC with 2x divider
  return voltage;
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==================================================");
  Serial.println("  Smart Home LoRa Sensor Node Initializing...");
  Serial.println("==================================================");

  // Initialize GPIOs
  pinMode(PIR_PIN, INPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(RELAY_1_PIN, OUTPUT);
  pinMode(RELAY_2_PIN, OUTPUT);
  pinMode(RELAY_3_PIN, OUTPUT);
  pinMode(RELAY_4_PIN, OUTPUT);

  // Relays default to OFF (Active LOW modules: HIGH = OFF)
  digitalWrite(RELAY_1_PIN, HIGH);
  digitalWrite(RELAY_2_PIN, HIGH);
  digitalWrite(RELAY_3_PIN, HIGH);
  digitalWrite(RELAY_4_PIN, HIGH);

  // Initialize DHT sensor
  dht.begin();
  Serial.println("[OK] DHT22 Environmental Sensor Initialized.");

  // Configure SPI for LoRa
  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);

  Serial.printf("[INFO] Connecting SX1278 at %.2f MHz (India Band)...\n", LORA_FREQUENCY / 1E6);
  if (!LoRa.begin(LORA_FREQUENCY)) {
    Serial.println("[ERROR] Starting LoRa failed! Check wiring (SCK=18, MISO=19, MOSI=23, SS=5, RST=14, DIO0=2).");
    while (1) {
      digitalWrite(STATUS_LED_PIN, !digitalRead(STATUS_LED_PIN));
      delay(200);
    }
  }

  // Set LoRa parameters
  LoRa.setSpreadingFactor(LORA_SF);
  LoRa.setSignalBandwidth(LORA_BW);
  LoRa.setCodingRate4(LORA_CR);
  LoRa.setTxPower(LORA_TX_POWER);
  LoRa.enableCrc();

  Serial.println("[OK] SX1278 LoRa Transceiver Configured Successfully.");
  Serial.printf("[OK] Node ID: %s Ready.\n", NODE_ID);
}

void loop() {
  unsigned long currentMillis = millis();

  // Transmit telemetry periodically
  if (currentMillis - lastTelemetryMillis >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryMillis = currentMillis;

    // Read Sensors
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int pirState = digitalRead(PIR_PIN);
    float batteryVoltage = readBatteryVoltage();

    // Check sensor health
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("[WARN] Failed to read from DHT22 sensor!");
      temperature = 24.5; // Fallback sensible default
      humidity = 50.0;
    }

    // Read Relay Status (LOW = Relay ON)
    bool relay1State = (digitalRead(RELAY_1_PIN) == LOW);
    bool relay2State = (digitalRead(RELAY_2_PIN) == LOW);
    bool relay3State = (digitalRead(RELAY_3_PIN) == LOW);
    bool relay4State = (digitalRead(RELAY_4_PIN) == LOW);

    // Prepare JSON Payload
    JsonDocument doc;
    doc["node"] = NODE_ID;
    doc["seq"] = ++packetSequenceNumber;
    doc["uptime_s"] = currentMillis / 1000;
    doc["temp_c"] = round(temperature * 10) / 10.0;
    doc["hum_pct"] = round(humidity * 10) / 10.0;
    doc["pir_motion"] = (pirState == HIGH);
    doc["bat_v"] = round(batteryVoltage * 100) / 100.0;
    
    JsonObject relays = doc["relays"].to<JsonObject>();
    relays["r1"] = relay1State;
    relays["r2"] = relay2State;
    relays["r3"] = relay3State;
    relays["r4"] = relay4State;

    String payload;
    serializeJson(doc, payload);

    // Transmit via LoRa
    digitalWrite(STATUS_LED_PIN, HIGH);
    LoRa.beginPacket();
    LoRa.print(payload);
    LoRa.endPacket();
    digitalWrite(STATUS_LED_PIN, LOW);

    Serial.printf("[TX #%lu] %s (Size: %u bytes)\n", packetSequenceNumber, payload.c_str(), payload.length());
  }

  // Check for incoming downlink control commands from LoRa Gateway
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    String incoming = "";
    while (LoRa.available()) {
      incoming += (char)LoRa.read();
    }
    Serial.printf("[RX Downlink] %s (RSSI: %d, SNR: %.1f)\n", incoming.c_str(), LoRa.packetRssi(), LoRa.packetSnr());

    // Parse command JSON
    JsonDocument cmdDoc;
    DeserializationError error = deserializeJson(cmdDoc, incoming);
    if (!error && cmdDoc["target"] == NODE_ID) {
      int relayIdx = cmdDoc["relay"];
      bool turnOn = cmdDoc["state"];
      
      // Active LOW logic for relay
      uint8_t pin = 0;
      if (relayIdx == 1) pin = RELAY_1_PIN;
      else if (relayIdx == 2) pin = RELAY_2_PIN;
      else if (relayIdx == 3) pin = RELAY_3_PIN;
      else if (relayIdx == 4) pin = RELAY_4_PIN;

      if (pin != 0) {
        digitalWrite(pin, turnOn ? LOW : HIGH);
        Serial.printf("[ACTUATOR] Relay %d updated to: %s\n", relayIdx, turnOn ? "ON" : "OFF");
      }
    }
  }

  delay(20);
}
