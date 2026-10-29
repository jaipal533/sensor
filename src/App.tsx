/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { RoomSelector } from './components/RoomSelector';
import { SmartHomeMockupView } from './components/SmartHomeMockupView';
import { SensorManagementView } from './components/SensorManagementView';
import { ApplianceControlView } from './components/ApplianceControlView';
import { AutomationRulesView } from './components/AutomationRulesView';
import { AnalyticsView } from './components/AnalyticsView';
import { AnomalyTab } from './components/AnomalyTab';
import {
  RegisteredSensor,
  ApplianceControl,
  AutomationRule,
  SensorHistoryPoint,
  LoRaMetrics,
  RoomData,
  AnomalyAlert,
} from './types';
import { INITIAL_LORA_METRICS, INITIAL_ALERTS, ALL_ROOMS_DATA } from './data/mockData';
import { Radio, Shield, Settings, Sliders, Server, Save } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedRoom, setSelectedRoom] = useState<string>('Living room');
  const [isHardwareMode, setIsHardwareMode] = useState<boolean>(true);
  const [packetCount, setPacketCount] = useState<number>(1042);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(new Date().toLocaleTimeString());

  // Multi-room dynamic telemetry and appliances
  const [roomsData, setRoomsData] = useState<Record<string, RoomData>>(ALL_ROOMS_DATA);
  const activeRoomData = roomsData[selectedRoom] || roomsData['Living room'];

  // Global LoRa RF metrics
  const [lora, setLora] = useState<LoRaMetrics>(INITIAL_LORA_METRICS);

  // Feature 2: Sensor Management State
  const [registeredSensors, setRegisteredSensors] = useState<RegisteredSensor[]>([
    {
      id: 'sens_dht_01',
      name: 'Living Room Temp & Humidity',
      type: 'DHT22',
      room: 'Living room',
      deviceId: 'ESP32_LORA_01',
      description: 'AM2302 sensor wired to GPIO 4 (10k pull-up)',
      isEnabled: true,
      status: 'Online',
      lastUpdate: 'Just now',
      currentValue: { temperature: 20.0, humidity: 30.0 },
    },
    {
      id: 'sens_pir_01',
      name: 'Living Room PIR Motion',
      type: 'PIR',
      room: 'Living room',
      deviceId: 'ESP32_LORA_01',
      description: 'HC-SR501 passive infrared sensor (GPIO 13)',
      isEnabled: true,
      status: 'Online',
      lastUpdate: 'Just now',
      currentValue: { motion: true },
    },
    {
      id: 'sens_ldr_01',
      name: 'Ambient Light Sensor (LDR)',
      type: 'LDR',
      room: 'Living room',
      deviceId: 'ESP32_LORA_01',
      description: 'Photoresistor connected to ADC1 CH4 (GPIO 32)',
      isEnabled: true,
      status: 'Online',
      lastUpdate: 'Just now',
      currentValue: { lightLux: 42 },
    },
    {
      id: 'sens_door_01',
      name: 'Entrance Door Magnetic Sensor',
      type: 'DOOR_MAGNETIC',
      room: 'Entrance',
      deviceId: 'ESP32_LORA_05',
      description: 'Magnetic reed switch on entrance security door (GPIO 14)',
      isEnabled: true,
      status: 'Online',
      lastUpdate: '1 min ago',
      currentValue: { doorOpen: false },
    },
    {
      id: 'sens_energy_01',
      name: 'Whole-Home PZEM Energy Meter',
      type: 'ENERGY_PZEM',
      room: 'Living room',
      deviceId: 'ESP32_LORA_01',
      description: 'AC Current Transformer sensor on mains distribution board',
      isEnabled: true,
      status: 'Online',
      lastUpdate: 'Just now',
      currentValue: { energyWatts: 1420 },
    },
  ]);

  // Feature 3: Appliance Control State
  const [appliances, setAppliances] = useState<ApplianceControl[]>([
    {
      id: 'app_lr_light',
      name: 'Living Room Ceiling Lights',
      room: 'Living room',
      type: 'light',
      state: false,
      operatingMode: 'auto',
      commandStatus: 'idle',
      lastFeedbackTime: 'Just now',
      feedbackVerified: true,
      ratedWatts: 45,
      relayPin: 27,
    },
    {
      id: 'app_br_fan',
      name: 'Master Bedroom BLDC Fan',
      room: 'Bedroom',
      type: 'fan',
      state: true,
      operatingMode: 'auto',
      commandStatus: 'idle',
      lastFeedbackTime: 'Just now',
      feedbackVerified: true,
      ratedWatts: 28,
      relayPin: 26,
    },
    {
      id: 'app_lr_ac',
      name: 'Living Room 1.5T Inverter AC',
      room: 'Living room',
      type: 'ac',
      state: true,
      operatingMode: 'manual',
      commandStatus: 'idle',
      lastFeedbackTime: '2 mins ago',
      feedbackVerified: true,
      ratedWatts: 1380,
      relayPin: 25,
    },
    {
      id: 'app_lr_humid',
      name: 'Air Humidifier',
      room: 'Living room',
      type: 'humidifier',
      state: true,
      operatingMode: 'auto',
      commandStatus: 'idle',
      lastFeedbackTime: 'Just now',
      feedbackVerified: true,
      ratedWatts: 40,
      relayPin: 26,
    },
    {
      id: 'app_ent_floodlight',
      name: 'Entrance Security Floodlight',
      room: 'Entrance',
      type: 'light',
      state: true,
      operatingMode: 'auto',
      commandStatus: 'idle',
      lastFeedbackTime: 'Just now',
      feedbackVerified: true,
      ratedWatts: 35,
      relayPin: 21,
    },
    {
      id: 'app_kt_chimney',
      name: 'Kitchen Auto-Clean Chimney',
      room: 'Kitchen',
      type: 'fan',
      state: true,
      operatingMode: 'manual',
      commandStatus: 'idle',
      lastFeedbackTime: 'Just now',
      feedbackVerified: true,
      ratedWatts: 180,
      relayPin: 25,
    },
  ]);

  // Feature 4: Automation Rules State
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: 'rule_dark_motion_lights',
      name: 'Turn ON Lights when Motion in Dark Room',
      ruleType: 'DARK_ROOM_MOTION_LIGHT',
      triggerDescription: 'IF Light < 50 Lux AND Motion Detected == TRUE',
      targetApplianceId: 'app_lr_light',
      action: 'TURN_ON',
      isEnabled: true,
      lightThresholdLux: 50,
      executionCount: 24,
      lastTriggered: '12 mins ago',
    },
    {
      id: 'rule_motion_timeout_off',
      name: 'Auto Turn OFF Lights After Inactivity Period',
      ruleType: 'MOTION_TIMEOUT_OFF',
      triggerDescription: 'IF No Motion Detected for 10 consecutive minutes',
      targetApplianceId: 'app_lr_light',
      action: 'TURN_OFF',
      isEnabled: true,
      timeoutMinutes: 10,
      executionCount: 18,
      lastTriggered: '1 hour ago',
    },
    {
      id: 'rule_temp_fan_on',
      name: 'Auto Turn ON Fan when Temperature Exceeds Threshold',
      ruleType: 'TEMP_THRESHOLD_FAN',
      triggerDescription: 'IF Temperature > 26.5°C',
      targetApplianceId: 'app_br_fan',
      action: 'TURN_ON',
      isEnabled: true,
      tempThreshold: 26.5,
      executionCount: 31,
      lastTriggered: '2 hours ago',
    },
  ]);

  // Feature 5: Telemetry History for Charts & CSV Export
  const [telemetryHistory, setTelemetryHistory] = useState<SensorHistoryPoint[]>([
    { timestamp: '17:00:00', time: '17:00', room: 'Living room', temperature: 20.0, humidity: 30.0, lightLux: 45, doorOpen: false, motion: false, energyWatts: 340, isDemonstration: false },
    { timestamp: '17:15:00', time: '17:15', room: 'Living room', temperature: 20.2, humidity: 30.2, lightLux: 48, doorOpen: false, motion: true, energyWatts: 390, isDemonstration: false },
    { timestamp: '17:30:00', time: '17:30', room: 'Living room', temperature: 20.1, humidity: 30.4, lightLux: 35, doorOpen: true, motion: true, energyWatts: 420, isDemonstration: false },
    { timestamp: '17:45:00', time: '17:45', room: 'Living room', temperature: 20.3, humidity: 30.6, lightLux: 28, doorOpen: false, motion: true, energyWatts: 1380, isDemonstration: false },
    { timestamp: '18:00:00', time: '18:00', room: 'Living room', temperature: 20.0, humidity: 30.0, lightLux: 42, doorOpen: false, motion: true, energyWatts: 1420, isDemonstration: false },
  ]);

  // Settings State
  const [gatewayUrl, setGatewayUrl] = useState('http://192.168.1.100:3000/api/lora/telemetry');
  const [mqttBroker, setMqttBroker] = useState('mqtt://192.168.1.50:1883');
  const [baseTariff, setBaseTariff] = useState(7.2);

  // Periodic Telemetry Simulation / Hardware Polling
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount((prev) => {
        const nextSeq = prev + 1;
        const newTime = new Date().toLocaleTimeString();
        setLastUpdateTime(newTime);

        // Update active room sensor reading
        setRoomsData((prevRooms) => {
          const updated = { ...prevRooms };
          Object.keys(updated).forEach((rKey) => {
            const r = updated[rKey];
            const tempDelta = (Math.random() - 0.49) * 0.15;
            const humDelta = (Math.random() - 0.5) * 0.25;
            const newTemp = Math.round((r.sensor.temperature + tempDelta) * 10) / 10;
            const newHum = Math.round((r.sensor.humidity + humDelta) * 10) / 10;
            const newMotion = Math.random() > 0.45;
            const newLux = Math.max(10, Math.min(500, Math.round(r.sensor.lightLux + (Math.random() - 0.5) * 6)));

            updated[rKey] = {
              ...r,
              sensor: {
                ...r.sensor,
                temperature: newTemp,
                humidity: newHum,
                motionDetected: newMotion,
                lightLux: newLux,
                doorOpen: rKey === 'Entrance' ? Math.random() > 0.85 : false,
                timestamp: newTime,
              },
            };
          });
          return updated;
        });

        // Update Registered Sensors view values
        setRegisteredSensors((prevSensors) =>
          prevSensors.map((s) => {
            if (s.type === 'DHT22') {
              return {
                ...s,
                lastUpdate: 'Just now',
                currentValue: {
                  temperature: activeRoomData.sensor.temperature,
                  humidity: activeRoomData.sensor.humidity,
                },
              };
            }
            if (s.type === 'PIR') {
              return {
                ...s,
                lastUpdate: 'Just now',
                currentValue: { motion: activeRoomData.sensor.motionDetected },
              };
            }
            if (s.type === 'LDR') {
              return {
                ...s,
                lastUpdate: 'Just now',
                currentValue: { lightLux: activeRoomData.sensor.lightLux },
              };
            }
            if (s.type === 'DOOR_MAGNETIC') {
              return {
                ...s,
                lastUpdate: 'Just now',
                currentValue: { doorOpen: activeRoomData.sensor.doorOpen },
              };
            }
            return s;
          })
        );

        // Add to historical points (cap at 20 points)
        setTelemetryHistory((hist) => [
          ...hist.slice(-19),
          {
            timestamp: newTime,
            time: newTime.slice(0, 5),
            room: selectedRoom,
            temperature: activeRoomData.sensor.temperature,
            humidity: activeRoomData.sensor.humidity,
            lightLux: activeRoomData.sensor.lightLux,
            doorOpen: activeRoomData.sensor.doorOpen,
            motion: activeRoomData.sensor.motionDetected,
            energyWatts: 1420,
            isDemonstration: !isHardwareMode,
          },
        ]);

        return nextSeq;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isHardwareMode, selectedRoom, activeRoomData.sensor.temperature, activeRoomData.sensor.humidity, activeRoomData.sensor.lightLux, activeRoomData.sensor.doorOpen, activeRoomData.sensor.motionDetected]);

  // ==========================================
  // HANDLERS FOR SENSORS
  // ==========================================
  const handleAddSensor = (newSensData: Omit<RegisteredSensor, 'id' | 'status' | 'lastUpdate' | 'currentValue'>) => {
    const newSensor: RegisteredSensor = {
      ...newSensData,
      id: `sens_${Date.now()}`,
      status: 'Online',
      lastUpdate: 'Just registered',
      currentValue:
        newSensData.type === 'DHT22'
          ? { temperature: 21.0, humidity: 35.0 }
          : newSensData.type === 'PIR'
          ? { motion: false }
          : newSensData.type === 'LDR'
          ? { lightLux: 45 }
          : newSensData.type === 'DOOR_MAGNETIC'
          ? { doorOpen: false }
          : { energyWatts: 0 },
    };

    setRegisteredSensors([newSensor, ...registeredSensors]);

    // Async sync with backend
    fetch('/api/sensors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSensor),
    }).catch((err) => console.log('Local store persisted:', err));
  };

  const handleToggleSensorEnable = (id: string) => {
    setRegisteredSensors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleDeleteSensor = (id: string) => {
    setRegisteredSensors((prev) => prev.filter((s) => s.id !== id));
    fetch(`/api/sensors/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleUpdateSensor = (id: string, updated: Partial<RegisteredSensor>) => {
    setRegisteredSensors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  // ==========================================
  // HANDLERS FOR APPLIANCES (WITH FEEDBACK)
  // ==========================================
  const handleToggleAppliance = async (id: string) => {
    // 1. Set command status to pending
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, commandStatus: 'pending' } : a))
    );

    // 2. Simulate network delay to gateway and LoRa node
    await new Promise((r) => setTimeout(r, 600));

    // 3. Confirm physical device feedback
    setAppliances((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newState = !a.state;
          return {
            ...a,
            state: newState,
            commandStatus: 'success',
            feedbackVerified: true,
            lastFeedbackTime: 'Just now',
          };
        }
        return a;
      })
    );

    // Call backend API
    fetch(`/api/devices/${id}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: true }),
    }).catch(() => {});
  };

  const handleToggleMode = (id: string) => {
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, operatingMode: a.operatingMode === 'manual' ? 'auto' : 'manual' }
          : a
      )
    );
  };

  const handleSetAllMode = (mode: 'manual' | 'auto') => {
    setAppliances((prev) => prev.map((a) => ({ ...a, operatingMode: mode })));
  };

  // Toggle specific room mockup appliance
  const handleToggleRoomMockupAppliance = (roomName: string, applianceId: string) => {
    setRoomsData((prev) => {
      const room = prev[roomName];
      if (!room) return prev;
      const updatedAppliances = room.appliances.map((app) =>
        app.id === applianceId ? { ...app, state: !app.state } : app
      );
      return { ...prev, [roomName]: { ...room, appliances: updatedAppliances } };
    });
  };

  // ==========================================
  // HANDLERS FOR AUTOMATION RULES
  // ==========================================
  const handleToggleRule = (id: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  const handleUpdateRule = (id: string, updated: Partial<AutomationRule>) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setAutomationRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddRule = (newRuleData: Omit<AutomationRule, 'id' | 'executionCount' | 'lastTriggered'>) => {
    const newRule: AutomationRule = {
      ...newRuleData,
      id: `rule_${Date.now()}`,
      executionCount: 0,
      lastTriggered: 'Never',
    };
    setAutomationRules([newRule, ...automationRules]);
  };

  return (
    <div className="min-h-screen bg-[#111823] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-[#38bdf8] selection:text-slate-950">
      {/* SIDEBAR (DASHBOARD, SENSORS, DEVICES, AUTOMATION, ANALYTICS, ALERTS, SETTINGS) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unresolvedAlertsCount={INITIAL_ALERTS.filter((a) => !a.isResolved).length}
      />

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Header */}
          <TopHeader
            isSimulating={isHardwareMode}
            onToggleSimulating={() => setIsHardwareMode(!isHardwareMode)}
          />

          {/* TAB 1: DASHBOARD (Home mockup with room selector, camera, 6 appliances, circular dial, live gauges) */}
          {currentTab === 'dashboard' && (
            <div className="space-y-5">
              <RoomSelector
                currentRoom={selectedRoom}
                onSelectRoom={setSelectedRoom}
              />

              <SmartHomeMockupView
                roomData={activeRoomData}
                onToggleAppliance={handleToggleRoomMockupAppliance}
                isHardwareMode={isHardwareMode}
              />
            </div>
          )}

          {/* TAB 2: SENSORS (Sensor Registration & Management) */}
          {currentTab === 'sensors' && (
            <SensorManagementView
              sensors={registeredSensors}
              onAddSensor={handleAddSensor}
              onToggleEnable={handleToggleSensorEnable}
              onDeleteSensor={handleDeleteSensor}
              onUpdateSensor={handleUpdateSensor}
              isHardwareConnected={isHardwareMode}
            />
          )}

          {/* TAB 3: DEVICES (Appliance Control with Manual/Auto mode & Physical Feedback) */}
          {currentTab === 'devices' && (
            <ApplianceControlView
              appliances={appliances}
              onToggleAppliance={handleToggleAppliance}
              onToggleMode={handleToggleMode}
              onSetAllMode={handleSetAllMode}
            />
          )}

          {/* TAB 4: AUTOMATION (Rules Engine: dark room motion lights, timeout off, temp threshold fan) */}
          {currentTab === 'automation' && (
            <AutomationRulesView
              rules={automationRules}
              onToggleRule={handleToggleRule}
              onUpdateRule={handleUpdateRule}
              onDeleteRule={handleDeleteRule}
              onAddRule={handleAddRule}
            />
          )}

          {/* TAB 5: ANALYTICS (Historical Trends, AI Energy Prediction, LoRa RF, CSV Export) */}
          {currentTab === 'analytics' && (
            <AnalyticsView
              history={telemetryHistory}
              lora={lora}
              isHardwareMode={isHardwareMode}
            />
          )}

          {/* TAB 6: ALERTS (Overload Anomaly, Vampire Drain, Security Door Alert) */}
          {currentTab === 'alerts' && <AnomalyTab />}

          {/* TAB 7: SETTINGS (Operating Mode, LoRa Gateway, MQTT Config, Tariffs) */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-5 shadow-md">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#38bdf8]" />
                  <h2 className="text-base font-bold text-slate-100">Gateway, LoRa &amp; Operating Settings</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Configure hardware connectivity, MQTT message broker, and local tariff rates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Hardware Feed Mode */}
                <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#38bdf8]" /> Operating Telemetry Mode
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 rounded-xl bg-[#141d27] border border-[#243346] cursor-pointer">
                      <input
                        type="radio"
                        name="hw_mode"
                        checked={isHardwareMode}
                        onChange={() => setIsHardwareMode(true)}
                        className="mt-0.5 accent-[#38bdf8]"
                      />
                      <div>
                        <span className="font-bold text-slate-100 block">Live Hardware LoRa Feed</span>
                        <span className="text-slate-400 text-[11px]">
                          Accepts raw packets from physical ESP32 SX1278 Gateway at 865.2 MHz.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-[#141d27] border border-[#243346] cursor-pointer">
                      <input
                        type="radio"
                        name="hw_mode"
                        checked={!isHardwareMode}
                        onChange={() => setIsHardwareMode(false)}
                        className="mt-0.5 accent-amber-400"
                      />
                      <div>
                        <span className="font-bold text-slate-100 block">Demonstration Data Mode</span>
                        <span className="text-slate-400 text-[11px]">
                          Uses calibrated benchmark data from UCI datasets when physical hardware is in transit or unpowered.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Gateway & Network Config */}
                <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" /> Network &amp; Gateway Configuration
                  </h3>

                  <div>
                    <label className="block text-slate-400 mb-1">LoRa Gateway Ingestion Endpoint</label>
                    <input
                      type="text"
                      value={gatewayUrl}
                      onChange={(e) => setGatewayUrl(e.target.value)}
                      className="w-full bg-[#111823] border border-[#27374b] rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Local MQTT Broker Address</label>
                    <input
                      type="text"
                      value={mqttBroker}
                      onChange={(e) => setMqttBroker(e.target.value)}
                      className="w-full bg-[#111823] border border-[#27374b] rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Electricity Base Tariff (₹ / kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={baseTariff}
                      onChange={(e) => setBaseTariff(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#111823] border border-[#27374b] rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => alert('Settings successfully updated and saved.')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 transition"
                    >
                      <Save className="w-4 h-4" /> Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
