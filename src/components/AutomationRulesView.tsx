import React, { useState } from 'react';
import {
  Sliders,
  Moon,
  Clock,
  Thermometer,
  Zap,
  Play,
  Plus,
  Trash2,
  CheckCircle,
  ShieldCheck,
  Power,
  Edit3,
  AlertTriangle,
} from 'lucide-react';
import { AutomationRule } from '../types';

interface AutomationRulesViewProps {
  rules: AutomationRule[];
  onToggleRule: (id: string) => void;
  onUpdateRule: (id: string, updated: Partial<AutomationRule>) => void;
  onDeleteRule: (id: string) => void;
  onAddRule: (rule: Omit<AutomationRule, 'id' | 'executionCount' | 'lastTriggered'>) => void;
}

export const AutomationRulesView: React.FC<AutomationRulesViewProps> = ({
  rules,
  onToggleRule,
  onUpdateRule,
  onDeleteRule,
  onAddRule,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [targetId, setTargetId] = useState('app_lr_light');
  const [action, setAction] = useState<'TURN_ON' | 'TURN_OFF'>('TURN_ON');
  const [ruleType, setRuleType] = useState<AutomationRule['ruleType']>('DARK_ROOM_MOTION_LIGHT');
  const [timeoutMins, setTimeoutMins] = useState(10);
  const [tempThresh, setTempThresh] = useState(26.5);
  const [luxThresh, setLuxThresh] = useState(50);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    let triggerDesc = '';
    if (ruleType === 'DARK_ROOM_MOTION_LIGHT') {
      triggerDesc = `IF Ambient Light < ${luxThresh} Lux AND PIR Motion == TRUE`;
    } else if (ruleType === 'MOTION_TIMEOUT_OFF') {
      triggerDesc = `IF No Motion Detected for ${timeoutMins} consecutive minutes`;
    } else if (ruleType === 'TEMP_THRESHOLD_FAN') {
      triggerDesc = `IF DHT22 Temperature > ${tempThresh}°C`;
    } else {
      triggerDesc = 'Custom sensor event trigger';
    }

    onAddRule({
      name: ruleName.trim(),
      ruleType,
      triggerDescription: triggerDesc,
      targetApplianceId: targetId,
      action,
      isEnabled: true,
      timeoutMinutes: timeoutMins,
      tempThreshold: tempThresh,
      lightThresholdLux: luxThresh,
    });

    setRuleName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1b2635] border border-[#27374b] rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="text-base font-bold text-slate-100">Smart Home Automation Rules Engine</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure motion lighting, occupancy auto-cutoff, and thermal fan speed triggers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 transition active:scale-95 shadow-md shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Automation Rule</span>
        </button>
      </div>

      {/* Local Safety Resilience Box */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-200">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-300">ESP32 LOCAL SAFETY AUTONOMY: </span>
          All automation rules are downloaded and cached directly into the ESP32 microcontroller Flash EEPROM.
          If internet connectivity or Wi-Fi drops, the local hardware timer loops and sensor interrupts continue to
          execute safety cutoffs and lighting rules locally without interruption.
        </div>
      </div>

      {/* Add Rule Form Modal */}
      {showAddModal && (
        <div className="bg-[#151f2b] border border-[#27374b] rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#243346] mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#38bdf8]" />
              Configure New Automation Rule
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateRule} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Rule Name *</label>
              <input
                type="text"
                placeholder="e.g. Hallway Night Lights"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                required
                className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Rule Template Type</label>
              <select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value as any)}
                className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="DARK_ROOM_MOTION_LIGHT">Turn ON lights on motion in dark room</option>
                <option value="MOTION_TIMEOUT_OFF">Turn OFF lights after no-motion period</option>
                <option value="TEMP_THRESHOLD_FAN">Turn ON fan when temperature exceeds threshold</option>
                <option value="CUSTOM">Custom Automation</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Target Appliance</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="app_lr_light">Main Living Room Lights (GPIO 27)</option>
                <option value="app_br_fan">Master Bedroom BLDC Fan (GPIO 26)</option>
                <option value="app_lr_ac">Living Room Inverter AC (GPIO 25)</option>
                <option value="app_ent_light">Entrance Security Floodlight (GPIO 21)</option>
              </select>
            </div>

            {ruleType === 'DARK_ROOM_MOTION_LIGHT' && (
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Dark Threshold (Lux)</label>
                <input
                  type="number"
                  value={luxThresh}
                  onChange={(e) => setLuxThresh(parseInt(e.target.value) || 50)}
                  className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            )}

            {ruleType === 'MOTION_TIMEOUT_OFF' && (
              <div>
                <label className="block text-slate-400 mb-1 font-medium">No-Motion Timeout (Minutes)</label>
                <input
                  type="number"
                  value={timeoutMins}
                  onChange={(e) => setTimeoutMins(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            )}

            {ruleType === 'TEMP_THRESHOLD_FAN' && (
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Temperature Trigger (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tempThresh}
                  onChange={(e) => setTempThresh(parseFloat(e.target.value) || 26.5)}
                  className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Action to Execute</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as any)}
                className="w-full bg-[#1b2635] border border-[#27374b] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="TURN_ON">TURN ON</option>
                <option value="TURN_OFF">TURN OFF</option>
              </select>
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
                Save Automation Rule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => {
          return (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-all ${
                rule.isEnabled
                  ? 'bg-[#1b2635] border-[#27374b] shadow-lg'
                  : 'bg-[#151f2b] border-[#223143] opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`p-2 rounded-xl transition ${
                      rule.isEnabled
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                    title={rule.isEnabled ? 'Disable rule' : 'Enable rule'}
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-100">{rule.name}</h3>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          rule.action === 'TURN_ON'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {rule.action}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3 font-mono">
                      <span className="text-[#38bdf8] font-semibold">{rule.triggerDescription}</span>
                      <span>• Target: <strong className="text-slate-300">{rule.targetApplianceId}</strong></span>
                      <span>• Triggered: <strong className="text-slate-200">{rule.executionCount} times</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[11px] text-slate-500">Last: {rule.lastTriggered || 'Never'}</span>
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
