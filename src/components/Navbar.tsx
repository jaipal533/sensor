import React from 'react';
import { Radio, Activity, Cpu, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isHardwareMode: boolean;
  setIsHardwareMode: (val: boolean) => void;
  packetCount: number;
  unresolvedAlertCount: number;
  lastUpdateTime: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isHardwareMode,
  setIsHardwareMode,
  packetCount,
  unresolvedAlertCount,
  lastUpdateTime,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#141c26]/95 backdrop-blur-md border-b border-[#1e2b3b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Identity & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-100">SmartHome LoRa-IoT</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                865.2 MHz (India Band)
              </span>
            </div>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Last Update: {lastUpdateTime}
            </span>
          </div>

          {/* Right Controls: Mode Toggle (Live Hardware vs Demonstration Data) */}
          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <button
              onClick={() => setIsHardwareMode(!isHardwareMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isHardwareMode
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#1b2635] border-amber-500/40 text-amber-300'
              }`}
              title="Click to toggle between Live Hardware LoRa Feed and Demonstration Data Mode"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isHardwareMode ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              <span>{isHardwareMode ? 'Live Hardware LoRa Feed' : 'Demonstration Data Mode'}</span>
              <span className="bg-[#111823] px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                #{packetCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
