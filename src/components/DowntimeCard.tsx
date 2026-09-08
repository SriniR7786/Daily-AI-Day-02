import React from 'react';
import { DowntimeCause } from '../types';
import { AlertOctagon, ExternalLink } from 'lucide-react';

interface DowntimeCardProps {
  causes: DowntimeCause[];
  onOpenPareto?: () => void;
  onSelectCause?: (cause: DowntimeCause) => void;
}

export const DowntimeCard: React.FC<DowntimeCardProps> = ({
  causes,
  onOpenPareto,
  onSelectCause,
}) => {
  const totalMinutes = causes.reduce((acc, c) => acc + c.minutes, 0);

  return (
    <div
      id="card-downtime-causes"
      className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs"
      data-purpose="downtime-causes-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight">Downtime Causes</h2>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{totalMinutes} min</span>
          <span className="text-[11px] text-slate-400">total</span>
          {onOpenPareto && (
            <button
              onClick={onOpenPareto}
              type="button"
              className="ml-1 text-slate-400 hover:text-sky-600 transition cursor-pointer p-0.5"
              title="View Downtime Pareto & Root Causes"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3.5">
        {causes.map((cause) => {
          // Dynamic percentage relative to a 60-minute reference scale or max
          const barWidthPercent = Math.min(100, Math.round((cause.minutes / 55) * 100));

          return (
            <div
              key={cause.id}
              onClick={() => onSelectCause?.(cause)}
              className="group cursor-pointer"
            >
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 group-hover:text-slate-900 transition flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: cause.color }}
                  />
                  {cause.label}
                </span>
                <span className="text-slate-900 font-bold">{cause.minutes} min</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: cause.color,
                    width: `${barWidthPercent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
