import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Clock, ChevronDown } from 'lucide-react';
import { ShiftInfo } from '../types';

interface DashboardHeaderProps {
  machineCount: number;
  isLiveActive: boolean;
  onToggleLive: () => void;
  onResetData: () => void;
  currentShift: ShiftInfo;
  shifts: ShiftInfo[];
  onSelectShift: (shift: ShiftInfo) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  machineCount,
  isLiveActive,
  onToggleLive,
  onResetData,
  currentShift,
  shifts,
  onSelectShift,
}) => {
  const [showShiftDropdown, setShowShiftDropdown] = useState(false);

  return (
    <header
      id="dashboard-header"
      className="bg-[#141824] px-6 sm:px-8 py-5 sm:py-6 text-white border-b border-slate-800"
      data-purpose="dashboard-header"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Live Machine Monitoring
            </span>
            {isLiveActive && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                STREAMING
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Shop Floor Performance Dashboard
          </h1>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 relative">
            <span>CNC cell overview</span>
            <span>•</span>
            <span>Today</span>
            <span>•</span>
            <div className="relative inline-block">
              <button
                id="btn-shift-dropdown"
                onClick={() => setShowShiftDropdown(!showShiftDropdown)}
                type="button"
                className="inline-flex items-center gap-1 text-slate-300 hover:text-white underline decoration-slate-600 underline-offset-2 hover:decoration-slate-400 cursor-pointer transition"
              >
                <span>{currentShift.name} ({currentShift.timeRange})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showShiftDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowShiftDropdown(false)}
                  />
                  <div
                    id="dropdown-shift-select"
                    className="absolute left-0 mt-2 w-64 bg-[#1b2234] border border-slate-700 rounded-lg shadow-2xl p-2 z-40 text-xs text-slate-200"
                  >
                    <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Select Active Shift
                    </div>
                    {shifts.map(shift => (
                      <button
                        key={shift.id}
                        type="button"
                        onClick={() => {
                          onSelectShift(shift);
                          setShowShiftDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md transition flex items-center justify-between cursor-pointer ${
                          shift.id === currentShift.id
                            ? 'bg-[#00a8e8]/20 text-[#00a8e8] font-semibold border border-[#00a8e8]/40'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white">{shift.name}</div>
                          <div className="text-[11px] text-slate-400">{shift.timeRange}</div>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Supv: {shift.supervisor.split(' ')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action badges and Live Demo Data button */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <span
            id="badge-machines-count"
            className="px-3.5 py-1.5 rounded-md bg-[#222938] text-xs font-semibold text-slate-300 border border-slate-700/50 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {machineCount} Machines
          </span>

          <button
            id="btn-live-demo-data"
            onClick={onToggleLive}
            type="button"
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold text-white cursor-pointer shadow-sm transition flex items-center gap-2 ${
              isLiveActive
                ? 'bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-[#00a8e8] hover:bg-[#0096d1]'
            }`}
            title="Toggle simulated live PLC data streaming"
          >
            {isLiveActive ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause Live Demo</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Live Demo Data</span>
              </>
            )}
          </button>

          <button
            id="btn-reset-demo-data"
            onClick={onResetData}
            type="button"
            className="p-1.5 rounded-md bg-[#222938] hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/50 transition cursor-pointer"
            title="Reset to initial values"
            aria-label="Reset demo values"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
