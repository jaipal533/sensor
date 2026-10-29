export type SensorType = 'DHT22' | 'PIR' | 'LDR' | 'DOOR_MAGNETIC' | 'ENERGY_PZEM';

export interface RegisteredSensor {
  id: string;
  name: string;
  type: SensorType;
  room: string;
  deviceId: string;
  description: string;
  isEnabled: boolean;
  status: 'Online' | 'Disconnected' | 'Standby';
  lastUpdate: string;
  currentValue: {
    temperature?: number;
    humidity?: number;
    motion?: boolean;
    lightLux?: number;
    doorOpen?: boolean;
    energyWatts?: number;
  };
}

export interface ApplianceControl {
  id: string;
  name: string;
  room: string;
  type: 'light' | 'fan' | 'ac' | 'humidifier' | 'router' | 'speaker' | 'other';
  state: boolean;
  operatingMode: 'manual' | 'auto';
  commandStatus: 'idle' | 'pending' | 'success' | 'failed';
  lastFeedbackTime: string;
  feedbackVerified: boolean;
  ratedWatts: number;
  relayPin: number;
}

export interface Device {
  id: string;
  name: string;
  room: string;
  type: 'ac' | 'fan' | 'light' | 'refrigerator' | 'water_heater';
  relayPin: number;
  isActive: boolean;
  state: boolean;
  ratedWatts: number;
  currentWatts: number;
  manualOverride: boolean;
}

export type RuleType = 'DARK_ROOM_MOTION_LIGHT' | 'MOTION_TIMEOUT_OFF' | 'TEMP_THRESHOLD_FAN' | 'CUSTOM';

export interface AutomationRule {
  id: string;
  name: string;
  ruleType?: RuleType;
  condition?: string;
  triggerDescription?: string;
  targetDeviceId?: string;
  targetApplianceId?: string;
  action: 'TURN_ON' | 'TURN_OFF';
  isEnabled: boolean;
  timeoutMinutes?: number;
  tempThreshold?: number;
  lightThresholdLux?: number;
  executionCount: number;
  lastTriggered?: string;
}

export interface SensorReading {
  temperature: number; // °C
  humidity: number;    // %
  motionDetected: boolean;
  lightLux: number;    // LDR illuminance in Lux
  doorOpen: boolean;   // Door magnetic reed switch (true = Open, false = Closed)
  batteryVoltage: number; // Volts
  heatIndex: number;
  timestamp: string;
}

export interface SensorHistoryPoint {
  timestamp: string;
  time: string;
  room: string;
  temperature: number;
  humidity: number;
  lightLux: number;
  doorOpen: boolean;
  motion: boolean;
  energyWatts: number;
  isDemonstration: boolean;
}

export interface LoRaMetrics {
  rssi: number;
  snr: number;
  frequency: number;
  spreadingFactor: number;
  bandwidthKhz: number;
  codingRate: string;
  txPowerDbm: number;
  packetSeq: number;
  latencyMs: number;
  packetDeliveryRatio: number;
  lastPacketTime: string;
}

export interface EnergyModelMetric {
  name: string;
  type: 'Baseline' | 'Advanced Regressor' | 'Ensemble';
  mae: number;
  rmse: number;
  r2: number;
  latencyMs: number;
  description: string;
}

export interface EnergyHourlyData {
  hour: string;
  actualWatts: number;
  predictedWatts: number;
  baselineWatts: number;
  isPeak: boolean;
}

export interface OccupancyMetric {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
    truePositive: number;
  };
}

export interface AnomalyAlert {
  id: string;
  timestamp: string;
  deviceId?: string;
  deviceName?: string;
  powerWatts: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  explanation: string;
  recommendedAction: string;
  isResolved: boolean;
}

export interface DatasetInfo {
  id: string;
  name: string;
  source: string;
  url: string;
  totalRecords: string;
  description: string;
  columns: { name: string; unit: string; description: string }[];
  sampleData: Record<string, string | number>[];
  downloadFileName: string;
}

export interface RoomAppliance {
  id: string;
  name: string;
  state: boolean;
  activeTime: string;
  type: 'tv' | 'ac' | 'humidifier' | 'light' | 'router' | 'speaker' | 'fan' | 'fridge' | 'chimney' | 'lock' | 'cooler' | 'heater' | 'camera';
  isHighlighted?: boolean;
  ratedWatts: number;
  relayPin: number;
}

export interface RoomData {
  id: string;
  name: string;
  nodeId: string;
  esp32Pinout: string;
  sensor: SensorReading;
  lora: {
    rssi: number;
    snr: number;
    frequency: number;
  };
  camera: {
    name: string;
    imageUrl: string;
    resolution: string;
    status: string;
  };
  settings: {
    scheduleFrom: string;
    scheduleTo: string;
    totalEnergySavingKwh: number;
    sunIconColor: string;
  };
  dialControl: {
    title: string;
    unit: string;
    value: number;
    subtext: string;
    min: number;
    max: number;
  };
  appliances: RoomAppliance[];
}
