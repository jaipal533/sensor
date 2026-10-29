import React from 'react';
import {
  Home,
  Cpu,
  Tv,
  Sliders,
  TrendingUp,
  AlertTriangle,
  Settings,
  Radio,
  LogOut,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  unresolvedAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unresolvedAlertsCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'sensors', label: 'Sensors', icon: Cpu },
    { id: 'devices', label: 'Devices', icon: Tv },
    { id: 'automation', label: 'Automation', icon: Sliders },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: unresolvedAlertsCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#141c26] border-r border-[#1e2b3b] flex flex-col justify-between py-6 px-4 text-slate-300 select-none flex-shrink-0 min-h-screen">
      {/* Top Branding */}
      <div>
        <div
          className="flex items-center gap-2.5 px-3 mb-8 cursor-pointer"
          onClick={() => onSelectTab('dashboard')}
        >
          {/* Logo matching the reference screenshot */}
          <div className="w-8 h-8 rounded-lg border-2 border-[#38bdf8] flex items-center justify-center text-[#38bdf8] relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="w-5 h-5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
              smart <span className="text-[#38bdf8]">HOME</span>
            </span>
            <span className="text-[10px] text-slate-500 block leading-tight font-mono">
              LoRa 865MHz • ESP32
            </span>
          </div>
        </div>

        {/* Navigation Items (Dashboard, Sensors, Devices, Automation, Analytics, Alerts, Settings) */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1e2b3c] text-[#38bdf8] font-bold border-l-4 border-[#38bdf8] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2533]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 ${isActive ? 'text-[#38bdf8]' : 'text-slate-400'}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Information (Clean Status, NO ZIP DOWNLOAD) */}
      <div className="pt-6 border-t border-[#1e2b3b] space-y-3">
        <div className="px-3.5 py-2 rounded-xl bg-[#1a2533] border border-[#243346] text-[11px]">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#38bdf8]" /> LoRa 865.2 MHz
            </span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
            Gateway: ESP32_GW_01
          </span>
        </div>

        <button
          onClick={() => onSelectTab('dashboard')}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-[#1a2533] transition"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Reset Session View</span>
        </button>
      </div>
    </aside>
  );
};
