# Hardware Wiring, Pinout, and Electrical Safety Guide

**Project**: Design and Implementation of Smart Home Automation Using LoRa and IoT Devices with AI-Based Energy Prediction and Smart Monitoring  
**Target Hardware**: ESP32 DevKit V1 (30-Pin) + Semtech SX1278 (Ra-02 865 MHz) Transceiver Module

---

## 1. Indian Spectrum & Radio Regulatory Compliance

- **Band Allocated**: **865.0 MHz to 867.0 MHz**
- **Authority**: Ministry of Communications & IT, Wireless Planning & Coordination (WPC) Wing, Government of India (Gazette Notification GSR 564(E)).
- **Maximum Permitted Transmit Power**: 1 Watt Effective Radiated Power (ERP) (+30 dBm).
- **Our System Setting**: Transmit Power set to **+17 dBm (50 mW)**, operating well within legal and emission limits while delivering 200m+ residential penetrating range.

---

## 2. Sensor Node Pin Connection Table

| Peripheral | Peripheral Pin | ESP32 Pin | Logic Level | Connection Details / Pull-up |
|---|---|---|---|---|
| **SX1278 (Ra-02)** | VCC (3.3V) | 3V3 | 3.3V | ⚠️ Never connect to 5V! SX1278 is strictly 3.3V tolerant. |
| | GND | GND | 0V | Common Ground |
| | NSS / CS | GPIO 5 | 3.3V | SPI Chip Select |
| | SCK | GPIO 18 | 3.3V | SPI Clock |
| | MOSI | GPIO 23 | 3.3V | SPI Master Out Slave In |
| | MISO | GPIO 19 | 3.3V | SPI Master In Slave Out |
| | RST | GPIO 14 | 3.3V | LoRa Reset |
| | DIO0 | GPIO 2 | 3.3V | Interrupt pin for packet RX / TX done |
| **DHT22** | VCC | 3V3 | 3.3V | Power Supply |
| | DATA | GPIO 4 | 3.3V | Requires 10 kΩ pull-up resistor between DATA and 3.3V |
| | GND | GND | 0V | Common Ground |
| **PIR HC-SR501** | VCC | VIN (5V) | 5.0V | HC-SR501 requires 5V input, outputs 3.3V digital logic |
| | OUT | GPIO 13 | 3.3V | Active HIGH when human motion is detected |
| | GND | GND | 0V | Common Ground |
| **4-Ch Relay Module** | VCC | VIN (5V) | 5.0V | Powers optocoupler LEDs and relay coils |
| | IN1 (Living Room AC) | GPIO 25 | 3.3V | Active LOW trigger (Low = Relay Energized) |
| | IN2 (Ceiling Fan) | GPIO 26 | 3.3V | Active LOW trigger |
| | IN3 (Smart Lights) | GPIO 27 | 3.3V | Active LOW trigger |
| | IN4 (Refrigerator) | GPIO 32 | 3.3V | Active LOW trigger |
| | GND | GND | 0V | Common Ground |
| **18650 Battery Monitor** | Battery (+) | GPIO 34 | Analog | Voltage divider: 100kΩ to Battery (+), 100kΩ to GND |

---

## 3. LoRa Gateway Pin Connection Table

| Peripheral | Gateway Pin | ESP32 Pin | Function |
|---|---|---|---|
| **SX1278 (Ra-02)** | VCC | 3V3 | 3.3V Regulated Power |
| | GND | GND | Common System Ground |
| | NSS | GPIO 5 | Hardware Chip Select |
| | SCK | GPIO 18 | Hardware SPI Clock |
| | MOSI | GPIO 23 | Hardware SPI MOSI |
| | MISO | GPIO 19 | Hardware SPI MISO |
| | RST | GPIO 14 | Reset Line |
| | DIO0 | GPIO 2 | Packet Interrupt Line |
| **Status Indicator**| On-board LED | GPIO 2 | Blinks on LoRa Packet Receive & Wi-Fi Send |

---

## 4. ASCII System Wiring Diagram

```
                 +---------------------------------------------+
                 |            ESP32 DevKit V1 (30-Pin)         |
                 |                                             |
   [3.3V] <------+ 3V3                                    VIN +-----> [5V USB / Battery In]
   [GND]  <------+ GND                                    GND +-----> [Common Ground]
                 |                                             |
   [SPI SCK] <---+ GPIO 18                              GPIO 4 +<----+ [DHT22 Data] (10k Pull-up)
   [SPI MISO]<---+ GPIO 19                             GPIO 13 +<----+ [PIR Motion Out]
   [SPI MOSI]<---+ GPIO 23                             GPIO 34 +<----+ [Battery Divider 1:2]
   [SPI NSS] <---+ GPIO 5                              GPIO 25 +-----> [Relay IN1: AC]
   [LoRa RST]<---+ GPIO 14                             GPIO 26 +-----> [Relay IN2: Fan]
   [LoRa DIO]<---+ GPIO 2                              GPIO 27 +-----> [Relay IN3: Light]
                 |                                     GPIO 32 +-----> [Relay IN4: Refrig]
                 +---------------------------------------------+
                        |                          |
                        v                          v
              +-------------------+      +--------------------+
              |   Ai-Thinker      |      |   Opto-Isolated    |
              |   SX1278 LoRa     |      |   4-Channel Relay  |
              |   (865-867 MHz)   |      |   Module (5V Coil) |
              +-------------------+      +--------------------+
                        |                          |
                    (Antenna)              [Mains Appliance Loads]
                                           230V AC Isolated Circuit
```

---

## 5. Critical Electrical Safety Protocols

⚠️ **DANGER: 230V MAINS ELECTRICITY HAZARDS**
1. **Never connect mains 230V AC wires directly to the ESP32 microcontroller or a breadboard.**
2. Always utilize an **opto-isolated relay module** with physical optical isolation (PC817 optocouplers) and PCB air-gap isolation milling between the low-voltage DC logic and high-voltage AC terminals.
3. Keep the relay high-voltage terminals enclosed in a flame-retardant ABS junction box.
4. Use properly rated inline miniature circuit breakers (MCB) or 10A fast-blow fuses in series with the AC Phase wire.
5. For laboratory evaluation and academic project demonstration, test the relay switching using safe **12V DC LED loads or 5V indicator lamps** before connecting high-current 230V home appliances.
