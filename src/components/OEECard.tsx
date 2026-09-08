import React from 'react';
import { OEEMetrics } from '../types';
import { Info } from 'lucide-react';

interface OEECardProps {
  metrics: OEEMetrics;
  onDrillDown?: () => void;
}

export const OEECard: React.FC<OEECardProps> = ({ metrics, onDrillDown }) => {
  return (
    <div
      id="card-oee-summary"
      className="bg-[#151c2c] rounded-xl p-5 text-white shadow-md border border-slate-800"
      data-purpose="oee-summary-card"
    >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Today</h2>
          <p className="text-xs text-slate-400">Overall equipment effectiveness</p>
        </div>
        {onDrillDown && (
          <button
            onClick={onDrillDown}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer text-[11px] flex items-center gap-1"
            title="View OEE formula & breakdown"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Breakdown</span>
          </button>
        )}
      </div>

      {/* 2x2 Metric Gauges Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* OEE Metric */}
        <div
          id="metric-card-oee"
          className="bg-[#1c2438] rounded-lg p-3.5 flex flex-col justify-between hover:bg-[#202940] transition"
          data-purpose="metric-oee"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              OEE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
          </div>
          <div className="mt-2 mb-2">
            <span className="text-2xl font-bold tracking-tight text-white">{metrics.oee}</span>
            <span className="text-sm text-slate-400 font-medium">%</span>
          </div>
          {/* Mini visual progress indicator */}
          <div className="w-full bg-slate-700/50 h-1 rounded-full overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, metrics.oee)}%` }}
            />
          </div>
        </div>

        {/* Availability Metric */}
        <div
          id="metric-card-availability"
          className="bg-[#1c2438] rounded-lg p-3.5 flex flex-col justify-between hover:bg-[#202940] transition"
          data-purpose="metric-availability"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Availability
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          </div>
          <div className="mt-2 mb-2">
            <span className="text-2xl font-bold tracking-tight text-white">{metrics.availability}</span>
            <span className="text-sm text-slate-400 font-medium">%</span>
          </div>
          <div className="w-full bg-slate-700/50 h-1 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, metrics.availability)}%` }}
            />
          </div>
        </div>

        {/* Performance Metric */}
        <div
          id="metric-card-performance"
          className="bg-[#1c2438] rounded-lg p-3.5 flex flex-col justify-between hover:bg-[#202940] transition"
          data-purpose="metric-performance"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Performance
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
          </div>
          <div className="mt-2 mb-2">
            <span className="text-2xl font-bold tracking-tight text-white">{metrics.performance}</span>
            <span className="text-sm text-slate-400 font-medium">%</span>
          </div>
          <div className="w-full bg-slate-700/50 h-1 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, metrics.performance)}%` }}
            />
          </div>
        </div>

        {/* Quality Metric */}
        <div
          id="metric-card-quality"
          className="bg-[#1c2438] rounded-lg p-3.5 flex flex-col justify-between hover:bg-[#202940] transition"
          data-purpose="metric-quality"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Quality
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
          </div>
          <div className="mt-2 mb-2">
            <span className="text-2xl font-bold tracking-tight text-white">{metrics.quality}</span>
            <span className="text-sm text-slate-400 font-medium">%</span>
          </div>
          <div className="w-full bg-slate-700/50 h-1 rounded-full overflow-hidden">
            <div
              className="bg-indigo-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, metrics.quality)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
