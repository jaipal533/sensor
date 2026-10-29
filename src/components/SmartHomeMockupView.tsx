import React, { useState } from 'react';
import {
  Thermometer,
  Droplets,
  Tv,
  Wind,
  Wifi,
  Lightbulb,
  Volume2,
  MoreHorizontal,
  Sun,
  Zap,
  Radio,
  Clock,
  Layers,
  Fan,
  Flame,
  Lock,
  Camera,
  Cpu,
  Shield,
  Activity,
  CheckCircle2,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { CircularDial } from './CircularDial';
import { RoomData, RoomAppliance } from '../types';

interface SmartHomeMockupViewProps {
  roomData: RoomData;
  onToggleAppliance: (roomId: string, applianceId: string) => void;
  isHardwareMode: boolean;
}

export const SmartHomeMockupView: React.FC<SmartHomeMockupViewProps> = ({
  roomData,
  onToggleAppliance,
  isHardwareMode,
}) => {
  const [dialValue, setDialValue] = useState(roomData.dialControl.value);
  const [showNodeDetails, setShowNodeDetails] = useState(false);

  React.useEffect(() => {
    setDialValue(roomData.dialControl.value);
  }, [roomData.id, roomData.dialControl.value]);

  const getApplianceIcon = (type: RoomAppliance['type'], state: boolean) => {
    const color = state ? 'text-[#38bdf8]' : 'text-slate-500';
    switch (type) {
      case 'tv':
        return <Tv className={`w-6 h-6 mb-1 ${color}`} />;
      case 'ac':
        return <Wind className={`w-6 h-6 mb-1 ${color}`} />;
      case 'humidifier':
        return <Droplets className={`w-6 h-6 mb-1 ${color}`} />;
      case 'light':
        return <Lightbulb className={`w-6 h-6 mb-1 ${state ? 'text-amber-400' : 'text-slate-500'}`} />;
      case 'router':
        return <Wifi className={`w-6 h-6 mb-1 ${color}`} />;
      case 'speaker':
        return <Volume2 className={`w-6 h-6 mb-1 ${color}`} />;
      case 'fan':
        return <Fan className={`w-6 h-6 mb-1 ${color}`} />;
      case 'fridge':
        return <Cpu className={`w-6 h-6 mb-1 ${color}`} />;
      case 'chimney':
        return <Wind className={`w-6 h-6 mb-1 ${color}`} />;
      case 'heater':
        return <Flame className={`w-6 h-6 mb-1 ${state ? 'text-rose-400' : 'text-slate-500'}`} />;
      case 'lock':
        return <Lock className={`w-6 h-6 mb-1 ${color}`} />;
      case 'camera':
        return <Camera className={`w-6 h-6 mb-1 ${color}`} />;
      default:
        return <Tv className={`w-6 h-6 mb-1 ${color}`} />;
    }
  };

  return (
    <div className="space-y-5">
      {/* ESP32 Hardware & Mode Banner */}
      <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-100">{roomData.name} Node</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                {roomData.nodeId}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isHardwareMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isHardwareMode ? 'LIVE HARDWARE READINGS' : 'DEMONSTRATION DATA'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3 mt-1">
              <span>Carrier: <strong className="text-slate-200 font-mono">865.2 MHz</strong></span>
              <span>RSSI: <strong className="text-slate-200 font-mono">{roomData.lora.rssi} dBm</strong></span>
              <span>SNR: <strong className="text-slate-200 font-mono">+{roomData.lora.snr} dB</strong></span>
              <span>Battery: <strong className="text-teal-400 font-mono">{roomData.sensor.batteryVoltage.toFixed(2)}V</strong></span>
              <span>Last Update: <strong className="text-slate-200 font-mono">{roomData.sensor.timestamp}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowNodeDetails(!showNodeDetails)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#243447] hover:bg-[#2d425b] text-[#38bdf8] border border-[#30455e] transition self-end sm:self-auto"
        >
          {showNodeDetails ? 'Hide Node Wiring' : 'View ESP32 Wiring'}
        </button>
      </div>

      {/* Collapsible Pinout Drawer */}
      {showNodeDetails && (
        <div className="bg-[#151f2b] border border-[#27374b] rounded-2xl p-4 text-xs font-mono text-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[#38bdf8]">{roomData.nodeId} Hardware Pinout &amp; Wiring:</span>
            <span className="text-emerald-400 text-[10px]">Active-Low Relay Optocouplers</span>
          </div>
          <div className="p-3 bg-[#101720] rounded-xl border border-[#223143] text-slate-300">
            {roomData.esp32Pinout}
          </div>
        </div>
      )}

      {/* Feature 1: Real-time Telemetry Cards (Temperature, Humidity, Motion, Light, Door, Energy) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* 1. Temperature */}
        <div className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] rounded-2xl p-3.5 text-white shadow-lg shadow-sky-900/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-sky-100">Temperature</span>
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono">+{roomData.sensor.temperature.toFixed(0)} °C</span>
            <span className="text-[10px] text-sky-100 block font-mono">DHT22 AM2302</span>
          </div>
        </div>

        {/* 2. Humidity */}
        <div className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] rounded-2xl p-3.5 text-white shadow-lg shadow-sky-900/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-sky-100">Rel. Humidity</span>
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono">{roomData.sensor.humidity.toFixed(0)}%</span>
            <span className="text-[10px] text-sky-100 block font-mono">Comfort 30-55%</span>
          </div>
        </div>

        {/* 3. Light Intensity (LDR) */}
        <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">Light (LDR)</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-yellow-300">{roomData.sensor.lightLux} Lux</span>
            <span className="text-[10px] text-slate-400 block font-mono">
              {roomData.sensor.lightLux < 50 ? 'Dark Room (< 50 Lux)' : 'Well Lit'}
            </span>
          </div>
        </div>

        {/* 4. Motion (PIR) */}
        <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">PIR Motion</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                roomData.sensor.motionDetected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}
            >
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span
              className={`text-base font-bold font-mono ${
                roomData.sensor.motionDetected ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {roomData.sensor.motionDetected ? 'MOTION DETECTED' : 'QUIET / EMPTY'}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">HC-SR501 Infrared</span>
          </div>
        </div>

        {/* 5. Door Status (Magnetic Reed Switch) */}
        <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">Door Status</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                roomData.sensor.doorOpen ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span
              className={`text-base font-bold font-mono ${
                roomData.sensor.doorOpen ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {roomData.sensor.doorOpen ? 'DOOR OPEN' : 'DOOR CLOSED'}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">Magnetic Reed Sensor</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Area (Camera + 6 Tiles) & Right Area (Settings + Dial) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Camera Feed + 6 Appliance Tiles (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Camera Feed */}
          <div className="relative rounded-2xl overflow-hidden border border-[#243346] shadow-xl aspect-video sm:h-64 bg-[#141d27]">
            <img
              src={roomData.camera.imageUrl}
              alt={roomData.camera.name}
              className="w-full h-full object-cover brightness-95 contrast-105 transition-all duration-500"
            />

            {/* Top Camera Overlays */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 font-mono">
                {roomData.camera.resolution} ▾
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-mono text-white border border-white/10">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{roomData.camera.status}</span>
              </div>
            </div>

            {/* Bottom subtle room label */}
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-xs font-medium text-slate-200 border border-white/10">
              <span>{roomData.camera.name}</span>
            </div>
          </div>

          {/* 6 Appliance Control Tiles (3x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {roomData.appliances.map((app) => {
              const isHighlight = app.isHighlighted && app.state;
              return (
                <div
                  key={app.id}
                  className={`rounded-2xl p-4 flex flex-col justify-between h-36 shadow-md transition-all duration-200 ${
                    isHighlight
                      ? 'bg-[#0ea5e9] border border-[#38bdf8] text-white shadow-lg shadow-sky-500/20'
                      : 'bg-[#1b2635] border border-[#27374b] text-slate-200 hover:border-[#38bdf8]/50'
                  }`}
                >
                  {/* Top Switch Row */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isHighlight
                          ? 'text-white'
                          : app.state
                          ? 'text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {app.state ? 'ON' : 'OFF'}
                    </span>

                    <button
                      onClick={() => onToggleAppliance(roomData.name, app.id)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out ${
                        isHighlight
                          ? 'border-white/40 bg-white'
                          : app.state
                          ? 'border-transparent bg-[#38bdf8]'
                          : 'border-transparent bg-slate-700'
                      }`}
                      title={`Click to turn ${app.state ? 'OFF' : 'ON'}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                          isHighlight ? 'bg-[#0284c7]' : 'bg-white'
                        } ${app.state ? 'translate-x-4' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>

                  {/* Center Icon & Title */}
                  <div className="flex flex-col items-center justify-center my-1 text-center">
                    {getApplianceIcon(app.type, isHighlight ? true : app.state)}
                    <span
                      className={`font-semibold text-xs mt-1 ${
                        isHighlight ? 'text-white font-bold' : 'text-slate-200'
                      }`}
                    >
                      {app.name}
                    </span>
                    <span className={`text-[10px] ${isHighlight ? 'text-sky-100' : 'text-slate-400'}`}>
                      {app.activeTime}
                    </span>
                  </div>

                  {/* Footnote pin & wattage */}
                  <div
                    className={`flex items-center justify-between text-[9px] pt-1 border-t ${
                      isHighlight ? 'border-white/20 text-sky-100' : 'border-slate-800 text-slate-500'
                    }`}
                  >
                    <span>GPIO {app.relayPin}</span>
                    <span>{app.state ? `${app.ratedWatts}W` : '0W'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Settings Card + Circular Dial Gauge (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Room Settings Card */}
          <div className="bg-[#1b2736] border border-[#27374b] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-100">{roomData.name} settings</h3>
              <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Left Light Bulb Sun Icon */}
              <div className="sm:col-span-4 flex items-center justify-center">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                    roomData.settings.sunIconColor || 'bg-[#0ea5e9]'
                  } shadow-sky-500/20`}
                >
                  <Sun className="w-10 h-10 animate-spin-slow text-white" />
                </div>
              </div>

              {/* Right Sub-Cards: Schedule & Total Energy Saving */}
              <div className="sm:col-span-8 space-y-3">
                {/* Schedule Box */}
                <div className="bg-[#0284c7] rounded-xl p-3 text-white">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-sky-100 mb-2">
                    <span>Schedule</span>
                    <MoreHorizontal className="w-3.5 h-3.5 opacity-80" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="opacity-80 block text-[9px]">From</span>
                      <div className="bg-white/20 backdrop-blur-md rounded-lg py-1 px-1.5 text-center font-bold font-mono">
                        {roomData.settings.scheduleFrom}
                      </div>
                    </div>
                    <div>
                      <span className="opacity-80 block text-[9px]">To</span>
                      <div className="bg-white/20 backdrop-blur-md rounded-lg py-1 px-1.5 text-center font-bold font-mono">
                        {roomData.settings.scheduleTo}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total energy saving Box */}
                <div className="bg-[#0284c7] rounded-xl p-3 text-white">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-sky-100 mb-1">
                    <span>Total energy saving</span>
                    <MoreHorizontal className="w-3.5 h-3.5 opacity-80" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <span className="text-xl font-black font-mono tracking-tight">
                      {roomData.settings.totalEnergySavingKwh} KWH
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room-Specific Circular Dial Gauge */}
          <CircularDial
            title={roomData.dialControl.title}
            unit={roomData.dialControl.unit}
            value={dialValue}
            onChange={setDialValue}
            min={roomData.dialControl.min}
            max={roomData.dialControl.max}
          />
        </div>
      </div>
    </div>
  );
};
