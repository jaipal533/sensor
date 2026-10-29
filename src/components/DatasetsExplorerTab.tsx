import React, { useState } from 'react';
import { Database, Download, ExternalLink, Table, BookOpen, Layers } from 'lucide-react';
import { PUBLIC_DATASETS } from '../data/mockData';

export const DatasetsExplorerTab: React.FC = () => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(PUBLIC_DATASETS[0].id);

  const dataset = PUBLIC_DATASETS.find((d) => d.id === selectedDatasetId) || PUBLIC_DATASETS[0];

  const handleDownloadCsv = () => {
    // Convert sample data to CSV string
    const headers = dataset.columns.map((c: { name: string }) => c.name).join(',');
    const rows = dataset.sampleData
      .map((row: Record<string, any>) =>
        dataset.columns
          .map((c: { name: string }) => {
            const val = row[c.name];
            return typeof val === 'string' && val.includes(',') ? `"${val}"` : val ?? '';
          })
          .join(',')
      )
      .join('\n');

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dataset.downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-100">
              Public Machine Learning Datasets &amp; Empirical Data Dictionaries
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official benchmark repositories from UCI ML Archive &amp; Empirical LoRa 865 MHz logs.
          </p>
        </div>

        {/* Dataset Selector Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
          {PUBLIC_DATASETS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDatasetId(d.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                selectedDatasetId === d.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d.name.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Overview Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">{dataset.name}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              <span>Source: <strong className="text-slate-300">{dataset.source}</strong></span>
              <span>• Total Scope: <strong className="text-emerald-400">{dataset.totalRecords}</strong></span>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {dataset.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 self-start md:self-auto">
            {dataset.url.startsWith('http') && (
              <a
                href={dataset.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Official UCI Page</span>
              </a>
            )}

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Dictionary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Data Dictionary &amp; Feature Schema
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Column Identifier</th>
                <th className="py-2.5 px-3">Physical Unit</th>
                <th className="py-2.5 px-3">Engineering Description &amp; Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {dataset.columns.map((col: { name: string; unit: string; description: string }) => (
                <tr key={col.name} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{col.name}</td>
                  <td className="py-2.5 px-3 font-mono text-cyan-300">{col.unit}</td>
                  <td className="py-2.5 px-3 text-slate-300">{col.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Sample Records Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          Raw Dataset Records Preview (First 5 Instances)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 font-mono">
            <thead className="bg-slate-800 text-slate-400 text-[10px]">
              <tr>
                {dataset.columns.map((col: { name: string }) => (
                  <th key={col.name} className="py-2 px-3 whitespace-nowrap">
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {dataset.sampleData.map((row: Record<string, any>, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  {dataset.columns.map((col: { name: string }) => (
                    <td key={col.name} className="py-2 px-3 whitespace-nowrap text-slate-300">
                      {String(row[col.name] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
