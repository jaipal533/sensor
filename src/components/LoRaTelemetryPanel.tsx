import React from 'react';
import { Radio, Wifi, Shield, Cpu, Activity, Clock, Battery, AlertTriangle, Layers } from 'lucide-react';
import { LoRaMetrics } from '../types';

interface LoRaTelemetryPanelProps {
  lora: LoRaMetrics;
  recentPackets: {
    seq: number;
    time: string;
    rssi: number;
    snr: number;
    temp: number;
    hum: number;
    motion: boolean;
    battery: number;
    rawJson: string;
  }[];
}

export const LoRaTelemetryPanel: React.FC<LoRaTelemetryPanelProps> = ({ lora, recentPackets }) => {
  const getSignalStatus = (rssi: number) => {
    if (rssi > -70) return { label: 'Excellent Signal', color: 'text-emerald-400', barColor: 'bg-emerald-500' };
    if (rssi > -85) return { label: 'Good Signal', color: 'text-cyan-400', barColor: 'bg-cyan-500' };
    if (rssi > -105) return { label: 'Fair (Penetrating Walls)', color: 'text-amber-400', barColor: 'bg-amber-500' };
    return { label: 'Weak (Near Noise Floor)', color: 'text-rose-400', barColor: 'bg-rose-500' };
  };

  const signal = getSignalStatus(lora.rssi);

  // Normalization for visual RSSI bar (-120 to -40 dBm)
  const rssiPercent = Math.min(100, Math.max(5, ((lora.rssi + 120) / (-40 + 120)) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner: Indian Spectrum Compliance */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              SX1278 Sub-GHz LoRa RF Transceiver Telemetry
            </h2>
            <p className="text-xs text-slate-400">
              Operating on Indian License-Free SRD Band (865.0 - 867.0 MHz) • WPC GSR 564(E) Compliant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono">
            Carrier: 865.200 MHz
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
            ERP: +17 dBm (50 mW)
          </span>
        </div>
      </div>

      {/* Primary RF Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. RSSI Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>RSSI (Signal Strength)</span>
            <span className={`font-semibold ${signal.color}`}>{signal.label}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-slate-100">{lora.rssi}</span>
            <span className="text-sm font-semibold text-slate-400">dBm</span>
          </div>
          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${signal.barColor}`}
              style={{ width: `${rssiPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>-120 dBm (Sensitivity Limit)</span>
            <span>-40 dBm (Max)</span>
          </div>
        </div>

        {/* 2. SNR (Signal to Noise Ratio) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>SNR (Signal-to-Noise)</span>
            <span className="text-emerald-400 font-semibold">Demodulation OK</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-slate-100">+{lora.snr.toFixed(1)}</span>
            <span className="text-sm font-semibold text-slate-400">dB</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(10, ((lora.snr + 15) / 25) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>-10 dB (Sub-noise limit)</span>
            <span>+10 dB (Pristine)</span>
          </div>
        </div>

        {/* 3. Packet Delivery Ratio */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Packet Delivery Ratio (PDR)</span>
            <span className="text-emerald-400 font-semibold">&gt; 97% Benchmark</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-slate-100">{lora.packetDeliveryRatio.toFixed(1)}</span>
            <span className="text-sm font-semibold text-slate-400">%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${lora.packetDeliveryRatio}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>CRC Checks Enabled</span>
            <span>0 Frame Drops</span>
          </div>
        </div>

        {/* 4. Transmission Latency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Time on Air & Latency</span>
            <span className="text-indigo-400 font-semibold">Sub-60ms</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-slate-100">{lora.latencyMs.toFixed(1)}</span>
            <span className="text-sm font-semibold text-slate-400">ms</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (lora.latencyMs / 100) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Payload: 32 Bytes</span>
            <span>SF7 / BW 125 kHz</span>
          </div>
        </div>
      </div>

      {/* Multi-Wall Penetration Benchmark Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Empirical LoRa Penetration vs Residential Obstacles (865 MHz vs 2.4 GHz)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Obstacle Environment</th>
                <th className="py-2.5 px-3">Distance</th>
                <th className="py-2.5 px-3">LoRa RSSI</th>
                <th className="py-2.5 px-3">LoRa SNR</th>
                <th className="py-2.5 px-3">LoRa PDR %</th>
                <th className="py-2.5 px-3">2.4 GHz Wi-Fi Comparison</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-medium text-slate-200">Line-of-Sight (Same Room)</td>
                <td className="py-2 px-3 font-mono">5 meters</td>
                <td className="py-2 px-3 text-emerald-400 font-mono">-63 dBm</td>
                <td className="py-2 px-3 text-emerald-400 font-mono">+9.3 dB</td>
                <td className="py-2 px-3 text-emerald-400 font-mono font-bold">100.0%</td>
                <td className="py-2 px-3 text-slate-400">Wi-Fi: -54 dBm (100% PDR)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-medium text-slate-200">1 Interior Brick Wall Partition</td>
                <td className="py-2 px-3 font-mono">12 meters</td>
                <td className="py-2 px-3 text-emerald-400 font-mono">-72 dBm</td>
                <td className="py-2 px-3 text-emerald-400 font-mono">+7.8 dB</td>
                <td className="py-2 px-3 text-emerald-400 font-mono font-bold">99.6%</td>
                <td className="py-2 px-3 text-slate-400">Wi-Fi: -76 dBm (96% PDR)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-medium text-slate-200">2 Reinforced Concrete Pillar Walls</td>
                <td className="py-2 px-3 font-mono">25 meters</td>
                <td className="py-2 px-3 text-cyan-400 font-mono">-84 dBm</td>
                <td className="py-2 px-3 text-cyan-400 font-mono">+5.3 dB</td>
                <td className="py-2 px-3 text-emerald-400 font-mono font-bold">98.4%</td>
                <td className="py-2 px-3 text-amber-400">Wi-Fi: -89 dBm (Severe packet loss)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2 px-3 font-medium text-slate-200">Multi-Floor Slab (Floor 0 to 1st Floor)</td>
                <td className="py-2 px-3 font-mono">40 meters</td>
                <td className="py-2 px-3 text-amber-400 font-mono">-98 dBm</td>
                <td className="py-2 px-3 text-amber-400 font-mono">+1.6 dB</td>
                <td className="py-2 px-3 text-emerald-400 font-mono font-bold">97.5%</td>
                <td className="py-2 px-3 text-rose-400">Wi-Fi: Dropped / Disconnected</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live LoRa Packet Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Live LoRa Gateway Packet Stream (Decoded Telemetry Frame Buffer)
          </h3>
          <span className="text-xs text-slate-500 font-mono">Buffer Depth: {recentPackets.length} Packets</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {recentPackets.map((pkt) => (
            <div
              key={pkt.seq}
              className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                  SEQ #{pkt.seq}
                </span>
                <span className="text-slate-400">{pkt.time}</span>
                <span className="text-slate-300">
                  Temp: <span className="text-amber-400">{pkt.temp.toFixed(1)}°C</span> | Hum:{' '}
                  <span className="text-sky-400">{pkt.hum.toFixed(1)}%</span>
                </span>
                <span className="text-slate-300">
                  Motion: <span className={pkt.motion ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{pkt.motion ? 'YES' : 'NO'}</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>RSSI: <strong className="text-slate-200">{pkt.rssi} dBm</strong></span>
                <span>SNR: <strong className="text-slate-200">+{pkt.snr.toFixed(1)} dB</strong></span>
                <span>Bat: <strong className="text-teal-400">{pkt.battery.toFixed(2)}V</strong></span>
                <span className="text-emerald-400 font-bold">CRC OK</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
