import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Zap,
  Activity,
  Radio,
  Calendar,
  Layers,
  BarChart3,
  Thermometer,
  Droplets,
  Clock,
  Shield,
} from 'lucide-react';
import { SensorHistoryPoint, LoRaMetrics, EnergyHourlyData, EnergyModelMetric } from '../types';
import { HOURLY_ENERGY_FORECAST, ENERGY_MODEL_METRICS } from '../data/mockData';
import { exportSensorHistoryCsv } from '../utils/csvExporter';

interface AnalyticsViewProps {
  history: SensorHistoryPoint[];
  lora: LoRaMetrics;
  isHardwareMode: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  history,
  lora,
  isHardwareMode,
}) => {
  const [energyTimeframe, setEnergyTimeframe] = useState<'daily' | 'weekly'>('daily');
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(2); // Random Forest

  const selectedModel = ENERGY_MODEL_METRICS[selectedModelIdx];

  const handleExportCsv = () => {
    exportSensorHistoryCsv(
      history.map((h) => ({
        timestamp: h.timestamp,
        room: h.room,
        sensorType: 'Multi-Sensor Fusion (DHT22, LDR, Door, PIR)',
        temperature: h.temperature,
        humidity: h.humidity,
        motion: h.motion,
        lightLux: h.lightLux,
        doorOpen: h.doorOpen,
        energyWatts: h.energyWatts,
        nodeId: 'ESP32_LORA_01',
        rssi: lora.rssi,
      }))
    );
  };

  // SVG Chart Dimensions
  const chartWidth = 680;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  // Temperature curve points
  const tempMin = 15;
  const tempMax = 35;
  const tempPoints = history
    .map((d, i) => {
      const x = paddingX + (i / Math.max(1, history.length - 1)) * (chartWidth - 2 * paddingX);
      const y = chartHeight - paddingY - ((d.temperature - tempMin) / (tempMax - tempMin)) * (chartHeight - 2 * paddingY);
      return `${x},${y}`;
    })
    .join(' ');

  // Humidity curve points
  const humMin = 10;
  const humMax = 80;
  const humPoints = history
    .map((d, i) => {
      const x = paddingX + (i / Math.max(1, history.length - 1)) * (chartWidth - 2 * paddingX);
      const y = chartHeight - paddingY - ((d.humidity - humMin) / (humMax - humMin)) * (chartHeight - 2 * paddingY);
      return `${x},${y}`;
    })
    .join(' ');

  // Daily Energy Bars (Mon to Sun)
  const weeklyEnergy = [
    { day: 'Mon', actualKwh: 14.2, predictedKwh: 13.9 },
    { day: 'Tue', actualKwh: 12.8, predictedKwh: 13.1 },
    { day: 'Wed', actualKwh: 15.6, predictedKwh: 15.2 },
    { day: 'Thu', actualKwh: 13.4, predictedKwh: 13.5 },
    { day: 'Fri', actualKwh: 16.8, predictedKwh: 16.4 },
    { day: 'Sat', actualKwh: 19.2, predictedKwh: 18.7 },
    { day: 'Sun', actualKwh: 18.5, predictedKwh: 18.1 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with CSV Export */}
      <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="text-base font-bold text-slate-100">Telemetry Analytics &amp; Energy Forecasting</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical environmental trends, AI energy prediction, and LoRa link performance.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 transition active:scale-95 shadow-md shadow-sky-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Sensor History (CSV)</span>
        </button>
      </div>

      {/* Row 1: Temperature & Humidity Historical Time-Series Chart */}
      <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#38bdf8]" />
              Indoor Temperature &amp; Humidity Historical Trend
            </h3>
            <span className="text-xs text-slate-400">
              Sampled from calibrated DHT22 sensors via ESP32 LoRa wireless link
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-400 rounded-full" />
              <span className="text-slate-300">Temperature (°C)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 rounded-full" />
              <span className="text-slate-300">Humidity (% RH)</span>
            </div>
          </div>
        </div>

        {/* SVG Time-Series Chart */}
        <div className="w-full overflow-x-auto bg-[#141d27] rounded-xl p-3 border border-[#223143]">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 select-none">
            {/* Horizontal Grid */}
            {[20, 25, 30].map((t) => {
              const y = chartHeight - paddingY - ((t - tempMin) / (tempMax - tempMin)) * (chartHeight - 2 * paddingY);
              return (
                <g key={t}>
                  <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#1e2b3c" strokeDasharray="3 3" />
                  <text x={paddingX - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-500 font-mono">
                    {t}°C
                  </text>
                </g>
              );
            })}

            {/* Humidity Line (Cyan) */}
            <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={humPoints} />

            {/* Temperature Line (Amber) */}
            <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={tempPoints} />

            {/* Data points */}
            {history.map((d, i) => {
              const x = paddingX + (i / Math.max(1, history.length - 1)) * (chartWidth - 2 * paddingX);
              const yT = chartHeight - paddingY - ((d.temperature - tempMin) / (tempMax - tempMin)) * (chartHeight - 2 * paddingY);
              return (
                <g key={i}>
                  <circle cx={x} cy={yT} r="3" fill="#f59e0b" />
                  <text x={x} y={chartHeight - 6} textAnchor="middle" className="text-[9px] fill-slate-500 font-mono">
                    {d.time}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Row 2: AI Energy Forecaster: Actual vs Predicted */}
      <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              AI Energy Consumption Prediction (Actual vs Predicted)
            </h3>
            <span className="text-xs text-slate-400">
              Evaluated on UCI Appliances &amp; Household Electricity benchmarks
            </span>
          </div>

          <div className="flex bg-[#111823] p-1 rounded-xl border border-[#27374b] text-xs">
            {ENERGY_MODEL_METRICS.map((m, idx) => (
              <button
                key={m.name}
                onClick={() => setSelectedModelIdx(idx)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedModelIdx === idx
                    ? 'bg-[#38bdf8] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.name.split(' ')[0]} {m.type === 'Ensemble' ? '(Best)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Model Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-[#141d27] p-3 rounded-xl border border-[#223143]">
            <span className="text-[10px] text-slate-400 block">MAE (Error)</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{selectedModel.mae} Wh</span>
          </div>
          <div className="bg-[#141d27] p-3 rounded-xl border border-[#223143]">
            <span className="text-[10px] text-slate-400 block">RMSE</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{selectedModel.rmse} Wh</span>
          </div>
          <div className="bg-[#141d27] p-3 rounded-xl border border-[#223143]">
            <span className="text-[10px] text-slate-400 block">R² Score</span>
            <span className="text-xl font-bold font-mono text-amber-400">{selectedModel.r2.toFixed(3)}</span>
          </div>
          <div className="bg-[#141d27] p-3 rounded-xl border border-[#223143]">
            <span className="text-[10px] text-slate-400 block">Inference Latency</span>
            <span className="text-xl font-bold font-mono text-indigo-400">{selectedModel.latencyMs} ms</span>
          </div>
        </div>

        {/* Weekly Energy Consumption Bar Chart */}
        <div className="bg-[#141d27] rounded-xl p-4 border border-[#223143]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span>Weekly Aggregated Load Profile (Sub-Metering Current Sensor)</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Actual Metered
              </span>
              <span className="flex items-center gap-1 font-mono text-[#38bdf8]">
                <span className="w-2.5 h-2.5 rounded bg-[#38bdf8]" /> AI Predicted
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 h-36 items-end pt-4">
            {weeklyEnergy.map((w) => (
              <div key={w.day} className="flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-28">
                  {/* Actual Bar */}
                  <div
                    className="w-3.5 sm:w-5 bg-emerald-500 rounded-t transition-all duration-300"
                    style={{ height: `${(w.actualKwh / 22) * 100}%` }}
                    title={`Actual: ${w.actualKwh} kWh`}
                  />
                  {/* Predicted Bar */}
                  <div
                    className="w-3.5 sm:w-5 bg-[#38bdf8] rounded-t transition-all duration-300 opacity-90"
                    style={{ height: `${(w.predictedKwh / 22) * 100}%` }}
                    title={`Predicted: ${w.predictedKwh} kWh`}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{w.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: LoRa Hardware RF Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">LoRa RSSI</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{lora.rssi} dBm</div>
          <span className="text-[10px] text-slate-500">Sub-GHz 865.2 MHz</span>
        </div>

        <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">Signal-to-Noise (SNR)</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">+{lora.snr.toFixed(1)} dB</div>
          <span className="text-[10px] text-slate-500">Demodulation Margin</span>
        </div>

        <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">Packet Delivery Ratio</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{lora.packetDeliveryRatio}%</div>
          <span className="text-[10px] text-slate-500">0 CRC Drops</span>
        </div>

        <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">Round-Trip Latency</span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">{lora.latencyMs} ms</div>
          <span className="text-[10px] text-slate-500">Time on Air (SF7)</span>
        </div>
      </div>
    </div>
  );
};
