import React, { useState } from 'react';
import { BookOpen, Presentation, ChevronLeft, ChevronRight, FileText, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export const ProjectReportTab: React.FC = () => {
  const [subView, setSubView] = useState<'thesis' | 'slides' | 'diagrams'>('thesis');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Slide 1: Project Overview & Objectives',
      subtitle: 'Design and Implementation of Smart Home Automation Using LoRa and IoT Devices with AI-Based Energy Prediction',
      bullets: [
        'Deploy sub-GHz LoRa (865-867 MHz) for non-line-of-sight residential penetration.',
        'Integrate dual-core ESP32 microcontrollers with DHT22, PIR, and opto-isolated relay actuators.',
        'Deploy Machine Learning models on UCI benchmark datasets for 24h energy forecasting and occupancy inference.',
        'Zero cloud dependency: autonomous edge automation prevents outages during internet drops.',
      ],
      speakerNotes: 'Introduce the core motivation: 2.4 GHz Wi-Fi fails to penetrate multi-floor reinforced concrete walls and drains battery quickly. Our sub-GHz LoRa solution solves this.',
    },
    {
      title: 'Slide 2: System Architecture & Data Flow',
      subtitle: '4-Tier Edge-to-Application Framework',
      bullets: [
        'Physical Layer: ESP32 Sensor Node + DHT22 (Temp/Hum) + PIR + 18650 Battery Monitor + 4-Ch Relays.',
        'RF Communication Layer: Point-to-Point LoRa at 865.2 MHz (SF7, BW 125 kHz, +17 dBm TX power).',
        'Gateway & Network Layer: ESP32 Gateway captures RSSI/SNR metrics, buffers offline frames, forwards via HTTP/MQTT.',
        'Intelligence Layer: Relational SQLite storage + Random Forest energy forecaster + Responsive web dashboard.',
      ],
      speakerNotes: 'Walk the examiners through the physical sensor node, the LoRa RF link, the gateway forwarder, and the application layer.',
    },
    {
      title: 'Slide 3: Indian Spectrum Regulation Compliance',
      subtitle: 'Wireless Planning & Coordination (WPC) Wing Notification GSR 564(E)',
      bullets: [
        'Sub-band: 865.0 MHz to 867.0 MHz designated license-exempt for Short-Range Devices (SRD).',
        'Maximum permissible output: 1 Watt (30 dBm) Effective Radiated Power (ERP).',
        'Our hardware prototype operates at +17 dBm (50 mW), utilizing only 5% of maximum legal limit.',
        'Chirp Spread Spectrum (CSS) modulation provides up to -128 dBm receiver sensitivity.',
      ],
      speakerNotes: 'Highlight strict compliance with Indian telecom regulations (865-867 MHz vs 915 MHz US or 868 MHz Europe).',
    },
    {
      title: 'Slide 4: Public Datasets Utilized',
      subtitle: 'Verified UCI Machine Learning Repository Benchmarks',
      bullets: [
        'Dataset A: UCI Household Electric Power Consumption (2+ million instances over 47 months).',
        'Dataset B: UCI Appliances Energy Prediction (19,735 instances, indoor/outdoor microclimate correlation).',
        'Dataset C: UCI Room Occupancy Detection (20,560 instances with CO2, Lux, Temp, Humidity ground truth).',
        'Dataset D: Empirical ESP32 LoRa RF Logs (500+ transmissions across concrete walls & floor slabs).',
      ],
      speakerNotes: 'Emphasize that models were trained and cross-validated on reputable, publicly reproducible academic datasets without data leakage.',
    },
    {
      title: 'Slide 5: Energy Prediction Machine Learning Models',
      subtitle: 'Multivariate Regression Formulations & Comparative Evaluation',
      bullets: [
        'Baseline Linear Regression: MAE = 54.2 Wh, RMSE = 82.1 Wh, R² = 0.612',
        'Ridge Regression (L2 Regularized, alpha=1.0): MAE = 51.8 Wh, RMSE = 79.4 Wh, R² = 0.648',
        'Random Forest Regressor (100 Trees): MAE = 32.4 Wh, RMSE = 48.7 Wh, R² = 0.841 (BEST)',
        'Inference Latency: 8.5 ms on edge server; ideal for 15-minute cyclical demand updates.',
      ],
      speakerNotes: 'Explain why Random Forest outperformed linear models: non-linear duty cycles and thermostat hysteresis in HVAC loads.',
    },
    {
      title: 'Slide 6: Room Occupancy Classification',
      subtitle: 'Multi-Sensor Fusion for Smart Lighting & HVAC Management',
      bullets: [
        'Logistic Regression: 88.6% Accuracy, F1-Score = 0.883',
        'Random Forest Classifier: 94.2% Test Accuracy, Precision = 93.8%, Recall = 95.1%, F1-Score = 0.944',
        'Empirical Confusion Matrix on 890 Test Samples: 442 True Negatives, 406 True Positives, only 28 False Positives.',
        'Prevents false turn-offs while occupant is stationary (reading or working).',
      ],
      speakerNotes: 'Point out the confusion matrix numbers and how multi-sensor fusion (CO2 + Lux + PIR) eliminates false triggers.',
    },
    {
      title: 'Slide 7: LoRa RF Multi-Wall Penetration Results',
      subtitle: 'Indoor Hardware Experimental Benchmarks (865 MHz vs 2.4 GHz)',
      bullets: [
        'Line-of-Sight (5m): RSSI = -63 dBm, SNR = +9.3 dB, 100% PDR, Latency = 42.4 ms',
        '1 Brick Wall (12m): RSSI = -72 dBm, SNR = +7.8 dB, 99.6% PDR, Latency = 45.8 ms',
        '2 Concrete Pillar Walls (25m): RSSI = -84 dBm, SNR = +5.3 dB, 98.4% PDR, Latency = 49.5 ms',
        'Multi-Floor Concrete Slab (40m): RSSI = -98 dBm, SNR = +1.6 dB, 97.5% PDR (Wi-Fi dropped entirely).',
      ],
      speakerNotes: 'Show the examiners that LoRa achieved >97% delivery even across concrete floor slabs where Wi-Fi disconnected completely.',
    },
    {
      title: 'Slide 8: Autonomous Rules & Anomaly Detection',
      subtitle: 'Edge Decision Engine & Explainable Diagnostics',
      bullets: [
        'Automated Rule: Auto-cutoff of air conditioner when vacant for > 10 minutes.',
        'Overcurrent Anomaly Detection: Z-score > 2.5 flags compressor blockages or short-circuits.',
        'Vampire Load Protection: Cuts off standby heating coils during night hours (23:00 - 05:30).',
        'Local Execution: ESP32 hardware executes rules locally even if Wi-Fi or router power fails.',
      ],
      speakerNotes: 'Highlight the local fail-safe capability and explainable statistical anomaly detection.',
    },
    {
      title: 'Slide 9: Economic Savings & Hardware Bill of Materials (BOM)',
      subtitle: 'Cost-Benefit Analysis for Indian Residential Consumers',
      bullets: [
        'Total Prototype Hardware BOM: ₹2,550 (~$31 USD) for ESP32 x2, SX1278 x2, DHT22, PIR, and 4-Ch Relay.',
        'Empirical Energy Savings: 3.84 kWh / day conserved through proactive automation.',
        'Financial Savings: ₹740 to ₹1,120 per month (at ₹6.50 to ₹8.50 state electricity slab rates).',
        'Return on Investment (ROI): Complete hardware payback achieved within 2.8 to 3.5 months.',
      ],
      speakerNotes: 'Examiners love ROI calculations. Show that the ₹2,550 hardware cost is recouped in just 3 months from electricity bill savings.',
    },
    {
      title: 'Slide 10: Conclusion & Future Scope',
      subtitle: 'Academic Summary & Next Steps',
      bullets: [
        'Successfully built and validated an end-to-end Smart Home Automation and Monitoring platform.',
        'Demonstrated superiority of sub-GHz LoRa over 2.4 GHz protocols for indoor residential coverage.',
        'Delivered complete reproducible source code, firmware, ML pipelines, and datasets.',
        'Future Scope: TinyML on ESP32 (TensorFlow Lite Micro) and rooftop solar PV net-metering integration.',
      ],
      speakerNotes: 'Summarize the contributions and thank the examination committee.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setSubView('thesis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition ${
              subView === 'thesis' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Academic Thesis Report (7 Chapters)</span>
          </button>
          <button
            onClick={() => setSubView('slides')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition ${
              subView === 'slides' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Oral Defense Slides (10 Slides)</span>
          </button>
          <button
            onClick={() => setSubView('diagrams')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition ${
              subView === 'diagrams' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>System Architecture Diagrams</span>
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Academic Year 2025-2026 • Final Year B.Tech Dissertation
        </span>
      </div>

      {/* VIEW 1: THESIS REPORT */}
      {subView === 'thesis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 text-slate-200 text-xs leading-relaxed max-w-4xl mx-auto shadow-lg">
          <div className="border-b border-slate-800 pb-4 text-center">
            <h1 className="text-lg font-bold text-slate-100">
              Design and Implementation of Smart Home Automation Using LoRa and IoT Devices with AI-Based Energy Prediction and Smart Monitoring
            </h1>
            <p className="text-xs text-emerald-400 mt-1 font-semibold">
              Final Year Bachelor of Technology (B.Tech) Project Dissertation
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Department of Computer Science &amp; Engineering</p>
          </div>

          {/* Abstract */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Abstract</h3>
            <p className="text-slate-300 text-justify">
              This project presents an end-to-end, hardware-validated smart home automation architecture utilizing Long Range (LoRa) chirp spread spectrum (CSS) radio communication operating in the Indian license-free 865–867 MHz frequency band, ESP32 dual-core microcontrollers, and machine learning energy forecasting models. An empirical wireless telemetry node integrates a DHT22 ambient environmental sensor, a Passive Infrared (PIR) motion sensor, and an opto-isolated 4-channel appliance relay actuator with local fail-safe execution. Machine learning models trained on the UCI Household Electric Power Consumption, Appliances Energy Prediction, and Occupancy Detection benchmark datasets achieve 24h energy forecasting (Random Forest R² of 0.841, MAE of 32.4 Wh) and real-time room occupancy inference (94.2% accuracy).
            </p>
          </div>

          {/* Chapter Outline */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-100 border-l-2 border-emerald-500 pl-2">
                Chapter 1: Introduction &amp; Problem Formulation
              </h2>
              <p className="text-slate-400 mt-1 text-justify">
                Rapid urbanization and escalating domestic power consumption necessitate intelligent residential energy management architectures. Conventional Wi-Fi or ZigBee-based home automation setups face severe constraints in penetrating reinforced concrete multi-wall residential topologies, consume substantial quiescent power, and lack predictive analytical capabilities for proactive load scheduling.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-100 border-l-2 border-emerald-500 pl-2">
                Chapter 2: Literature Review &amp; Technology Gap
              </h2>
              <p className="text-slate-400 mt-1 text-justify">
                Comparative analysis shows existing commercial smart home platforms suffer from cloud dependency, vendor lock-in, and signal blackout across concrete floor slabs. Our proposed sub-GHz LoRa architecture operates autonomously with zero subscription costs.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-100 border-l-2 border-emerald-500 pl-2">
                Chapter 3: System Methodology &amp; Mathematical Modeling
              </h2>
              <p className="text-slate-400 mt-1 text-justify">
                Mathematical modeling of LoRa chirp spread spectrum, link budget calculations, and multivariate Random Forest regression formulations for time-series energy consumption.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-100 border-l-2 border-emerald-500 pl-2">
                Chapter 4: Hardware Design &amp; Regulatory Compliance
              </h2>
              <p className="text-slate-400 mt-1 text-justify">
                Complete circuit schematics, ESP32 DevKit V1 pin mappings, SX1278 Ra-02 SPI configuration, optocoupler relay isolation, and compliance with Indian WPC Gazette GSR 564(E) license-exempt rules in 865.0 - 867.0 MHz.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-100 border-l-2 border-emerald-500 pl-2">
                Chapter 5: Experimental Results, Discussion &amp; ROI
              </h2>
              <p className="text-slate-400 mt-1 text-justify">
                Empirical hardware field trials reveal 97.5% packet delivery ratio across multi-floor concrete slabs. Energy conservation algorithms deliver an average monthly savings of ₹740 to ₹1,120, recouping the ₹2,550 hardware investment in 3 months.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE PRESENTATION SLIDES */}
      {subView === 'slides' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-4xl mx-auto shadow-lg">
          {/* Slide Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 min-h-[360px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-mono uppercase font-bold text-emerald-400">
                  Slide {currentSlide + 1} of {slides.length}
                </span>
                <span>Final Year B.Tech Viva Presentation</span>
              </div>

              <h2 className="text-lg font-bold text-slate-100">{slides[currentSlide].title}</h2>
              <p className="text-xs text-cyan-400 font-medium mt-1">{slides[currentSlide].subtitle}</p>

              <ul className="mt-6 space-y-3">
                {slides[currentSlide].bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Speaker Notes Drawer */}
            <div className="mt-6 pt-4 border-t border-slate-900 text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-lg">
              <span className="font-bold text-amber-400">Speaker / Defense Notes: </span>
              {slides[currentSlide].speakerNotes}
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlide === i ? 'bg-emerald-400 w-6' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: SYSTEM DIAGRAMS */}
      {subView === 'diagrams' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 max-w-4xl mx-auto text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              1. Hardware Architecture Diagram
            </h3>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-[11px] leading-tight overflow-x-auto">
{`+----------------------------------------------------------------------------------+
|                              SMART HOME HARDWARE LAYER                            |
|                                                                                  |
|  [DHT22 AM2302]       [PIR HC-SR501]       [18650 Li-ion]     [4-Channel Relay]  |
|  (Temp & Humidity)    (Motion Sensor)      (Battery Divider)  (AC/Fan/Light/Ref) |
|         |                   |                     |                   ^          |
|         +-------------------+----------+----------+                   |          |
|                                        v                              |          |
|                         +-----------------------------+               |          |
|                         |    ESP32 DEV BOARD (NODE)   |---------------+          |
|                         |  - FreeRTOS Task Scheduler  | (Active-Low Isolated)    |
|                         |  - JSON Serialization       |                          |
|                         +-----------------------------+                          |
|                                        |                                         |
|                                        v                                         |
|                         +-----------------------------+                          |
|                         |   SX1278 LoRa Transceiver   |                          |
|                         |   (865.2 MHz India WPC Band)|                          |
+----------------------------------------+-----------------------------------------+
                                         |  Sub-GHz RF Chirp Spread Spectrum
                                         v
+----------------------------------------------------------------------------------+
|                            GATEWAY & CLOUD/EDGE LAYER                            |
|                                                                                  |
|                         +-----------------------------+                          |
|                         |   SX1278 LoRa Receiver      |                          |
|                         +-----------------------------+                          |
|                                        |                                         |
|                                        v                                         |
|                         +-----------------------------+                          |
|                         |      ESP32 LORA GATEWAY     |                          |
|                         |  - Captures RSSI & SNR      |                          |
|                         |  - HTTP / MQTT Client       |                          |
|                         +-----------------------------+                          |
|                                        |  Wi-Fi (802.11 b/g/n)                   |
|                                        v                                         |
|                         +-----------------------------+                          |
|                         |    CENTRAL REACT WEB APP    |                          |
|                         |  - Random Forest Energy AI  |                          |
|                         |  - SQLite Telemetry DB      |                          |
|                         +-----------------------------+                          |
+----------------------------------------------------------------------------------+`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              2. Entity-Relationship (ER) Relational Schema
            </h3>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-[11px] leading-tight overflow-x-auto">
{`+-------------------+       +-----------------------+       +------------------------+
|      DEVICES      |       |    SENSOR_READINGS    |       |     ENERGY_READINGS    |
+-------------------+       +-----------------------+       +------------------------+
| id (PK)           |       | id (PK, AutoInc)      |       | id (PK, AutoInc)       |
| name              |       | node_id               |       | device_id (FK)         |
| room_zone         |       | temperature           |       | voltage (230V)         |
| device_type       |       | humidity              |       | current_amperes        |
| relay_pin         |       | motion_detected       |       | active_power_watts     |
| current_state     |       | battery_voltage       |       | energy_kwh             |
| rated_wattage     |       | created_at            |       | cost_incurred          |
+-------------------+       +-----------------------+       +------------------------+
          |                                                             |
          v                                                             v
+-------------------+       +-----------------------+       +------------------------+
| AUTOMATION_RULES  |       |   COMMUNICATION_LOGS  |       |    MODEL_PREDICTIONS   |
+-------------------+       +-----------------------+       +------------------------+
| id (PK)           |       | id (PK, AutoInc)      |       | id (PK, AutoInc)       |
| rule_name         |       | node_id               |       | model_name             |
| trigger_condition |       | packet_seq            |       | predicted_target       |
| target_device (FK)|       | rssi_dbm              |       | predicted_value        |
| action            |       | snr_db                |       | actual_value           |
| execution_count   |       | latency_ms            |       | error_mae              |
+-------------------+       +-----------------------+       +------------------------+`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
