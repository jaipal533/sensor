import React, { useState } from 'react';
import {
  Thermometer,
  Eye,
  Sun,
  Shield,
  Zap,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Cpu,
  Power,
  Edit2,
  Radio,
  AlertCircle,
} from 'lucide-react';
import { RegisteredSensor, SensorType } from '../types';

interface SensorManagementViewProps {
  sensors: RegisteredSensor[];
  onAddSensor: (sensor: Omit<RegisteredSensor, 'id' | 'status' | 'lastUpdate' | 'currentValue'>) => void;
  onToggleEnable: (id: string) => void;
  onDeleteSensor: (id: string) => void;
  onUpdateSensor: (id: string, updated: Partial<RegisteredSensor>) => void;
  isHardwareConnected: boolean;
}

export const SensorManagementView: React.FC<SensorManagementViewProps> = ({
  sensors,
  onAddSensor,
  onToggleEnable,
  onDeleteSensor,
  onUpdateSensor,
  isHardwareConnected,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<SensorType>('DHT22');
  const [room, setRoom] = useState('Living room');
  const [deviceId, setDeviceId] = useState('ESP32_LORA_01');
  const [description, setDescription] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRoom, setEditRoom] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSensor({
      name: name.trim(),
      type,
      room,
      deviceId: deviceId.trim(),
      description: description.trim(),
      isEnabled: true,
    });

    setName('');
    setDescription('');
    setShowAddModal(false);
  };

  const startEdit = (sensor: RegisteredSensor) => {
    setEditingId(sensor.id);
    setEditName(sensor.name);
    setEditRoom(sensor.room);
  };

  const saveEdit = (id: string) => {
    onUpdateSensor(id, { name: editName, room: editRoom });
    setEditingId(null);
  };

  const getSensorIcon = (sensorType: SensorType) => {
    switch (sensorType) {
      case 'DHT22':
        return <Thermometer className="w-5 h-5 text-amber-400" />;
      case 'PIR':
        return <Eye className="w-5 h-5 text-emerald-400" />;
      case 'LDR':
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'DOOR_MAGNETIC':
        return <Shield className="w-5 h-5 text-cyan-400" />;
      case 'ENERGY_PZEM':
        return <Zap className="w-5 h-5 text-rose-400" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  const renderCurrentValue = (s: RegisteredSensor) => {
    if (!s.isEnabled) {
      return <span className="text-slate-500 italic">Sensor Disabled</span>;
    }
    if (!isHardwareConnected && s.status === 'Disconnected') {
      return (
        <span className="text-rose-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> Hardware Disconnected
        </span>
      );
    }

    switch (s.type) {
      case 'DHT22':
        return (
          <span className="font-mono text-slate-200">
            {s.currentValue.temperature ?? 20}°C • {s.currentValue.humidity ?? 30}% RH
          </span>
        );
      case 'PIR':
        return (
          <span
            className={`font-semibold ${
              s.currentValue.motion ? 'text-emerald-400 font-mono' : 'text-slate-400 font-mono'
            }`}
          >
            {s.currentValue.motion ? 'MOTION ACTIVE' : 'NO MOTION'}
          </span>
        );
      case 'LDR':
        return (
          <span className="font-mono text-yellow-300">
            {s.currentValue.lightLux ?? 45} Lux
          </span>
        );
      case 'DOOR_MAGNETIC':
        return (
          <span
            className={`font-bold font-mono ${
              s.currentValue.doorOpen ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {s.currentValue.doorOpen ? 'DOOR OPEN' : 'DOOR CLOSED (SECURE)'}
          </span>
        );
      case 'ENERGY_PZEM':
        return (
          <span className="font-mono font-bold text-cyan-300">
            {s.currentValue.energyWatts ?? 0} Watts
          </span>
        );
      default:
        return <span className="text-slate-400">Telemetry Active</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1b2635] border border-[#27374b] rounded-2xl p-5 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="text-base font-bold text-slate-100">IoT Sensor Registration &amp; Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Register and monitor DHT22, PIR, LDR light sensors, door magnetic switches, and energy meters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 transition active:scale-95 shadow-md shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Sensor</span>
        </button>
      </div>

      {/* Sensor Registration Modal Form */}
      {showAddModal && (
        <div className="bg-[#151f2b] border border-[#27374b] rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#243346] mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#38bdf8]" />
              Register New IoT Hardware Sensor
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Sensor Name *</label>
              <input
                type="text"
                placeholder="e.g. Master Bedroom DHT22"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Sensor Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SensorType)}
                className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="DHT22">DHT22 (Temperature &amp; Humidity)</option>
                <option value="PIR">PIR (Passive Infrared Motion)</option>
                <option value="LDR">LDR (Light Intensity / Illuminance)</option>
                <option value="DOOR_MAGNETIC">Door Magnetic Reed Switch</option>
                <option value="ENERGY_PZEM">PZEM-004T / Current Sensor (Energy)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Room Location *</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="Living room">Living room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Dining room">Dining room</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Entrance">Entrance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Transmitting ESP32 Node ID *</label>
              <input
                type="text"
                placeholder="e.g. ESP32_LORA_01"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                required
                className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Hardware Description / Pin Mapping</label>
              <input
                type="text"
                placeholder="e.g. GPIO 4 with 10k pull-up resistor to 3.3V"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-[#243447] text-slate-300 hover:bg-[#2e435a] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#38bdf8] text-slate-950 font-bold hover:bg-[#0ea5e9] transition"
              >
                Save &amp; Register Sensor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sensor Table / Cards */}
      <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-[#243346] flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200">
            Registered Sensors ({sensors.length} Connected Devices)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {isHardwareConnected ? 'Hardware Live Telemetry' : 'Demonstration Data Mode'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-[#151f2b] text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Sensor Name &amp; Type</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Node ID</th>
                <th className="py-3 px-4">Current Reading</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243346]">
              {sensors.map((sensor) => {
                const isEditing = editingId === sensor.id;
                return (
                  <tr key={sensor.id} className="hover:bg-[#202d3e]/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#151f2b] border border-[#27374b]">
                          {getSensorIcon(sensor.type)}
                        </div>
                        <div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="bg-[#111823] border border-[#38bdf8] rounded px-2 py-1 text-slate-100 text-xs"
                            />
                          ) : (
                            <span className="font-semibold text-slate-100 block">
                              {sensor.name}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {sensor.type} • {sensor.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <select
                          value={editRoom}
                          onChange={(e) => setEditRoom(e.target.value)}
                          className="bg-[#111823] border border-[#38bdf8] rounded px-2 py-1 text-slate-100 text-xs"
                        >
                          <option value="Living room">Living room</option>
                          <option value="Bedroom">Bedroom</option>
                          <option value="Dining room">Dining room</option>
                          <option value="Kitchen">Kitchen</option>
                          <option value="Entrance">Entrance</option>
                        </select>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-[#151f2b] text-slate-300 font-medium">
                          {sensor.room}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold">
                      {sensor.deviceId}
                    </td>

                    <td className="py-3.5 px-4">
                      {renderCurrentValue(sensor)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sensor.isEnabled
                            ? sensor.status === 'Online'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            sensor.isEnabled && sensor.status === 'Online'
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-slate-500'
                          }`}
                        />
                        {sensor.isEnabled ? sensor.status : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <button
                            onClick={() => saveEdit(sensor.id)}
                            className="px-2.5 py-1 rounded bg-[#38bdf8] text-slate-950 font-bold text-xs"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(sensor)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#243447] transition"
                            title="Edit sensor details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onToggleEnable(sensor.id)}
                          className={`p-1.5 rounded-lg transition ${
                            sensor.isEnabled
                              ? 'text-emerald-400 hover:bg-emerald-500/10'
                              : 'text-slate-500 hover:bg-slate-800'
                          }`}
                          title={sensor.isEnabled ? 'Disable sensor' : 'Enable sensor'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteSensor(sensor.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Remove sensor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
