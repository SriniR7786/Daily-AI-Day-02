import React from 'react';

interface ShiftOutputCardProps {
  goodParts: number;
  planTarget: number;
  scrapCount: number;
}

export const ShiftOutputCard: React.FC<ShiftOutputCardProps> = ({
  goodParts,
  planTarget,
  scrapCount,
}) => {
  const percentVsPlan = Math.round(((goodParts - planTarget) / planTarget) * 100);
  const isAhead = percentVsPlan >= 0;
  const yieldPercent = ((goodParts / (goodParts + scrapCount)) * 100).toFixed(1);

  return (
    <div
      id="card-shift-output"
      className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs"
      data-purpose="shift-output-card"
    >
      <h2 className="text-sm font-bold text-slate-800 tracking-tight mb-3">Shift Output</h2>
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {goodParts}
          </span>
          <p className="text-xs text-slate-500 mt-0.5">good parts</p>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${
              isAhead
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-amber-600 bg-amber-50'
            }`}
          >
            {isAhead ? `+${percentVsPlan}%` : `${percentVsPlan}%`}
          </span>
          <p className="text-xs text-slate-400 mt-1">vs. plan ({planTarget})</p>
        </div>
      </div>

      {/* Subtle bottom telemetry: scrap and yield */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Scrap: <strong className="text-slate-700 font-medium">{scrapCount} pcs</strong>
        </span>
        <span>
          Yield: <strong className="text-slate-700 font-medium">{yieldPercent}%</strong>
        </span>
      </div>
    </div>
  );
};
