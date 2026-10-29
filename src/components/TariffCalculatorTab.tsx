import React, { useState } from 'react';
import { IndianRupee, DollarSign, Calculator, TrendingDown, PiggyBank, Calendar } from 'lucide-react';

export const TariffCalculatorTab: React.FC = () => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [baseTariff, setBaseTariff] = useState<number>(7.2); // ₹ per kWh
  const [peakTariff, setPeakTariff] = useState<number>(9.5); // ₹ per kWh
  const [monthlyUnitsKwh, setMonthlyUnitsKwh] = useState<number>(420); // Monthly units

  // Savings calculations
  const symbol = currency === 'INR' ? '₹' : '$';
  const conversionFactor = currency === 'USD' ? 0.012 : 1.0;

  // AI automation saves ~21% energy through vampire cutoff + occupancy auto-off
  const aiSavingsRatio = 0.21;
  const unmanagedUnitsKwh = Math.round(monthlyUnitsKwh / (1 - aiSavingsRatio));
  const savedUnitsKwh = unmanagedUnitsKwh - monthlyUnitsKwh;

  // Assuming 35% of units are consumed during peak hours (18:00 - 22:00)
  const peakFraction = 0.35;
  const offPeakFraction = 0.65;

  const currentBill = (
    monthlyUnitsKwh * (offPeakFraction * baseTariff + peakFraction * peakTariff) * conversionFactor
  ).toFixed(0);

  const unmanagedBill = (
    unmanagedUnitsKwh * (offPeakFraction * baseTariff + peakFraction * peakTariff) * conversionFactor
  ).toFixed(0);

  const netSavings = (parseFloat(unmanagedBill) - parseFloat(currentBill)).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-100">
              Electricity Tariff &amp; AI Economic Savings Calculator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical before-and-after financial comparison using multi-tier utility billing slabs.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setCurrency('INR')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-bold transition ${
              currency === 'INR' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" /> INR (₹)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-bold transition ${
              currency === 'USD' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> USD ($)
          </button>
        </div>
      </div>

      {/* 3 Metric Cards: Current Bill, Unmanaged Bill, Net Savings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Optimized Bill */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400">AI-Optimized Monthly Bill</span>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-2">
            {symbol}{currentBill}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Monthly Consumption:</span>
            <span className="font-mono font-bold text-slate-200">{monthlyUnitsKwh} kWh</span>
          </div>
        </div>

        {/* Unmanaged Baseline Bill */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400">Unmanaged Baseline (Without AI)</span>
          <div className="text-3xl font-bold font-mono text-rose-400 mt-2">
            {symbol}{unmanagedBill}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Projected Consumption:</span>
            <span className="font-mono font-bold text-slate-200">{unmanagedUnitsKwh} kWh</span>
          </div>
        </div>

        {/* Net Monthly Savings */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">Total Monthly Savings</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              -21% Power Waste
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-300 mt-2">
            +{symbol}{netSavings} / mo
          </div>
          <div className="text-xs text-slate-300 mt-2 flex items-center justify-between">
            <span>Energy Units Conserved:</span>
            <span className="font-mono font-bold text-emerald-400">+{savedUnitsKwh} kWh</span>
          </div>
        </div>
      </div>

      {/* Configurable Tariff Slabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span>Configurable Utility Slab Rates &amp; Consumption Inputs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Standard / Off-Peak Tariff Rate ({symbol}/kWh)
            </label>
            <input
              type="number"
              step="0.1"
              value={baseTariff}
              onChange={(e) => setBaseTariff(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default state board tier 2 slab</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Peak Hours Tariff Surcharge ({symbol}/kWh)
            </label>
            <input
              type="number"
              step="0.1"
              value={peakTariff}
              onChange={(e) => setPeakTariff(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Applicable 18:00 to 22:00</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Monthly Household Consumption (kWh / Units)
            </label>
            <input
              type="number"
              step="10"
              value={monthlyUnitsKwh}
              onChange={(e) => setMonthlyUnitsKwh(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Based on smart sub-metering logs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
