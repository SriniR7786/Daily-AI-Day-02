import React, { useState, useEffect } from 'react';
import { Search, X, LayoutDashboard, BarChart3, Cpu, Bell, Play, Pause, RefreshCw } from 'lucide-react';
import { Machine, DashboardScreen } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  machines: Machine[];
  onSelectMachine: (machineId: string) => void;
  onNavigate: (screen: DashboardScreen) => void;
  isLiveActive: boolean;
  onToggleLive: () => void;
  onResetData: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  machines,
  onSelectMachine,
  onNavigate,
  isLiveActive,
  onToggleLive,
  onResetData,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredMachines = machines.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.operator.toLowerCase().includes(query.toLowerCase()) ||
      m.currentOperation.toLowerCase().includes(query.toLowerCase()) ||
      m.status.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, machine name, or operator..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of items */}
        <div className="max-h-80 overflow-y-auto p-2 text-xs divide-y divide-slate-100">
          {/* Machine Results */}
          <div className="py-2">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Machines
            </div>
            {filteredMachines.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onSelectMachine(m.id);
                  onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      m.status === 'running'
                        ? 'bg-emerald-500'
                        : m.status === 'idle'
                        ? 'bg-amber-400'
                        : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-sky-600">
                      {m.name}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-2">
                      ({m.operator} • {m.currentOperation})
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {m.runtimeFormatted}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation & Quick Actions */}
          <div className="py-2">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation & Actions
            </div>
            <button
              onClick={() => {
                onNavigate('overview');
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition flex items-center gap-2.5 cursor-pointer text-slate-700"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Go to Shop Floor Dashboard</span>
            </button>

            <button
              onClick={() => {
                onNavigate('analytics');
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition flex items-center gap-2.5 cursor-pointer text-slate-700"
            >
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <span>Go to Shift Analytics & OEE Breakdown</span>
            </button>

            <button
              onClick={() => {
                onToggleLive();
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition flex items-center gap-2.5 cursor-pointer text-slate-700"
            >
              {isLiveActive ? (
                <>
                  <Pause className="w-4 h-4 text-amber-500" />
                  <span>Pause Live Simulation</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-500" />
                  <span>Start Live Simulation</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onResetData();
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition flex items-center gap-2.5 cursor-pointer text-slate-700"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>Reset Demo Data to Initial Mock</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">ESC</kbd> to close</span>
          <span>Munich CNC Machining Cell</span>
        </div>
      </div>
    </div>
  );
};
