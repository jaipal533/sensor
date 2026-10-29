import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Radio } from 'lucide-react';

interface TopHeaderProps {
  onSearch?: (term: string) => void;
  isSimulating: boolean;
  onToggleSimulating: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onSearch,
  isSimulating,
  onToggleSimulating,
}) => {
  const [timeStr, setTimeStr] = useState('18:00 PM');
  const [dateStr, setDateStr] = useState('Monday June 27, 2026');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setDateStr(
        now.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6">
      {/* Search Input Bar matching screenshot */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search devices, sensors, rules..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="w-full bg-[#1b2635] border border-[#27374b] rounded-full pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#38bdf8] transition shadow-inner"
        />
      </div>

      {/* Right User & Clock Info matching screenshot */}
      <div className="flex items-center gap-6">
        {/* LoRa Frequency Status */}
        <div
          onClick={onToggleSimulating}
          className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b2635] border border-[#27374b] text-[11px] text-slate-300 hover:border-[#38bdf8] transition"
          title="Toggle live telemetry stream"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSimulating ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
            }`}
          />
          <Radio className="w-3 h-3 text-[#38bdf8]" />
          <span>865.2 MHz (LoRa Online)</span>
        </div>

        {/* Live Clock & Date */}
        <div className="text-right hidden sm:block">
          <div className="text-sm font-bold text-slate-100 font-mono tracking-tight">{timeStr}</div>
          <div className="text-[11px] text-slate-400">{dateStr}</div>
        </div>

        {/* User Profile Pill matching screenshot */}
        <div className="flex items-center gap-2.5 bg-[#1b2635] border border-[#27374b] rounded-full pl-1.5 pr-3 py-1 cursor-pointer hover:border-[#38bdf8] transition">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User Avatar"
            className="w-7 h-7 rounded-full object-cover border border-[#38bdf8]"
          />
          <span className="text-xs font-semibold text-slate-200">Jaipal Yadav</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
