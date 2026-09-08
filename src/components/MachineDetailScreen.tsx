import React, { useState } from 'react';
import { Machine, MachineStatus } from '../types';
import {
  ArrowLeft,
  Activity,
  Gauge,
  Thermometer,
  Wrench,
  FileCode,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  AlertOctagon,
  User,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

interface MachineDetailScreenProps {
  machine: Machine;
  onBack: () => void;
  onUpdateStatus: (machineId: string, newStatus: MachineStatus, operationName?: string) => void;
  onIncrementPart: (machineId: string) => void;
}

export const MachineDetailScreen: React.FC<MachineDetailScreenProps> = ({
  machine,
  onBack,
  onUpdateStatus,
  onIncrementPart,
}) => {
  const [selectedTab, setSelectedTab] = useState<'telemetry' | 'timeline' | 'tools'>('telemetry');
  const [showDowntimePrompt, setShowDowntimePrompt] = useState(false);
  const [downtimeReason, setDowntimeReason] = useState('Tool change / setup');

  const { telemetry } = machine;
  const cyclePercent = Math.min(
    100,
    Math.round((telemetry.cycleTimeSec / (telemetry.cycleTotalSec || 1)) * 100)
  );

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Running
          </span>
        );
      case 'idle':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-white flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white" />
            Idle
          </span>
        );
      case 'stopped':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white" />
            Stopped
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col animate-in fade-in duration-200">
      {/* Header bar matching the dark brand styling */}
      <div className="bg-[#141824] px-6 sm:px-8 py-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            id="btn-back-to-dashboard"
            onClick={onBack}
            type="button"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
            title="Back to CNC cell dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              <span>{machine.cell}</span>
              <span>•</span>
              <span>{machine.model}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5 flex items-center gap-3">
              {machine.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {getStatusBadge(machine.status)}
          <div className="flex items-center gap-1.5 bg-[#222938] px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Operator: <strong>{machine.operator}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Control Strip */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-6 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Quick State Override:</span>
          <button
            onClick={() => onUpdateStatus(machine.id, 'running', 'Normal Production')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              machine.status === 'running'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            Set Running
          </button>
          <button
            onClick={() => onUpdateStatus(machine.id, 'idle', 'Waiting for setup/material')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              machine.status === 'idle'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            Set Idle
          </button>
          <button
            onClick={() => setShowDowntimePrompt(true)}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              machine.status === 'stopped'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            Halt / Stop
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onIncrementPart(machine.id)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Finished Part ({machine.partsCompleted}/{machine.partsPlanned})</span>
          </button>
        </div>
      </div>

      {/* Stop prompt modal if triggered */}
      {showDowntimePrompt && (
        <div className="bg-red-50 border-b border-red-200 px-6 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-900">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            <span className="font-bold">Log Machine Stop Reason:</span>
            <select
              value={downtimeReason}
              onChange={(e) => setDowntimeReason(e.target.value)}
              className="bg-white border border-red-300 rounded px-2 py-1 text-slate-800 text-xs"
            >
              <option value="Tool change / setup">Tool change / setup</option>
              <option value="Chip conveyor jam">Chip conveyor jam</option>
              <option value="Waiting for material">Waiting for material</option>
              <option value="Quality inspection gate">Quality inspection gate</option>
              <option value="Emergency E-Stop triggered">Emergency E-Stop triggered</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onUpdateStatus(machine.id, 'stopped', downtimeReason);
                setShowDowntimePrompt(false);
              }}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
            >
              Confirm Stop
            </button>
            <button
              onClick={() => setShowDowntimePrompt(false)}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 bg-slate-50/50 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Shift Runtime
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {machine.runtimeFormatted}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Utilization: {machine.utilizationPercent}%</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Parts Completed
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{machine.partsCompleted}</span>
              <span className="text-sm text-slate-500">/ {machine.partsPlanned}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{
                  width: `${Math.min(100, (machine.partsCompleted / machine.partsPlanned) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Spindle Speed
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {telemetry.spindleRpm.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">RPM</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Max: {telemetry.spindleMaxRpm.toLocaleString()} RPM</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Spindle Load & Temp
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {telemetry.spindleLoadPercent}%
              </span>
              <span className="text-sm font-semibold text-slate-600">
                {telemetry.temperatureC}°C
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full ${
                  telemetry.spindleLoadPercent > 80 ? 'bg-amber-500' : 'bg-sky-500'
                }`}
                style={{ width: `${telemetry.spindleLoadPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Real-time Telemetry & Active Program */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Job & Program Details */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <FileCode className="w-4 h-4 text-sky-600" />
                  <span>Program & Operation</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Active OP
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Current Operation
                  </span>
                  <span className="font-bold text-slate-800 text-sm">{machine.currentOperation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    NC Program File
                  </span>
                  <span className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">
                    {telemetry.programName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Cycle Time Progress
                  </span>
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>{Math.floor(telemetry.cycleTimeSec / 60)}m {telemetry.cycleTimeSec % 60}s</span>
                    <span>{Math.floor(telemetry.cycleTotalSec / 60)}m {telemetry.cycleTotalSec % 60}s</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-1 overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${cyclePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-500">
              Coolant pressure: <strong>{telemetry.coolantPressureBar} bar</strong>
            </div>
          </div>

          {/* Active Tooling & Wear Gauge */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <span>Tooling in Spindle</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Slot ATC
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Tool Description
                  </span>
                  <span className="font-semibold text-slate-800">{telemetry.currentTool}</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Tool Wear Index</span>
                    <span>{telemetry.toolWearPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        telemetry.toolWearPercent > 80
                          ? 'bg-red-500'
                          : telemetry.toolWearPercent > 50
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${telemetry.toolWearPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Automatic tool life offset management enabled
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-slate-400 text-[10px]">X Load</span>
                    <span className="font-bold text-slate-800">{telemetry.axisLoads.x}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-slate-400 text-[10px]">Y Load</span>
                    <span className="font-bold text-slate-800">{telemetry.axisLoads.y}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-slate-400 text-[10px]">Z Load</span>
                    <span className="font-bold text-slate-800">{telemetry.axisLoads.z}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Feed: <strong>{telemetry.feedRateMmMin} mm/min</strong></span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Laser probe OK
              </span>
            </div>
          </div>

          {/* Machine Notes & Supervisor Log */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span>Operator Log & Notes</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600 space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                  <span className="font-semibold text-slate-800 block mb-1">
                    Shift Supervisor Handoff:
                  </span>
                  <p className="italic text-slate-600">{machine.notes || 'No active alerts logged for this shift.'}</p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>• Daily preventive lubrication: <strong>Completed (05:45)</strong></div>
                  <div>• First-off CMM quality report: <strong>Signed (07:15)</strong></div>
                  <div>• Coolant refractometer reading: <strong>8.2% (Nominal)</strong></div>
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
              type="button"
              className="mt-4 w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer text-center"
            >
              Return to Full Cell Board
            </button>
          </div>
        </div>

        {/* Detailed Timeline Table for the machine */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Shift Timeline Segment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Time Range</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Activity / Operation</th>
                  <th className="py-2.5 px-3">Details / Operator Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {machine.timeline.map((seg) => (
                  <tr key={seg.id} className="hover:bg-slate-50/70 transition font-sans">
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          seg.status === 'running'
                            ? 'bg-emerald-100 text-emerald-800'
                            : seg.status === 'idle'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {seg.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {seg.startTime} – {seg.endTime}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{seg.durationMinutes} min</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{seg.label}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      {seg.notes || 'Routine operation phase'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
