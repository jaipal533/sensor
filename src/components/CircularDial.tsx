import React, { useState } from 'react';
import { Minus, Plus, Droplets, Wind, Sun } from 'lucide-react';

interface CircularDialProps {
  value?: number;
  onChange?: (val: number) => void;
  title?: string;
  unit?: string;
  min?: number;
  max?: number;
}

export const CircularDial: React.FC<CircularDialProps> = ({
  value = 70,
  onChange,
  title = 'Air Humidifier',
  unit = '%',
  min = 0,
  max = 100,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const currentValue = onChange ? value : internalValue;

  const handleUpdate = (newVal: number) => {
    const clamped = Math.min(max, Math.max(min, newVal));
    setInternalValue(clamped);
    if (onChange) onChange(clamped);
  };

  // Generate radial tick marks (40 ticks around 360 deg)
  const totalTicks = 36;
  const radius = 105;
  const center = 130;

  // Percentage for progress arc
  const pct = (currentValue - min) / (max - min);
  const arcStrokeDash = 2 * Math.PI * 72; // r=72
  const arcOffset = arcStrokeDash * (1 - pct);

  return (
    <div className="bg-[#1b2736] border border-[#27374b] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-[#38bdf8]" />
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Auto (LoRa)</span>
      </div>

      {/* Circular Radial Dial Canvas / SVG */}
      <div className="relative flex items-center justify-center my-3">
        {/* Cardinal percentage markers */}
        <span className="absolute top-0 text-[10px] font-semibold text-slate-400">0%</span>
        <span className="absolute right-3 text-[10px] font-semibold text-slate-400">25%</span>
        <span className="absolute bottom-1 text-[10px] font-semibold text-slate-400">50%</span>
        <span className="absolute left-3 text-[10px] font-semibold text-slate-400">75%</span>

        <svg width="260" height="260" className="select-none">
          {/* Radial tick marks */}
          {Array.from({ length: totalTicks }).map((_, i) => {
            const angle = (i * 360) / totalTicks - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = center + (radius - 10) * Math.cos(rad);
            const y1 = center + (radius - 10) * Math.sin(rad);
            const x2 = center + radius * Math.cos(rad);
            const y2 = center + radius * Math.sin(rad);

            const tickProgress = i / totalTicks;
            const isHighlighted = tickProgress <= pct;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isHighlighted ? '#38bdf8' : '#27384e'}
                strokeWidth={isHighlighted ? '2.5' : '1.5'}
                strokeLinecap="round"
              />
            );
          })}

          {/* Outer circle track */}
          <circle
            cx={center}
            cy={center}
            r="82"
            fill="none"
            stroke="#16202c"
            strokeWidth="8"
          />

          {/* Active cyan progress circle */}
          <circle
            cx={center}
            cy={center}
            r="72"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="5"
            strokeDasharray={arcStrokeDash}
            strokeDashoffset={arcOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-300"
          />

          {/* Concentric Dark Center Disc */}
          <circle
            cx={center}
            cy={center}
            r="56"
            fill="#141d27"
            stroke="#27384e"
            strokeWidth="2"
            className="shadow-inner"
          />
        </svg>

        {/* Center Value Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-100 font-mono tracking-tight">
            {currentValue}
            <span className="text-lg font-normal text-slate-400">{unit}</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-medium mt-0.5">Optimal</span>
        </div>

        {/* Stepper Controls */}
        <button
          onClick={() => handleUpdate(currentValue - 5)}
          className="absolute left-2 w-8 h-8 rounded-lg bg-[#243447] hover:bg-[#2e4259] text-slate-300 flex items-center justify-center border border-[#30455e] transition active:scale-95 shadow-md"
          title="Decrease"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleUpdate(currentValue + 5)}
          className="absolute right-2 w-8 h-8 rounded-lg bg-[#0ea5e9] hover:bg-[#38bdf8] text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 transition active:scale-95"
          title="Increase"
        >
          <Plus className="w-4 h-4 font-bold" />
        </button>
      </div>

      {/* Bottom Sub-control */}
      <div className="pt-3 border-t border-[#27374b] flex items-center justify-between text-xs text-slate-400">
        <span>Target Moisture: 65 - 75%</span>
        <span className="text-[#38bdf8] font-semibold">Active Mode</span>
      </div>
    </div>
  );
};
