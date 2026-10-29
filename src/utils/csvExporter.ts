/**
 * Utility for exporting sensor history and telemetry to CSV.
 * Allows downloading tabular sensor logs without bundling application source code.
 */

export function exportSensorHistoryCsv(readings: {
  timestamp: string;
  room: string;
  sensorType: string;
  temperature?: number;
  humidity?: number;
  motion?: boolean;
  lightLux?: number;
  doorOpen?: boolean;
  energyWatts?: number;
  nodeId: string;
  rssi?: number;
}[], filename = 'sensor_telemetry_history.csv') {
  if (!readings || readings.length === 0) {
    alert('No telemetry readings available to export.');
    return;
  }

  const headers = [
    'Timestamp',
    'Room',
    'Sensor Type',
    'Node ID',
    'Temperature (C)',
    'Humidity (%)',
    'Motion Detected',
    'Light Intensity (Lux)',
    'Door Status',
    'Energy Draw (Watts)',
    'LoRa RSSI (dBm)',
  ];

  const rows = readings.map((r) => [
    `"${r.timestamp}"`,
    `"${r.room}"`,
    `"${r.sensorType}"`,
    `"${r.nodeId}"`,
    r.temperature !== undefined ? r.temperature : '',
    r.humidity !== undefined ? r.humidity : '',
    r.motion !== undefined ? (r.motion ? 'YES' : 'NO') : '',
    r.lightLux !== undefined ? r.lightLux : '',
    r.doorOpen !== undefined ? (r.doorOpen ? 'OPEN' : 'CLOSED') : '',
    r.energyWatts !== undefined ? r.energyWatts : '',
    r.rssi !== undefined ? r.rssi : '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
