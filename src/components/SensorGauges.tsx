import React from 'react';
import { Thermometer, Droplets, UserCheck, UserX, BatteryCharging, Flame, Signal } from 'lucide-react';
import { SensorReading, LoRaMetrics } from '../types';

interface SensorGaugesProps {
  sensor: SensorReading;
  lora: LoRaMetrics;
}

export const SensorGauges: React.FC<SensorGaugesProps> = ({ sensor, lora }) => {
  const getBatteryPercent = (v: number) => {
    // 18650 Li-ion voltage mapping: 3.2V (0%) to 4.2V (100%)
    const pct = Math.min(100, Math.max(0, Math.round(((v - 3.2) / (4.2 - 3.2)) * 100)));
    return pct;
  };

  const batteryPct = getBatteryPercent(sensor.batteryVoltage);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Temperature */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Indoor Temp</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Thermometer className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-100">{sensor.temperature.toFixed(1)}</span>
            <span className="text-xs font-semibold text-slate-400">°C</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-400">DHT22 AM2302 (±0.5°C)</span>
        </div>
      </div>

      {/* 2. Humidity */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Rel. Humidity</span>
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-100">{sensor.humidity.toFixed(1)}</span>
            <span className="text-xs font-semibold text-slate-400">%</span>
          </div>
          <span className="text-[11px] font-medium text-sky-400">Comfort Zone (40-60%)</span>
        </div>
      </div>

      {/* 3. Heat Index */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Heat Index</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-100">{sensor.heatIndex.toFixed(1)}</span>
            <span className="text-xs font-semibold text-slate-400">°C</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Apparent Feel</span>
        </div>
      </div>

      {/* 4. Motion / Occupancy */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">PIR Motion</span>
          <div
            className={`p-1.5 rounded-lg ${
              sensor.motionDetected
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            {sensor.motionDetected ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                sensor.motionDetected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span className="text-lg font-bold text-slate-100">
              {sensor.motionDetected ? 'Active Motion' : 'No Movement'}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">HC-SR501 Infrared</span>
        </div>
      </div>

      {/* 5. 18650 Battery Voltage */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Node Battery</span>
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
            <BatteryCharging className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-100">{sensor.batteryVoltage.toFixed(2)}</span>
            <span className="text-xs font-semibold text-slate-400">V</span>
            <span className="text-xs font-bold text-emerald-400 ml-1">({batteryPct}%)</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">18650 Li-ion Cell</span>
        </div>
      </div>

      {/* 6. LoRa Link Signal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">LoRa RSSI</span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Signal className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-100">{lora.rssi}</span>
            <span className="text-xs font-semibold text-slate-400">dBm</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>SNR: +{lora.snr.toFixed(1)} dB</span>
            <span className="text-emerald-400 font-semibold">Strong Link</span>
          </div>
        </div>
      </div>
    </div>
  );
};
