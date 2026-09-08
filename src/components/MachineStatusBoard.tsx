import React, { useState } from 'react';
import { Machine, MachineStatus, TimelineSegment } from '../types';
import { ExternalLink, Filter, Sparkles } from 'lucide-react';

interface MachineStatusBoardProps {
  machines: Machine[];
  onSelectMachine: (machineId: string) => void;
  statusFilter: MachineStatus | 'all';
  onFilterChange: (filter: MachineStatus | 'all') => void;
}

export const MachineStatusBoard: React.FC<MachineStatusBoardProps> = ({
  machines,
  onSelectMachine,
  statusFilter,
  onFilterChange,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<{
    machineId: string;
    segment: TimelineSegment;
  } | null>(null);

  const filteredMachines = statusFilter === 'all'
    ? machines
    : machines.filter(m => m.status === statusFilter);

  const getStatusColorClass = (status: MachineStatus) => {
    switch (status) {
      case 'running':
        return 'bg-emerald-500';
      case 'idle':
        return 'bg-amber-400';
      case 'stopped':
        return 'bg-red-500';
    }
  };

  const getStatusDotClasses = (status: MachineStatus) => {
    switch (status) {
      case 'running':
        return 'bg-emerald-500 ring-4 ring-emerald-100';
      case 'idle':
        return 'bg-amber-400 ring-4 ring-amber-100';
      case 'stopped':
        return 'bg-red-500 ring-4 ring-red-100';
    }
  };

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white tracking-wide">
            Running
          </span>
        );
      case 'idle':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-white tracking-wide">
            Idle
          </span>
        );
      case 'stopped':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white tracking-wide">
            Stopped
          </span>
        );
    }
  };

  return (
    <section
      id="status-board-section"
      className="lg:col-span-8 flex flex-col gap-4"
      data-purpose="status-board-section"
    >
      {/* Board Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-1 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            Machine Status Board
          </h2>
          <p className="text-xs text-slate-500">
            Running, idle, and stopped periods by machine
          </p>
        </div>

        {/* Legend Badges with filter capability */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          {statusFilter !== 'all' && (
            <button
              onClick={() => onFilterChange('all')}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded bg-slate-200/60 hover:bg-slate-200 transition cursor-pointer"
            >
              Reset Filter
            </button>
          )}
          <button
            onClick={() => onFilterChange(statusFilter === 'running' ? 'all' : 'running')}
            type="button"
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
              statusFilter === 'running'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-xs'
                : statusFilter === 'all'
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-emerald-500/30 text-emerald-800 hover:bg-emerald-500/50'
            }`}
          >
            Running
          </button>
          <button
            onClick={() => onFilterChange(statusFilter === 'idle' ? 'all' : 'idle')}
            type="button"
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
              statusFilter === 'idle'
                ? 'bg-amber-500 text-white ring-2 ring-amber-300 shadow-xs'
                : statusFilter === 'all'
                ? 'bg-amber-400 text-white hover:bg-amber-500'
                : 'bg-amber-400/30 text-amber-800 hover:bg-amber-400/50'
            }`}
          >
            Idle
          </button>
          <button
            onClick={() => onFilterChange(statusFilter === 'stopped' ? 'all' : 'stopped')}
            type="button"
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
              statusFilter === 'stopped'
                ? 'bg-red-600 text-white ring-2 ring-red-300 shadow-xs'
                : statusFilter === 'all'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-500/30 text-red-800 hover:bg-red-500/50'
            }`}
          >
            Stopped
          </button>
        </div>
      </div>

      {/* Hover Tooltip display if user is hovering a Gantt segment */}
      {hoveredSegment && (
        <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center justify-between animate-in fade-in duration-150 border border-slate-700">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${getStatusColorClass(
                hoveredSegment.segment.status
              )}`}
            />
            <span className="font-semibold text-slate-100">
              {hoveredSegment.segment.startTime} – {hoveredSegment.segment.endTime}
            </span>
            <span className="text-slate-300">({hoveredSegment.segment.durationMinutes} min)</span>
            <span className="text-slate-400">•</span>
            <span className="text-white font-medium">{hoveredSegment.segment.label}</span>
          </div>
          <span className="text-[11px] text-slate-400 capitalize">
            State: {hoveredSegment.segment.status}
          </span>
        </div>
      )}

      {/* Machines List */}
      <div className="space-y-3.5" data-purpose="machines-timeline-list">
        {filteredMachines.map((machine) => (
          <article
            key={machine.id}
            id={`machine-row-${machine.id}`}
            onClick={() => onSelectMachine(machine.id)}
            className="group bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition duration-150 flex flex-col gap-3 cursor-pointer relative"
            data-purpose="machine-row"
          >
            {/* Machine Title & Time Markers Header */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${getStatusDotClasses(machine.status)}`} />
                <span className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition flex items-center gap-1.5">
                  {machine.name}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-sky-500 transition" />
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  • {machine.model}
                </span>
              </div>
              <div className="w-3/5 hidden sm:flex justify-between text-[11px] px-1 font-mono text-slate-400 select-none">
                <span>06:00</span>
                <span>10:00</span>
                <span>14:00</span>
              </div>
            </div>

            {/* Gantt Status Bar */}
            <div
              className="w-full flex items-center gap-1.5 h-3 select-none"
              title="Click machine to inspect telemetry & logs"
            >
              {machine.timeline.map((segment) => (
                <div
                  key={segment.id}
                  onMouseEnter={() =>
                    setHoveredSegment({ machineId: machine.id, segment })
                  }
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={`h-full ${getStatusColorClass(
                    segment.status
                  )} rounded-full cursor-help hover:opacity-85 transition-opacity`}
                  style={{ flex: segment.flex }}
                />
              ))}
            </div>

            {/* Operational Sub-Details & Metrics */}
            <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-slate-50 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500 text-[11px] font-medium">
                  {machine.currentOperation}
                </span>
                {getStatusBadge(machine.status)}
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {machine.operator}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-mono text-[11px] flex-wrap">
                <span>
                  <strong className="font-semibold text-slate-800 font-sans">
                    {machine.runtimeFormatted}
                  </strong>{' '}
                  runtime
                </span>
                <span>
                  <strong className="font-semibold text-slate-800 font-sans">
                    {machine.utilizationPercent}%
                  </strong>{' '}
                  utilization
                </span>
                <span>
                  <strong className="font-semibold text-slate-800 font-sans">
                    {machine.partsCompleted}/{machine.partsPlanned}
                  </strong>{' '}
                  parts
                </span>
              </div>
            </div>
          </article>
        ))}

        {filteredMachines.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-200">
            <p className="text-sm font-medium">No machines matching "{statusFilter}" status.</p>
            <button
              onClick={() => onFilterChange('all')}
              className="mt-2 text-xs text-sky-600 hover:underline font-semibold"
            >
              Show all machines
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
