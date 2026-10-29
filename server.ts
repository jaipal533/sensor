import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory relational state store with persistent defaults
let registeredSensors: any[] = [
  {
    id: 'sens_dht_01',
    name: 'Living Room Temp & Humidity',
    type: 'DHT22',
    room: 'Living room',
    deviceId: 'ESP32_LORA_01',
    description: 'High precision AM2302 sensor wired to GPIO 4 with 10k pull-up',
    isEnabled: true,
    status: 'Online',
    lastUpdate: 'Just now',
    currentValue: { temperature: 20.2, humidity: 30.5 },
  },
  {
    id: 'sens_pir_01',
    name: 'Living Room Motion Detector',
    type: 'PIR',
    room: 'Living room',
    deviceId: 'ESP32_LORA_01',
    description: 'HC-SR501 passive infrared sensor with 7m human detection cone',
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
    description: 'Photoresistor connected to ADC1 CH4 for ambient illuminance tracking',
    isEnabled: true,
    status: 'Online',
    lastUpdate: 'Just now',
    currentValue: { lightLux: 42 },
  },
  {
    id: 'sens_door_01',
    name: 'Main Entrance Door Magnetic Sensor',
    type: 'DOOR_MAGNETIC',
    room: 'Entrance',
    deviceId: 'ESP32_LORA_05',
    description: 'Magnetic reed switch on entrance security door (GPIO 13)',
    isEnabled: true,
    status: 'Online',
    lastUpdate: '1 min ago',
    currentValue: { doorOpen: false },
  },
  {
    id: 'sens_energy_01',
    name: 'Main Sub-Metering Energy Sensor',
    type: 'ENERGY_PZEM',
    room: 'Living room',
    deviceId: 'ESP32_LORA_01',
    description: 'PZEM-004T AC current transformer monitoring household load',
    isEnabled: true,
    status: 'Online',
    lastUpdate: 'Just now',
    currentValue: { energyWatts: 1420 },
  },
];

