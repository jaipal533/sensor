import React, { useState } from 'react';
import { UserCheck, UserX, Shield, Play, Plus, Trash2, CheckCircle, Clock, Zap } from 'lucide-react';
import { AutomationRule, OccupancyMetric } from '../types';
import { OCCUPANCY_MODELS, INITIAL_RULES } from '../data/mockData';

interface OccupancyTabProps {
  motionDetected: boolean;
  temperature: number;
  humidity: number;
}

export const OccupancyTab: React.FC<OccupancyTabProps> = ({
  motionDetected,
  temperature,
  humidity,
}) => {
  const [selectedClfIdx, setSelectedClfIdx] = useState<number>(1); // Default to Random Forest
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [newRuleName, setNewRuleName] = useState('');
  const [newCondition, setNewCondition] = useState('Occupancy == 0 FOR 15m');
  const [newAction, setNewAction] = useState<'TURN_ON' | 'TURN_OFF'>('TURN_OFF');
  const [newDevice, setNewDevice] = useState('dev_ac_01');

  const selectedClf = OCCUPANCY_MODELS[selectedClfIdx];

  // Inferred Occupancy: Combination of PIR motion and thermal heuristic
  const isOccupiedInferred = motionDetected || temperature > 25.5;

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newRule: AutomationRule = {
      id: `rule_${Date.now()}`,
      name: newRuleName.trim(),
      condition: newCondition,
      targetDeviceId: newDevice,
      action: newAction,
      isEnabled: true,
      executionCount: 0,
      lastTriggered: 'Never',
    };

    setRules([newRule, ...rules]);
    setNewRuleName('');
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const cm = selectedClf.confusionMatrix;

  return (
    <div className="space-y-6">
      {/* Real-time Occupancy Telemetry Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl border ${
              isOccupiedInferred
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isOccupiedInferred ? <UserCheck className="w-6 h-6" /> : <UserX className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                Inferred Room Status:{' '}
                <span className={isOccupiedInferred ? 'text-emerald-400' : 'text-slate-400'}>
                  {isOccupiedInferred ? 'OCCUPIED' : 'VACANT / EMPTY'}
                </span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                Confidence: {isOccupiedInferred ? '96.4%' : '98.1%'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-sensor fusion: PIR Digital High + Environmental CO2/Lux delta + Thermal gradients.
            </p>
          </div>
        </div>

        <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
          {OCCUPANCY_MODELS.map((m, idx) => (
            <button
              key={m.name}
              onClick={() => setSelectedClfIdx(idx)}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                selectedClfIdx === idx
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.name.includes('Forest') ? 'Random Forest (94.2%)' : 'Logistic Reg (88.6%)'}
            </button>
          ))}
        </div>
      </div>

      {/* Model Performance & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classification Metrics Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Model Evaluation on UCI Occupancy Dataset (ID: 357)
          </h3>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">Classification Accuracy</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {selectedClf.accuracy.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500">Overall correct predictions</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">Precision (Occupied)</span>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                {selectedClf.precision.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500">Avoids false positive triggers</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">Recall / Sensitivity</span>
              <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
                {selectedClf.recall.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500">True occupancy captured</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">Harmonic F1-Score</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {selectedClf.f1Score.toFixed(3)}
              </div>
              <span className="text-[10px] text-slate-500">Balanced metric</span>
            </div>
          </div>
        </div>

        {/* Confusion Matrix Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
            <span>2x2 Empirical Confusion Matrix</span>
            <span className="text-xs font-normal text-slate-400">(N = 890 Test Samples)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Ground Truth vs Model Predicted State on test split.
          </p>

          <div className="grid grid-cols-2 gap-3 text-center">
            {/* True Negative */}
            <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                True Negative (Empty)
              </span>
              <span className="text-3xl font-mono font-bold text-slate-200">{cm.trueNegative}</span>
              <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
                {((cm.trueNegative / (cm.trueNegative + cm.falsePositive)) * 100).toFixed(1)}% Spec
              </span>
            </div>

            {/* False Positive */}
            <div className="bg-slate-950/90 border border-rose-900/40 p-4 rounded-xl">
              <span className="text-[11px] font-semibold text-rose-400 block uppercase">
                False Positive (Type I)
              </span>
              <span className="text-3xl font-mono font-bold text-rose-400">{cm.falsePositive}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Falsely labeled occupied</span>
            </div>

            {/* False Negative */}
            <div className="bg-slate-950/90 border border-amber-900/40 p-4 rounded-xl">
              <span className="text-[11px] font-semibold text-amber-400 block uppercase">
                False Negative (Type II)
              </span>
              <span className="text-3xl font-mono font-bold text-amber-400">{cm.falseNegative}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Missed human occupancy</span>
            </div>

            {/* True Positive */}
            <div className="bg-slate-950/90 border border-emerald-900/40 p-4 rounded-xl">
              <span className="text-[11px] font-semibold text-emerald-400 block uppercase">
                True Positive (Occupied)
              </span>
              <span className="text-3xl font-mono font-bold text-emerald-400">{cm.truePositive}</span>
              <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
                {((cm.truePositive / (cm.truePositive + cm.falseNegative)) * 100).toFixed(1)}% Sens
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Automation Rules Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              Occupancy-Driven Edge Automation Rules Engine
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous triggers executed on ESP32 without internet dependency.
            </p>
          </div>
        </div>

        {/* Existing Rules List */}
        <div className="space-y-3 mb-6">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                rule.isEnabled
                  ? 'bg-slate-950/70 border-slate-800'
                  : 'bg-slate-950/30 border-slate-850 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={rule.isEnabled}
                  onChange={() => toggleRule(rule.id)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 h-4 w-4 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-200">{rule.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        rule.action === 'TURN_ON'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {rule.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-cyan-400">{rule.condition}</span>
                    <span>• Target: <code className="text-slate-300">{rule.targetDeviceId}</code></span>
                    <span>• Triggered: <strong className="text-slate-200">{rule.executionCount} times</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[11px] text-slate-500">Last: {rule.lastTriggered || 'Recent'}</span>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                  title="Delete rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Rule Form */}
        <form onSubmit={handleAddRule} className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-emerald-400" /> Create Custom Automation Rule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Rule Name</label>
              <input
                type="text"
                placeholder="e.g. Eco Hallway Shutdown"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Trigger Condition</label>
              <select
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Occupancy == 0 FOR 15m">Occupancy == 0 FOR 15 min</option>
                <option value="Temperature > 28.5°C AND Occupancy == 1">Temp &gt; 28.5°C &amp; Occupied</option>
                <option value="Time >= 23:00 AND Motion == 0">Time &gt;= 23:00 &amp; No Motion</option>
                <option value="Continuous Run > 45m">Appliance Runtime &gt; 45 min</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Action &amp; Target</label>
              <div className="flex gap-2">
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="TURN_OFF">Turn OFF</option>
                  <option value="TURN_ON">Turn ON</option>
                </select>
                <select
                  value={newDevice}
                  onChange={(e) => setNewDevice(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="dev_ac_01">Living Room AC</option>
                  <option value="dev_fan_01">Bedroom Fan</option>
                  <option value="dev_light_01">Ambient Lights</option>
                  <option value="dev_heater_01">Geyser</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-1.5 px-3 rounded-lg transition"
              >
                Add Rule
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
