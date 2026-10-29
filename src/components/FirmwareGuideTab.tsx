import React, { useState } from 'react';
import { Cpu, Copy, Check, Download, ShieldAlert, Radio, Wrench, Layers } from 'lucide-react';

export const FirmwareGuideTab: React.FC = () => {
  const [selectedFirmware, setSelectedFirmware] = useState<'node' | 'gateway'>('node');
  const [copied, setCopied] = useState(false);

  const nodeCode = `/**
 * ESP32 LoRa Sensor Node Firmware (sensor_node.ino)
 * Frequency: 865.2 MHz (India WPC License-Free Band)
 * Sensors: DHT22 (GPIO 4), PIR (GPIO 13), Battery ADC (GPIO 34)
 * Actuators: 4-Channel Relays (GPIO 25, 26, 27, 32)
 */

#include <SPI.h>
#include <LoRa.h>
#include <DHT.h>
#include <ArduinoJson.h>

#define LORA_SCK       18
#define LORA_MISO      19
#define LORA_MOSI      23
#define LORA_SS         5
#define LORA_RST       14
#define LORA_DIO0       2

#define DHTPIN          4
#define DHTTYPE     DHT22
#define PIR_PIN        13
#define BATTERY_ADC    34

#define RELAY_1        25 // Living Room AC
#define RELAY_2        26 // Smart Fan
#define RELAY_3        27 // Lights
#define RELAY_4        32 // Fridge

const long FREQUENCY = 865200000; // 865.2 MHz
DHT dht(DHTPIN, DHTTYPE);
uint32_t seq = 0;

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(PIR_PIN, INPUT);
  pinMode(RELAY_1, OUTPUT); digitalWrite(RELAY_1, HIGH);
  pinMode(RELAY_2, OUTPUT); digitalWrite(RELAY_2, HIGH);
  pinMode(RELAY_3, OUTPUT); digitalWrite(RELAY_3, HIGH);
  pinMode(RELAY_4, OUTPUT); digitalWrite(RELAY_4, HIGH);

  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);

  if (!LoRa.begin(FREQUENCY)) {
    Serial.println("LoRa init failed!");
    while (1);
  }

  LoRa.setSpreadingFactor(7);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setTxPower(17);
  LoRa.enableCrc();
  Serial.println("LoRa Node Ready at 865.2 MHz");
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int motion = digitalRead(PIR_PIN);
  float bat = (analogRead(BATTERY_ADC) / 4095.0) * 3.3 * 2.0;

  JsonDocument doc;
  doc["node"] = "ESP32_LORA_01";
  doc["seq"] = ++seq;
  doc["temp"] = temp;
  doc["hum"] = hum;
  doc["motion"] = (motion == HIGH);
  doc["bat"] = bat;

  String payload;
  serializeJson(doc, payload);

  LoRa.beginPacket();
  LoRa.print(payload);
  LoRa.endPacket();

  Serial.println("Transmitted: " + payload);
  delay(15000); // 15 second transmission interval
}`;

  const gatewayCode = `/**
 * ESP32 LoRa Gateway Firmware (gateway.ino)
 * Receives SX1278 Packets at 865.2 MHz, captures RSSI & SNR,
 * and forwards JSON payload over Wi-Fi to Backend API.
 */

#include <SPI.h>
#include <LoRa.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define LORA_SCK       18
#define LORA_MISO      19
#define LORA_MOSI      23
#define LORA_SS         5
#define LORA_RST       14
#define LORA_DIO0       2

const char* SSID = "SmartHome_IoT_WiFi";
const char* PASS = "SecurePassword123";
const char* API_URL = "http://192.168.1.100:3000/api/lora/telemetry";

void setup() {
  Serial.begin(115200);
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }

  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);

  if (!LoRa.begin(865200000)) {
    Serial.println("Gateway LoRa Failed!");
    while (1);
  }
  LoRa.setSpreadingFactor(7);
  LoRa.setSignalBandwidth(125E3);
  LoRa.enableCrc();
  Serial.println("LoRa Gateway Online.");
}

void loop() {
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    String payload = "";
    while (LoRa.available()) { payload += (char)LoRa.read(); }

    int rssi = LoRa.packetRssi();
    float snr = LoRa.packetSnr();

    HTTPClient http;
    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");

    JsonDocument doc;
    doc["gateway"] = "ESP32_GW_01";
    doc["rssi"] = rssi;
    doc["snr"] = snr;
    doc["payload"] = payload;

    String body;
    serializeJson(doc, body);
    http.POST(body);
    http.end();
  }
}`;

  const currentCode = selectedFirmware === 'node' ? nodeCode : gatewayCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = selectedFirmware === 'node' ? 'sensor_node.ino' : 'gateway.ino';
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Safety & Frequency Notice */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">CRITICAL HARDWARE SAFETY PROTOCOL: </span>
          Never connect 230V AC mains directly to the ESP32 breadboard. All appliances must be switched through an
          opto-isolated 5V relay module with physical PCB isolation milling. Always operate LoRa at 865.0 - 867.0 MHz with TX power ≤ +30 dBm in India (WPC GSR 564(E)).
        </div>
      </div>

      {/* Pin Connection Tables */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-emerald-400" />
          ESP32 DevKit V1 Hardware Pinout &amp; Wiring Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-2 px-3">Component</th>
                <th className="py-2 px-3">Device Pin</th>
                <th className="py-2 px-3">ESP32 Pin</th>
                <th className="py-2 px-3">Voltage / Logic</th>
                <th className="py-2 px-3">Hardware Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-sans font-bold text-emerald-400">SX1278 (Ra-02)</td>
                <td className="py-2 px-3">NSS / SCK / MOSI / MISO</td>
                <td className="py-2 px-3 text-cyan-300">GPIO 5, 18, 23, 19</td>
                <td className="py-2 px-3 text-amber-400">3.3V ONLY</td>
                <td className="py-2 px-3 font-sans text-slate-400">SPI Bus (Never connect to 5V!)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-sans font-bold text-emerald-400">SX1278 (Ra-02)</td>
                <td className="py-2 px-3">RST / DIO0</td>
                <td className="py-2 px-3 text-cyan-300">GPIO 14, GPIO 2</td>
                <td className="py-2 px-3 text-amber-400">3.3V</td>
                <td className="py-2 px-3 font-sans text-slate-400">Hardware Reset &amp; Packet Interrupt</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-sans font-bold text-cyan-400">DHT22 (AM2302)</td>
                <td className="py-2 px-3">DATA</td>
                <td className="py-2 px-3 text-cyan-300">GPIO 4</td>
                <td className="py-2 px-3 text-amber-400">3.3V</td>
                <td className="py-2 px-3 font-sans text-slate-400">Requires 10kΩ pull-up to 3.3V</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-sans font-bold text-indigo-400">PIR HC-SR501</td>
                <td className="py-2 px-3">OUTPUT</td>
                <td className="py-2 px-3 text-cyan-300">GPIO 13</td>
                <td className="py-2 px-3 text-amber-400">3.3V Logic (5V VCC)</td>
                <td className="py-2 px-3 font-sans text-slate-400">Active-High Motion Pulse</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-sans font-bold text-rose-400">4-Ch Relay Board</td>
                <td className="py-2 px-3">IN1, IN2, IN3, IN4</td>
                <td className="py-2 px-3 text-cyan-300">GPIO 25, 26, 27, 32</td>
                <td className="py-2 px-3 text-amber-400">3.3V Logic</td>
                <td className="py-2 px-3 font-sans text-slate-400">Active-Low Optocoupler Input</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-sans font-bold text-teal-400">18650 Battery</td>
                <td className="py-2 px-3">Divider Midpoint</td>
                <td className="py-2 px-3 text-cyan-300">GPIO 34 (ADC1_CH6)</td>
                <td className="py-2 px-3 text-amber-400">0 - 2.1V ADC Range</td>
                <td className="py-2 px-3 font-sans text-slate-400">2x 100kΩ equal resistor divider</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Firmware Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Cpu className="w-4 h-4" />
            </span>
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setSelectedFirmware('node')}
                className={`px-3 py-1.5 rounded-md font-bold transition ${
                  selectedFirmware === 'node' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Sensor Node (sensor_node.ino)
              </button>
              <button
                onClick={() => setSelectedFirmware('gateway')}
                className={`px-3 py-1.5 rounded-md font-bold transition ${
                  selectedFirmware === 'gateway' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                LoRa Gateway (gateway.ino)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .INO</span>
            </button>
          </div>
        </div>

        {/* Code Box */}
        <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-96 border border-slate-800 leading-relaxed scrollbar-thin">
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
};
