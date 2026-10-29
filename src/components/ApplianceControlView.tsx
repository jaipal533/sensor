import React, { useState } from 'react';
import {
  Lightbulb,
  Fan,
  Wind,
  Droplets,
  Wifi,
  Volume2,
  Lock,
  Cpu,
  Power,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { ApplianceControl } from '../types';

interface ApplianceControlViewProps {
  appliances: ApplianceControl[];
  onToggleAppliance: (id: string) => Promise<void>;
  onToggleMode: (id: string) => void;
  onSetAllMode: (mode: 'manual' | 'auto') => void;
}

export const ApplianceControlView: React.FC<ApplianceControlViewProps> = ({
  appliances,
  onToggleAppliance,
  onToggleMode,
  onSetAllMode,
}) => {
  const [filterRoom, setFilterRoom] = useState<string>('All');

  const getDeviceIcon = (type: ApplianceControl['type'], state: boolean) => {
    const color = state ? 'text-[#38bdf8]' : 'text-slate-500';
    switch (type) {
      case 'light':
        return <Lightbulb className={`w-6 h-6 ${state ? 'text-amber-400' : 'text-slate-500'}`} />;
      case 'fan':
        return <Fan className={`w-6 h-6 ${color}`} />;
      case 'ac':
        return <Wind className={`w-6 h-6 ${color}`} />;
      case 'humidifier':
        return <Droplets className={`w-6 h-6 ${color}`} />;
      case 'router':
        return <Wifi className={`w-6 h-6 ${color}`} />;
      default:
        return <Cpu className={`w-6 h-6 ${color}`} />;
    }
  };

  const filteredAppliances =
    filterRoom === 'All'
      ? appliances
      : appliances.filter((a) => a.room.toLowerCase() === filterRoom.toLowerCase());

  const activeCount = appliances.filter((a) => a.state).length;
  const totalWatts = appliances.reduce((sum, a) => sum + (a.state ? a.ratedWatts : 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary */}
      <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Power className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="text-base font-bold text-slate-100">Appliance Control &amp; Physical Feedback</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Optocoupled relay commands routed via MQTT Gateway to ESP32 LoRa nodes with physical state confirmation.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSetAllMode('auto')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#243447] hover:bg-[#2f435a] text-[#38bdf8] border border-[#30455e] transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Set All to Auto Mode</span>
          </button>
          <button
            onClick={() => onSetAllMode('manual')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#243447] hover:bg-[#2f435a] text-slate-300 border border-[#30455e] transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Set All to Manual</span>
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#1b2635] border border-[#27374b] rounded-xl p-3">
          <span className="text-[11px] text-slate-400 block">Active Appliances</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            {activeCount} <span className="text-xs text-slate-500 font-normal">/ {appliances.length}</span>
          </span>
        </div>
        <div className="bg-[#1b2635] border border-[#27374b] rounded-xl p-3">
          <span className="text-[11px] text-slate-400 block">Total Load Draw</span>
          <span className="text-xl font-bold font-mono text-cyan-400">
            {totalWatts} <span className="text-xs text-slate-500 font-normal">Watts</span>
          </span>
        </div>
        <div className="bg-[#1b2635] border border-[#27374b] rounded-xl p-3">
          <span className="text-[11px] text-slate-400 block">LoRa Transmission</span>
          <span className="text-xl font-bold font-mono text-emerald-400">ACK Verified</span>
        </div>
        <div className="bg-[#1b2635] border border-[#27374b] rounded-xl p-3">
          <span className="text-[11px] text-slate-400 block">Relay Bus Logic</span>
          <span className="text-xl font-bold font-mono text-amber-400">Active-LOW</span>
        </div>
      </div>

      {/* Room Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {['All', 'Living room', 'Bedroom', 'Kitchen', 'Entrance'].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRoom(r)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition ${
              filterRoom.toLowerCase() === r.toLowerCase()
                ? 'bg-[#38bdf8] text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-[#1b2635] text-slate-400 hover:text-slate-200 border border-[#27374b]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Appliances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppliances.map((app) => {
          const isPending = app.commandStatus === 'pending';

          return (
            <div
              key={app.id}
              className={`rounded-2xl border p-5 transition-all duration-200 shadow-md ${
                app.state
                  ? 'bg-[#1b2635] border-[#38bdf8]/40 shadow-sky-950/20'
                  : 'bg-[#151f2b] border-[#27374b] opacity-80 hover:opacity-100'
              }`}
            >
              {/* Top Row: Icon, Name & Room */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#111823] border border-[#27374b]">
                    {getDeviceIcon(app.type, app.state)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{app.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{app.room}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#111823] text-slate-300">
                        GPIO {app.relayPin}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ON / OFF Switch */}
                <button
                  disabled={isPending}
                  onClick={() => onToggleAppliance(app.id)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out disabled:opacity-50 ${
                    app.state ? 'bg-[#38bdf8]' : 'bg-slate-700'
                  }`}
                  title={`Click to turn ${app.state ? 'OFF' : 'ON'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      app.state ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Middle Row: Operating Mode Toggle (Manual vs Auto) */}
              <div className="mt-4 pt-3 border-t border-[#243346] flex items-center justify-between text-xs">
                <span className="text-slate-400">Mode:</span>
                <div className="flex bg-[#111823] p-0.5 rounded-lg border border-[#27374b]">
                  <button
                    onClick={() => onToggleMode(app.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                      app.operatingMode === 'manual'
                        ? 'bg-[#38bdf8] text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Manual Mode
                  </button>
                  <button
                    onClick={() => onToggleMode(app.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                      app.operatingMode === 'auto'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Auto / AI
                  </button>
                </div>
              </div>

              {/* Physical Feedback Confirmation & Command Status */}
              <div className="mt-3 pt-3 border-t border-[#243346] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  {isPending ? (
                    <span className="text-amber-400 flex items-center gap-1 font-mono">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Command Pending...
                    </span>
                  ) : app.feedbackVerified ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Hardware ACK Confirmed
                    </span>
                  ) : (
                    <span className="text-slate-400">Standby</span>
                  )}
                </div>

                <span className="font-mono font-bold text-slate-300">
                  {app.state ? `${app.ratedWatts} W` : '0 W'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
