import React from 'react';
import { Wind, Fan, Lightbulb, Flame, Lock, Unlock, Power, Cpu } from 'lucide-react';
import { Device } from '../types';

interface DeviceControlCardProps {
  device: Device;
  onToggle: (id: string) => void;
  onToggleOverride: (id: string) => void;
}

export const DeviceControlCard: React.FC<DeviceControlCardProps> = ({
  device,
  onToggle,
  onToggleOverride,
}) => {
  const getDeviceIcon = () => {
    switch (device.type) {
      case 'ac':
        return <Wind className="w-5 h-5 text-cyan-400" />;
      case 'fan':
        return <Fan className="w-5 h-5 text-indigo-400" />;
      case 'light':
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'water_heater':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'refrigerator':
      default:
        return <Cpu className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        device.state
          ? 'bg-slate-900 border-slate-700/80 shadow-md shadow-emerald-950/20'
          : 'bg-slate-900/60 border-slate-800 opacity-80 hover:opacity-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              device.state
                ? 'bg-slate-800 border-slate-700 shadow-sm'
                : 'bg-slate-800/40 border-slate-800 text-slate-500'
            }`}
          >
            {getDeviceIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">{device.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">{device.room}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                GPIO {device.relayPin}
              </span>
            </div>
          </div>
        </div>

        {/* Master ON/OFF Toggle Switch */}
        <button
          onClick={() => onToggle(device.id)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            device.state ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
          title={`Click to turn ${device.state ? 'OFF' : 'ON'}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              device.state ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Wattage & Power Indicator */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400">Power Draw:</span>{' '}
          <span className={`font-mono font-bold ${device.state ? 'text-emerald-400' : 'text-slate-500'}`}>
            {device.state ? `${device.currentWatts} W` : '0 W'}
          </span>
          <span className="text-slate-500 text-[10px] ml-1 font-mono">/ {device.ratedWatts}W rated</span>
        </div>

        {/* Manual Lock / Override */}
        <button
          onClick={() => onToggleOverride(device.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border transition ${
            device.manualOverride
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Manual override prevents AI automation rules from modifying device state"
        >
          {device.manualOverride ? (
            <>
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Locked</span>
            </>
          ) : (
            <>
              <Unlock className="w-3 h-3" />
              <span>Auto (AI)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
