import React from 'react';
import { ArrowLeft, BarChart3, PieChart, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { Machine, DowntimeCause, OEEMetrics, ShiftInfo } from '../types';

interface ShiftAnalyticsScreenProps {
  machines: Machine[];
  downtimeCauses: DowntimeCause[];
  metrics: OEEMetrics;
  currentShift: ShiftInfo;
  onBack: () => void;
  onSelectMachine: (machineId: string) => void;
}

export const ShiftAnalyticsScreen: React.FC<ShiftAnalyticsScreenProps> = ({
  machines,
  downtimeCauses,
  metrics,
  currentShift,
  onBack,
  onSelectMachine,
}) => {
  const totalDowntimeMinutes = downtimeCauses.reduce((acc, c) => acc + c.minutes, 0);

  // Hourly production trend mock
  const hourlyData = [
    { hour: '06:00', plan: 18, actual: 16 },
    { hour: '07:00', plan: 18, actual: 19 },
    { hour: '08:00', plan: 18, actual: 17 },
    { hour: '09:00', plan: 18, actual: 21 },
    { hour: '10:00', plan: 18, actual: 18 },
    { hour: '11:00', plan: 18, actual: 22 },
    { hour: '12:00', plan: 18, actual: 19 },
    { hour: '13:00', plan: 18, actual: 21 },
  ];

  return (
    <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#141824] px-6 sm:px-8 py-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            type="button"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Production Intelligence • {currentShift.name} ({currentShift.timeRange})
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              Shift Performance & OEE Root Cause Analysis
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-md bg-[#222938] text-xs font-semibold text-slate-300 border border-slate-700/50">
            Supervisor: {currentShift.supervisor}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-slate-50/50 space-y-8">
        {/* OEE Math Waterfall Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Overall Equipment Effectiveness (OEE) Formula</h2>
              <p className="text-xs text-slate-500">
                OEE = Availability × Performance × Quality
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Composite Score:</span>
              <span className="text-2xl font-extrabold text-sky-600">{metrics.oee}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Availability */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-700">1. Availability</span>
                <span className="text-xl font-extrabold text-emerald-600">{metrics.availability}%</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Operating Time / Planned Production Time</p>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Planned shift time:</span>
                  <span className="font-mono font-semibold">480 min</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Total downtime loss:</span>
                  <span className="font-mono font-semibold">-{totalDowntimeMinutes} min</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-800">
                  <span>Actual operating time:</span>
                  <span className="font-mono">412 min</span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-700">2. Performance</span>
                <span className="text-xl font-extrabold text-amber-500">{metrics.performance}%</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Actual Cycle Rate / Ideal Cycle Speed</p>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Ideal cycle time:</span>
                  <span className="font-mono font-semibold">180 sec/part</span>
                </div>
                <div className="flex justify-between text-amber-600">
                  <span>Reduced feed rate:</span>
                  <span className="font-mono font-semibold">Chatter damping</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-800">
                  <span>Effective rate:</span>
                  <span className="font-mono">237 sec/part</span>
                </div>
              </div>
            </div>

            {/* Quality */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-700">3. Quality</span>
                <span className="text-xl font-extrabold text-indigo-600">{metrics.quality}%</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Good Parts / Total Parts Run</p>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Good parts produced:</span>
                  <span className="font-mono font-semibold text-emerald-600">153 pcs</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Scrap / rework pieces:</span>
                  <span className="font-mono font-semibold">3 pcs</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-800">
                  <span>First-pass yield:</span>
                  <span className="font-mono">98.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Downtime Causes Pareto Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Downtime Causes Pareto Breakdown</h3>
                <p className="text-xs text-slate-500">Ranked contribution to lost machine capacity</p>
              </div>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                Total: {totalDowntimeMinutes} min
              </span>
            </div>

            <div className="space-y-4">
              {downtimeCauses.map((cause, index) => {
                const percent = Math.round((cause.minutes / totalDowntimeMinutes) * 100);
                return (
                  <div key={cause.id} className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-mono">
                          {index + 1}
                        </span>
                        <span className="text-slate-800">{cause.label}</span>
                      </span>
                      <span className="text-slate-900 font-mono">
                        {cause.minutes} min ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-1.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ backgroundColor: cause.color, width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">{cause.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hourly Output vs Target Pace */}
          <div className="lg:col-span-6 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Hourly Production Rhythm</h3>
                  <p className="text-xs text-slate-500">Actual output per hour vs shift target (18 parts/hr)</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  +8% Shift Surplus
                </span>
              </div>

              {/* Bar graph */}
              <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
                {hourlyData.map((item) => {
                  const maxBarHeight = 24;
                  const heightPercent = (item.actual / maxBarHeight) * 100;
                  const isOver = item.actual >= item.plan;

                  return (
                    <div key={item.hour} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition">
                        {item.actual}
                      </span>
                      <div className="w-full bg-slate-100 rounded-t-md relative flex items-end h-40">
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            isOver ? 'bg-emerald-500 group-hover:bg-emerald-600' : 'bg-amber-400'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{item.hour}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span>Met/Exceeded plan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-400" />
                <span>Below rate</span>
              </div>
              <button
                onClick={onBack}
                type="button"
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
              >
                Back to Dashboard →
              </button>
            </div>
          </div>
        </div>

        {/* Machine Comparison Scorecard */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-4">CNC Cell Machine Scorecard</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Machine</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Operator</th>
                  <th className="py-2.5 px-3">Runtime</th>
                  <th className="py-2.5 px-3">Utilization</th>
                  <th className="py-2.5 px-3">Parts / Plan</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {machines.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {m.name}
                      <span className="block text-[10px] text-slate-400 font-normal">{m.model}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.status === 'running'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'idle'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">{m.operator}</td>
                    <td className="py-3 px-3 font-mono">{m.runtimeFormatted}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{m.utilizationPercent}%</td>
                    <td className="py-3 px-3 font-mono">
                      {m.partsCompleted}/{m.partsPlanned}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onSelectMachine(m.id)}
                        className="text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
                      >
                        Inspect →
                      </button>
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
