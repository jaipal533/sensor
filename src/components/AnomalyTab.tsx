import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info, ShieldAlert, Wrench, ShieldCheck, Zap } from 'lucide-react';
import { AnomalyAlert } from '../types';
import { INITIAL_ALERTS } from '../data/mockData';

export const AnomalyTab: React.FC = () => {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(INITIAL_ALERTS);

  const resolveAlert = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, isResolved: true } : a))
    );
  };

  const getSeverityBadge = (severity: AnomalyAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> CRITICAL OVERLOAD
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> VAMPIRE DRAIN
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Info className="w-3.5 h-3.5" /> RF DIAGNOSTIC
          </span>
        );
    }
  };

  const unresolvedCount = alerts.filter((a) => !a.isResolved).length;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Active Unresolved Anomalies</span>
            <div className="text-3xl font-bold font-mono text-rose-400 mt-1">{unresolvedCount}</div>
            <span className="text-[10px] text-slate-500">Requires diagnostic review</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Z-Score Statistical Sensitivity</span>
            <div className="text-3xl font-bold font-mono text-cyan-400 mt-1">2.5 σ</div>
            <span className="text-[10px] text-slate-500">Gaussian dynamic rolling window</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Autonomous Safety Interventions</span>
            <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">12 Trips</div>
            <span className="text-[10px] text-slate-500">Auto-prevented overcurrent fires</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Anomaly Alerts Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Real-time Anomaly Detection Log &amp; Explainable Diagnostics
        </h3>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 transition ${
                alert.isResolved
                  ? 'bg-slate-950/40 border-slate-800 opacity-70'
                  : 'bg-slate-950/90 border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  {getSeverityBadge(alert.severity)}
                  <h4 className="font-bold text-sm text-slate-200">{alert.title}</h4>
                </div>
                <span className="text-xs font-mono text-slate-500">{alert.timestamp}</span>
              </div>

              {/* Explanatory Details */}
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-slate-300">
                  <span className="font-semibold text-slate-200">Statistical Root-Cause Explanation: </span>
                  {alert.explanation}
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-300 flex items-start gap-2">
                  <Wrench className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Recommended Remediation: </span>
                    {alert.recommendedAction}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {alert.deviceName && (
                    <span>
                      Device: <strong className="text-slate-200">{alert.deviceName}</strong> ({alert.powerWatts}W)
                    </span>
                  )}
                </div>

                {alert.isResolved ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Resolved &amp; Cleared
                  </span>
                ) : (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
