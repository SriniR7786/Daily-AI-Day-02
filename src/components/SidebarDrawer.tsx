import React from 'react';
import { X, LayoutDashboard, Cpu, BarChart3, Clock, AlertCircle, HardDrive, Radio } from 'lucide-react';
import { DashboardScreen, ShiftInfo } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: DashboardScreen;
  onNavigate: (screen: DashboardScreen) => void;
  currentShift: ShiftInfo;
  isLiveActive: boolean;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  currentShift,
  isLiveActive,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <aside
        id="sidebar-drawer"
        className="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white shadow-2xl z-50 flex flex-col justify-between border-r border-slate-200 animate-in slide-in-from-left duration-200"
      >
        <div>
          {/* Drawer Header */}
          <div className="bg-[#141824] px-5 py-5 text-white flex items-center justify-between border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Plant Automation OS
              </span>
              <h2 className="text-base font-bold text-white">Shop Floor Control</h2>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1 text-xs">
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Views & Dashboards
            </span>

            <button
              onClick={() => {
                onNavigate('overview');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition cursor-pointer ${
                currentScreen === 'overview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Shop Floor Dashboard</span>
            </button>

            <button
              onClick={() => {
                onNavigate('analytics');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition cursor-pointer ${
                currentScreen === 'analytics'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Shift Analytics & OEE</span>
            </button>
          </div>

          {/* Shift & Gateway Status */}
          <div className="p-4 border-t border-slate-100 text-xs text-slate-600 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Facility Information
            </span>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Active Shift:</span>
                <span className="font-bold text-slate-800">{currentShift.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Time Range:</span>
                <span className="font-mono text-slate-700">{currentShift.timeRange}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Supervisor:</span>
                <span className="text-slate-700 font-medium">{currentShift.supervisor}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">OPC-UA Link:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-500 animate-pulse" /> Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>CNC Cell A/B • Munich Plant</span>
          <span className="font-mono text-slate-400">v2.4.0</span>
        </div>
      </aside>
    </>
  );
};
