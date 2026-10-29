import React, { useState } from 'react';
import { Zap, TrendingUp, Sliders, CheckCircle2, AlertCircle, BarChart3, Layers, Compass } from 'lucide-react';
import { EnergyModelMetric, EnergyHourlyData } from '../types';
import { ENERGY_MODEL_METRICS, HOURLY_ENERGY_FORECAST } from '../data/mockData';

export const EnergyPredictionTab: React.FC = () => {
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(2); // Default to Random Forest
  const [simTemp, setSimTemp] = useState<number>(32); // What-If Outdoor Temp (°C)
  const [simAcHours, setSimAcHours] = useState<number>(6); // What-If AC runtime hours

  const selectedModel = ENERGY_MODEL_METRICS[selectedModelIdx];

  // What-If dynamic energy calculation
  // Base household consumption: 8 kWh/day + (simAcHours * 1.35 kWh * (simTemp > 28 ? 1 + (simTemp - 28) * 0.04 : 0.8))
  const simulatedDailyKwh = (8.2 + simAcHours * 1.38 * (simTemp >= 25 ? 1 + (simTemp - 25) * 0.035 : 0.75)).toFixed(2);
  const baselineWithoutAiKwh = (parseFloat(simulatedDailyKwh) * 1.22).toFixed(2);
  const projectedMonthlySavingsInr = ((parseFloat(baselineWithoutAiKwh) - parseFloat(simulatedDailyKwh)) * 30 * 7.5).toFixed(0);

  // SVG Chart calculation parameters
  const chartHeight = 220;
  const chartWidth = 720;
  const maxWatts = 2500;
  const paddingX = 40;
  const paddingY = 25;

  const getPoints = (key: 'actualWatts' | 'predictedWatts' | 'baselineWatts') => {
    return HOURLY_ENERGY_FORECAST.map((d, i) => {
      const x = paddingX + (i / (HOURLY_ENERGY_FORECAST.length - 1)) * (chartWidth - 2 * paddingX);
      const val = d[key];
      const y = chartHeight - paddingY - (val / maxWatts) * (chartHeight - 2 * paddingY);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Zap className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-slate-100">
                Machine Learning Energy Consumption Forecasting Lab
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Trained on UCI Appliances Energy &amp; Household Electric Power Consumption benchmarks.
            </p>
          </div>

          {/* Model Switcher Tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
            {ENERGY_MODEL_METRICS.map((m, idx) => (
              <button
                key={m.name}
                onClick={() => setSelectedModelIdx(idx)}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  selectedModelIdx === idx
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.name.split(' ')[0]} {m.type === 'Ensemble' ? 'RF (Best)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Model Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Mean Absolute Error (MAE)</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-emerald-400">{selectedModel.mae}</span>
              <span className="text-xs text-slate-500 font-mono">Wh</span>
            </div>
            <span className="text-[10px] text-slate-500">Average absolute deviation</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Root Mean Squared Error</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-cyan-400">{selectedModel.rmse}</span>
              <span className="text-xs text-slate-500 font-mono">Wh</span>
            </div>
            <span className="text-[10px] text-slate-500">Penalizes large load errors</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Coefficient of Determination (R²)</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-amber-400">{selectedModel.r2.toFixed(3)}</span>
            </div>
            <span className="text-[10px] text-slate-500">Variance explained by model</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Model Complexity &amp; Latency</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-indigo-400">{selectedModel.latencyMs}</span>
              <span className="text-xs text-slate-500 font-mono">ms</span>
            </div>
            <span className="text-[10px] text-slate-500">Edge inference runtime</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Chart: Actual vs Predicted Energy */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              24-Hour Energy Consumption: Ground Truth vs Predicted Curve
            </h3>
            <p className="text-xs text-slate-400">
              Comparing Actual Metered Watts vs {selectedModel.name} and unoptimized baseline.
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Actual Metered (W)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400" />
              <span className="text-slate-300">AI Predicted (W)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-rose-400 border-t border-dashed" />
              <span className="text-slate-300">Unmanaged Baseline</span>
            </div>
          </div>
        </div>

        {/* SVG Responsive Line Chart */}
        <div className="w-full overflow-x-auto bg-slate-950/80 rounded-xl p-4 border border-slate-800/80">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-56 select-none"
          >
            {/* Grid lines */}
            {[500, 1000, 1500, 2000].map((w) => {
              const y = chartHeight - paddingY - (w / maxWatts) * (chartHeight - 2 * paddingY);
              return (
                <g key={w}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                  />
                  <text x={paddingX - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-500 font-mono">
                    {w}W
                  </text>
                </g>
              );
            })}

            {/* Peak Hour Highlights */}
            {HOURLY_ENERGY_FORECAST.map((d, i) => {
              if (!d.isPeak) return null;
              const x = paddingX + (i / (HOURLY_ENERGY_FORECAST.length - 1)) * (chartWidth - 2 * paddingX);
              return (
                <line
                  key={`peak-${i}`}
                  x1={x}
                  y1={paddingY}
                  x2={x}
                  y2={chartHeight - paddingY}
                  stroke="#ef4444"
                  strokeOpacity="0.15"
                  strokeWidth="20"
                />
              );
            })}

            {/* Unmanaged Baseline Line (Dashed Rose) */}
            <polyline
              fill="none"
              stroke="#fb7185"
              strokeWidth="2"
              strokeDasharray="4 3"
              points={getPoints('baselineWatts')}
            />

            {/* Predicted Line (Cyan) */}
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              points={getPoints('predictedWatts')}
            />

            {/* Actual Line (Emerald) */}
            <polyline
              fill="none"
              stroke="#34d399"
              strokeWidth="3"
              points={getPoints('actualWatts')}
            />

            {/* Actual Data Points */}
            {HOURLY_ENERGY_FORECAST.map((d, i) => {
              const x = paddingX + (i / (HOURLY_ENERGY_FORECAST.length - 1)) * (chartWidth - 2 * paddingX);
              const yActual = chartHeight - paddingY - (d.actualWatts / maxWatts) * (chartHeight - 2 * paddingY);
              const yPred = chartHeight - paddingY - (d.predictedWatts / maxWatts) * (chartHeight - 2 * paddingY);
              return (
                <g key={i}>
                  <circle cx={x} cy={yActual} r="3.5" fill="#10b981" />
                  <circle cx={x} cy={yPred} r="2.5" fill="#38bdf8" />
                  <text
                    x={x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-500 font-mono"
                  >
                    {d.hour}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-1">
          <span>* Red shaded columns indicate State Electricity Utility Peak Hours (18:00 - 22:00)</span>
          <span>Sampling Interval: 2 Hours</span>
        </div>
      </div>

      {/* Two Column Section: Feature Importance & What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Random Forest Gini Feature Importance Score
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Identifies variables with highest predictive power for household power demand.
          </p>

          <div className="space-y-3">
            {[
              { name: 'Hour of Day (Time-of-Use cycles)', weight: 34, color: 'bg-emerald-500' },
              { name: 'Outdoor Temperature T_out (°C)', weight: 26, color: 'bg-cyan-500' },
              { name: 'Historical Lag Consumption (t-1, t-2)', weight: 19, color: 'bg-indigo-500' },
              { name: 'Indoor Thermal Gradient (T1 - T_out)', weight: 11, color: 'bg-amber-500' },
              { name: 'Relative Humidity RH_1 (%)', weight: 6, color: 'bg-sky-500' },
              { name: 'Light Fixture Usage (Wh)', weight: 4, color: 'bg-rose-500' },
            ].map((f) => (
              <div key={f.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{f.name}</span>
                  <span className="font-mono font-semibold text-slate-200">{f.weight}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${f.color}`} style={{ width: `${f.weight * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Interactive Scenario Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Interactive "What-If" Demand &amp; Tariff Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Simulate ambient temperature and appliance runtime to estimate predicted daily demand.
            </p>

            {/* Slider 1: Outdoor Temperature */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Ambient Outdoor Temperature</span>
                <span className="font-mono font-bold text-amber-400">{simTemp}°C</span>
              </div>
              <input
                type="range"
                min="18"
                max="45"
                value={simTemp}
                onChange={(e) => setSimTemp(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>18°C (Mild)</span>
                <span>32°C (Summer)</span>
                <span>45°C (Heatwave)</span>
              </div>
            </div>

            {/* Slider 2: AC Runtime Hours */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Daily Air Conditioner Runtime</span>
                <span className="font-mono font-bold text-cyan-400">{simAcHours} Hours / Day</span>
              </div>
              <input
                type="range"
                min="0"
                max="18"
                value={simAcHours}
                onChange={(e) => setSimAcHours(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0h (Eco Off)</span>
                <span>8h (Standard)</span>
                <span>18h (Heavy)</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">AI Optimized Consumption</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{simulatedDailyKwh} kWh/day</span>
              </div>
              <div>
                <span className="text-slate-500 block">Unmanaged Consumption</span>
                <span className="text-lg font-bold font-mono text-slate-400">{baselineWithoutAiKwh} kWh/day</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-300">Projected Monthly Savings (at ₹7.50/kWh):</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">₹{projectedMonthlySavingsInr} / mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
