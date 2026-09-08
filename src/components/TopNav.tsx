import React, { useState } from 'react';
import { Menu, Search, ChevronRight, Bell, Activity, CheckCircle2, AlertTriangle, XCircle, LayoutDashboard, Cpu, BarChart3 } from 'lucide-react';
import { DashboardScreen, ShopAlert } from '../types';

interface TopNavProps {
  currentScreen: DashboardScreen;
  onNavigate: (screen: DashboardScreen) => void;
  isLiveActive: boolean;
  onToggleLive: () => void;
  alerts: ShopAlert[];
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
  onAcknowledgeAlert: (id: string) => void;
  onSelectMachine: (machineId: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentScreen,
  onNavigate,
  isLiveActive,
  onToggleLive,
  alerts,
  onOpenCommandPalette,
  onToggleSidebar,
  onAcknowledgeAlert,
  onSelectMachine,
}) => {
  const [showAlertsPopover, setShowAlertsPopover] = useState(false);
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div
      id="top-utility-bar"
      className="w-full max-w-7xl flex flex-wrap items-center justify-between py-2.5 px-4 mb-2 text-slate-500 text-xs font-medium gap-3"
      data-purpose="top-utility-bar"
    >
      {/* Left side: Menu, Search shortcut, Navigation links */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          id="btn-sidebar-toggle"
          onClick={onToggleSidebar}
          className="text-slate-600 hover:text-slate-900 focus:outline-none p-1 rounded-md hover:bg-slate-200/60 transition cursor-pointer"
          type="button"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          id="btn-search-command-palette"
          onClick={onOpenCommandPalette}
          type="button"
          className="flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-800 transition py-1 px-2 rounded-md hover:bg-slate-200/50"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-600 font-sans hidden sm:inline">Search machines & actions</span>
          <span className="text-[11px] tracking-wider border border-slate-300 rounded px-1.5 py-0.5 text-slate-500 font-mono bg-white shadow-xs">
            ⌘K
          </span>
        </button>

        {/* Screen Switcher Pills */}
        <div className="hidden md:flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg border border-slate-300/60 text-[11px]">
          <button
            id="nav-tab-overview"
            onClick={() => onNavigate('overview')}
            className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
              currentScreen === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            id="nav-tab-analytics"
            onClick={() => onNavigate('analytics')}
            className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
              currentScreen === 'analytics'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Shift Analytics</span>
          </button>
        </div>
      </div>

      {/* Right side: Active Mode switch and User/Alerts badge */}
      <div className="flex items-center gap-4 relative">
        {/* Active Mode indicator toggle */}
        <button
          id="btn-toggle-active-mode"
          onClick={onToggleLive}
          type="button"
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition cursor-pointer ${
            isLiveActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
          }`}
          title={isLiveActive ? 'Live simulation running (1s ticks)' : 'Click to activate live simulation mode'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          <span className="font-medium">
            Active Mode: <strong className="font-semibold">{isLiveActive ? 'Live' : 'Off'}</strong>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>

        {/* User profile / Shop Alerts popover trigger */}
        <div className="relative">
          <button
            id="btn-alerts-popover"
            onClick={() => setShowAlertsPopover(!showAlertsPopover)}
            type="button"
            className="relative cursor-pointer focus:outline-none"
            aria-label="Shop floor alerts"
          >
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 p-0.5 flex items-center justify-center bg-white shadow-xs hover:ring-2 hover:ring-emerald-300 transition">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-amber-400" />
            </div>
            {unacknowledgedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                {unacknowledgedCount}
              </span>
            )}
          </button>

          {/* Alerts Popover Menu */}
          {showAlertsPopover && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowAlertsPopover(false)}
              />
              <div
                id="popover-alerts-menu"
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40 animate-in fade-in zoom-in-95 text-slate-800"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-700" />
                    <h3 className="font-semibold text-sm text-slate-900">Shop Floor Notifications</h3>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {unacknowledgedCount} new
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto my-2">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`py-2.5 px-1 flex flex-col gap-1 transition rounded-md ${
                        alert.acknowledged ? 'opacity-60' : 'bg-slate-50/70 p-2 my-1'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {alert.severity === 'danger' && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                          {alert.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                          {alert.severity === 'info' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                          <span className="font-semibold text-xs text-slate-900">{alert.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 pl-5">{alert.description}</p>
                      <div className="flex items-center justify-between pl-5 pt-1 text-[11px]">
                        <button
                          onClick={() => {
                            onSelectMachine(alert.machineId);
                            setShowAlertsPopover(false);
                          }}
                          className="text-sky-600 hover:text-sky-700 font-medium cursor-pointer"
                        >
                          Inspect {alert.machineName} →
                        </button>
                        {!alert.acknowledged && (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="text-slate-500 hover:text-slate-800 text-[10px] px-2 py-0.5 rounded bg-slate-200/70 hover:bg-slate-200 cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span>Plant: Munich CNC Cell A/B</span>
                  <button
                    onClick={() => {
                      alerts.forEach(a => onAcknowledgeAlert(a.id));
                    }}
                    className="text-xs text-sky-600 hover:text-sky-800 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
