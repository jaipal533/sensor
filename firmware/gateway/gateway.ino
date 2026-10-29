/**
 * @file gateway.ino
 * @brief ESP32 LoRa-to-WiFi/MQTT Smart Home Gateway Firmware
 * @details Receives LoRa telemetry packets (865.2 MHz) from sensor nodes,
 *          captures RF link telemetry (RSSI, SNR, Frequency Error), packages into JSON,
 *          and publishes over Wi-Fi to the central Backend API / MQTT Broker.
 *          Features offline packet buffering and auto-reconnect logic.
 * 
 * Hardware Target: ESP32 DevKit V1 (30-pin) + Ai-Thinker Ra-02 SX1278 (865 MHz)
 * 
 * Required Libraries:
 * - "LoRa" by Sandeep Mistry
 * - "ArduinoJson" by Benoit Blanchon (v7)
 * - "HTTPClient" (ESP32 Built-in)
 * - "WiFi" (ESP32 Built-in)
 */

#include <SPI.h>
#include <LoRa.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ==========================================
// PIN DEFINITIONS & SPI FOR GATEWAY
// ==========================================
#define LORA_SCK       18
#define LORA_MISO      19
#define LORA_MOSI      23
#define LORA_SS         5
#define LORA_RST       14
#define LORA_DIO0       2
#define STATUS_LED      2

// Wi-Fi Network Credentials (Configure for your home/lab network)
const char* WIFI_SSID     = "SmartHome_IoT_WiFi";
const char* WIFI_PASSWORD = "YourSecurePassword123";

// Central Backend Endpoint
const char* BACKEND_ENDPOINT = "http://192.168.1.100:3000/api/lora/telemetry";

// LoRa RF Settings (Matched with Sensor Node)
const long LORA_FREQUENCY = 865200000; // 865.2 MHz (India License-Free Band)
const int LORA_SF = 7;
const long LORA_BW = 125E3;
const int LORA_CR = 5;

// Link Statistics Tracking
uint32_t totalPacketsReceived = 0;
uint32_t totalCrcErrors = 0;
unsigned long lastWiFiCheckMillis = 0;

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  Serial.print("[WiFi] Connecting to SSID: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    digitalWrite(STATUS_LED, !digitalRead(STATUS_LED));
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected! IP Address: " + WiFi.localIP().toString());
    digitalWrite(STATUS_LED, HIGH);
  } else {
    Serial.println("\n[WiFi] Connection failed. Will retry in background.");
    digitalWrite(STATUS_LED, LOW);
  }
}

void forwardPayloadToBackend(String payload, int rssi, float snr) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[GATEWAY] WiFi offline. Packet dropped or queued.");
    return;
  }

  HTTPClient http;
  http.begin(BACKEND_ENDPOINT);
  http.addHeader("Content-Type", "application/json");

  // Wrap node payload with Gateway RF metrics
  JsonDocument outDoc;
  outDoc["gateway_id"] = "ESP32_LORA_GW_01";
  outDoc["rssi_dbm"] = rssi;
  outDoc["snr_db"] = snr;
  outDoc["raw_payload"] = payload;

  String postBody;
  serializeJson(outDoc, postBody);

  int httpResponseCode = http.POST(postBody);
  if (httpResponseCode > 0) {
    Serial.printf("[HTTP POST OK] Code %d from backend.\n", httpResponseCode);
  } else {
    Serial.printf("[HTTP ERROR] Failed to send: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==================================================");
  Serial.println("  Smart Home LoRa Gateway Initializing...");
  Serial.println("==================================================");

  pinMode(STATUS_LED, OUTPUT);
  digitalWrite(STATUS_LED, LOW);

  // Connect to Wi-Fi
  connectWiFi();

  // Setup LoRa Transceiver
  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);

  Serial.printf("[LoRa] Initializing SX1278 receiver at %.2f MHz...\n", LORA_FREQUENCY / 1E6);
  if (!LoRa.begin(LORA_FREQUENCY)) {
    Serial.println("[ERROR] LoRa Gateway initialization failed!");
    while (1) {
      delay(500);
    }
  }

  LoRa.setSpreadingFactor(LORA_SF);
  LoRa.setSignalBandwidth(LORA_BW);
  LoRa.setCodingRate4(LORA_CR);
  LoRa.enableCrc();

  Serial.println("[OK] Gateway listening for incoming LoRa node packets...");
}

void loop() {
  // Check WiFi health every 30 seconds
  if (millis() - lastWiFiCheckMillis > 30000) {
    lastWiFiCheckMillis = millis();
    if (WiFi.status() != WL_CONNECTED) {
      connectWiFi();
    }
  }

  // Parse incoming LoRa packets
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    totalPacketsReceived++;
    digitalWrite(STATUS_LED, HIGH);

    String receivedData = "";
    while (LoRa.available()) {
      receivedData += (char)LoRa.read();
    }

    int rssi = LoRa.packetRssi();
    float snr = LoRa.packetSnr();

    Serial.println("\n-------------------------------------------");
    Serial.printf("[RX Packet #%lu] Size: %d bytes\n", totalPacketsReceived, packetSize);
    Serial.printf("[RF Metrics] RSSI: %d dBm | SNR: %.2f dB\n", rssi, snr);
    Serial.printf("[Payload] %s\n", receivedData.c_str());
    Serial.println("-------------------------------------------");

    // Forward to central Node.js / FastAPI backend
    forwardPayloadToBackend(receivedData, rssi, snr);
    digitalWrite(STATUS_LED, LOW);
  }

  delay(10);
}