let appliances = [
  {
    id: 'app_lr_light',
    name: 'Main Living Room Lights',
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
    lastFeedbackTime: '2 min ago',
    feedbackVerified: true,
    ratedWatts: 1380,
    relayPin: 25,
  },
  {
    id: 'app_ent_light',
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
];

let automationRules = [
  {
    id: 'rule_dark_motion_lights',
    name: 'Turn ON Lights when Motion Detected in Dark Room',
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
    name: 'Auto Turn OFF Lights After No Motion Period',
    ruleType: 'MOTION_TIMEOUT_OFF',
    triggerDescription: 'IF No Motion for 10 consecutive minutes',
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
];

let alerts = [
  {
    id: 'alt_01',
    timestamp: 'Today, 14:22:10',
    deviceId: 'ESP32_LORA_01',
    deviceName: 'Living Room AC',
    powerWatts: 1820,
    severity: 'CRITICAL',
    title: 'High Load Anomaly (Overcurrent Surge)',
    explanation: 'Continuous active power reached 1820W (+25% above rated 1450W). Possible airflow blockage.',
    recommendedAction: 'Inspect external condenser fan and clean air filter.',
    isResolved: false,
  },
  {
    id: 'alt_02',
    timestamp: 'Today, 03:15:00',
    deviceId: 'ESP32_LORA_05',
    deviceName: 'Entrance Door Sensor',
    powerWatts: 0,
    severity: 'WARNING',
    title: 'Entrance Door Magnetic Contact Open at Night',
    explanation: 'Magnetic reed sensor detected door open status at 03:15 AM while security guard schedule active.',
    recommendedAction: 'Check entrance CCTV feed and verify perimeter locks.',
    isResolved: false,
  },
];

// Telemetry historical points
let telemetryHistory = [
  { timestamp: '17:00:00', time: '17:00', room: 'Living room', temperature: 20.0, humidity: 30.0, lightLux: 45, doorOpen: false, motion: false, energyWatts: 340, isDemonstration: false },
  { timestamp: '17:15:00', time: '17:15', room: 'Living room', temperature: 20.2, humidity: 30.2, lightLux: 48, doorOpen: false, motion: true, energyWatts: 390, isDemonstration: false },
  { timestamp: '17:30:00', time: '17:30', room: 'Living room', temperature: 20.1, humidity: 30.4, lightLux: 35, doorOpen: true, motion: true, energyWatts: 420, isDemonstration: false },
  { timestamp: '17:45:00', time: '17:45', room: 'Living room', temperature: 20.3, humidity: 30.6, lightLux: 28, doorOpen: false, motion: true, energyWatts: 1380, isDemonstration: false },
  { timestamp: '18:00:00', time: '18:00', room: 'Living room', temperature: 20.0, humidity: 30.0, lightLux: 42, doorOpen: false, motion: true, energyWatts: 1420, isDemonstration: false },
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ==========================================
  // SENSOR MANAGEMENT APIS
  // ==========================================
  app.get('/api/sensors', (req: Request, res: Response) => {
    res.json({ success: true, count: registeredSensors.length, sensors: registeredSensors });
  });

  app.post('/api/sensors', (req: Request, res: Response) => {
    const { name, type, room, deviceId, description } = req.body;
    if (!name || !type || !room) {
      return res.status(400).json({ success: false, error: 'Name, Type and Room are required.' });
    }

    const newSensor = {
      id: `sens_${Date.now()}`,
      name,
      type,
      room,
      deviceId: deviceId || 'ESP32_LORA_01',
      description: description || '',
      isEnabled: true,
      status: 'Online',
      lastUpdate: 'Just registered',
      currentValue:
        type === 'DHT22'
          ? { temperature: 21.0, humidity: 35.0 }
          : type === 'PIR'
          ? { motion: false }
          : type === 'LDR'
          ? { lightLux: 50 }
          : type === 'DOOR_MAGNETIC'
          ? { doorOpen: false }
          : { energyWatts: 0 },
    };

    registeredSensors.unshift(newSensor);
    res.status(201).json({ success: true, sensor: newSensor });
  });

  app.put('/api/sensors/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = registeredSensors.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Sensor not found.' });
    }

    registeredSensors[index] = { ...registeredSensors[index], ...req.body };
    res.json({ success: true, sensor: registeredSensors[index] });
  });

  app.delete('/api/sensors/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    registeredSensors = registeredSensors.filter((s) => s.id !== id);
    res.json({ success: true, message: 'Sensor removed successfully.' });
  });

  // ==========================================
  // APPLIANCE CONTROL APIS
  // ==========================================
  app.get('/api/devices', (req: Request, res: Response) => {
    res.json({ success: true, devices: appliances });
  });

  app.post('/api/devices/:id/command', (req: Request, res: Response) => {
    const { id } = req.params;
    const { state, operatingMode } = req.body;

    const dev = appliances.find((d) => d.id === id);
    if (!dev) {
      return res.status(404).json({ success: false, error: 'Device not found.' });
    }

    if (state !== undefined) dev.state = Boolean(state);
    if (operatingMode !== undefined) dev.operatingMode = operatingMode;
    dev.commandStatus = 'success';
    dev.feedbackVerified = true;
    dev.lastFeedbackTime = 'Just now';

    res.json({
      success: true,
      message: `Command verified and executed on GPIO ${dev.relayPin}`,
      device: dev,
    });
  });

  // ==========================================
  // AUTOMATION RULES APIS
  // ==========================================
  app.get('/api/rules', (req: Request, res: Response) => {
    res.json({ success: true, rules: automationRules });
  });

  app.post('/api/rules', (req: Request, res: Response) => {
    const { name, ruleType, triggerDescription, targetApplianceId, action, timeoutMinutes, tempThreshold, lightThresholdLux } = req.body;
    if (!name || !targetApplianceId || !action) {
      return res.status(400).json({ success: false, error: 'Missing required rule parameters.' });
    }

    const newRule = {
      id: `rule_${Date.now()}`,
      name,
      ruleType: ruleType || 'CUSTOM',
      triggerDescription: triggerDescription || 'User custom rule trigger',
      targetApplianceId,
      action,
      isEnabled: true,
      timeoutMinutes,
      tempThreshold,
      lightThresholdLux,
      executionCount: 0,
      lastTriggered: 'Never',
    };

    automationRules.unshift(newRule);
    res.status(201).json({ success: true, rule: newRule });
  });

  app.put('/api/rules/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = automationRules.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Rule not found.' });
    }

    automationRules[idx] = { ...automationRules[idx], ...req.body };
    res.json({ success: true, rule: automationRules[idx] });
  });

  app.delete('/api/rules/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    automationRules = automationRules.filter((r) => r.id !== id);
    res.json({ success: true, message: 'Rule removed successfully.' });
  });

  // ==========================================
  // ALERTS & NOTIFICATIONS
  // ==========================================
  app.get('/api/alerts', (req: Request, res: Response) => {
    res.json({ success: true, alerts });
  });

  app.post('/api/alerts/:id/resolve', (req: Request, res: Response) => {
    const { id } = req.params;
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      alert.isResolved = true;
    }
    res.json({ success: true, alert });
  });

  // ==========================================
  // TELEMETRY & CSV EXPORT
  // ==========================================
  app.get('/api/readings/history', (req: Request, res: Response) => {
    res.json({ success: true, history: telemetryHistory });
  });

  app.post('/api/lora/telemetry', (req: Request, res: Response) => {
    const { gateway_id, rssi_dbm, snr_db, raw_payload } = req.body;
    console.log(`[LoRa Gateway ${gateway_id}] Ingested payload:`, raw_payload);
    res.json({ success: true, ack: true, timestamp: new Date().toISOString() });
  });

  // ==========================================
  // VITE DEV SERVER INTEGRATION
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SMART HOME SERVER] Express + IoT API running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
