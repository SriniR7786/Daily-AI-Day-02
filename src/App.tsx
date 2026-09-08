import React, { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_MACHINES,
  INITIAL_OEE_METRICS,
  INITIAL_DOWNTIME_CAUSES,
  INITIAL_ALERTS,
  INITIAL_SHIFTS,
} from './data/initialData';
import {
  Machine,
  MachineStatus,
  OEEMetrics,
  DowntimeCause,
  ShopAlert,
  DashboardScreen,
  ShiftInfo,
} from './types';
import { TopNav } from './components/TopNav';
import { DashboardHeader } from './components/DashboardHeader';
import { OEECard } from './components/OEECard';
import { DowntimeCard } from './components/DowntimeCard';
import { ShiftOutputCard } from './components/ShiftOutputCard';
import { MachineStatusBoard } from './components/MachineStatusBoard';
import { MachineDetailScreen } from './components/MachineDetailScreen';
import { ShiftAnalyticsScreen } from './components/ShiftAnalyticsScreen';
import { CommandPalette } from './components/CommandPalette';
import { SidebarDrawer } from './components/SidebarDrawer';

export default function App() {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [metrics, setMetrics] = useState<OEEMetrics>(INITIAL_OEE_METRICS);
  const [downtimeCauses, setDowntimeCauses] = useState<DowntimeCause[]>(INITIAL_DOWNTIME_CAUSES);
  const [alerts, setAlerts] = useState<ShopAlert[]>(INITIAL_ALERTS);
  const [shifts] = useState<ShiftInfo[]>(INITIAL_SHIFTS);
  const [currentShift, setCurrentShift] = useState<ShiftInfo>(INITIAL_SHIFTS[0]);

  // Output stats
  const [goodParts, setGoodParts] = useState<number>(153);
  const [planTarget, setPlanTarget] = useState<number>(142);
  const [scrapCount, setScrapCount] = useState<number>(3);

  // Screen and UI navigation state
  const [currentScreen, setCurrentScreen] = useState<DashboardScreen>('overview');
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<MachineStatus | 'all'>('all');

  // Interactive modes
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Helper format seconds to HH:MM:SS
  const formatSeconds = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  // Live simulation tick effect when active
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setMachines((prevMachines) =>
        prevMachines.map((m) => {
          if (m.status === 'running') {
            const nextRuntime = m.runtimeSeconds + 1;
            // Spindle load jitter
            const jitter = (Math.random() - 0.5) * 4;
            const newLoad = Math.max(10, Math.min(95, Math.round(m.telemetry.spindleLoadPercent + jitter)));
            const newCycleTime = (m.telemetry.cycleTimeSec + 1) % (m.telemetry.cycleTotalSec || 200);

            return {
              ...m,
              runtimeSeconds: nextRuntime,
              runtimeFormatted: formatSeconds(nextRuntime),
              telemetry: {
                ...m.telemetry,
                spindleLoadPercent: newLoad,
                cycleTimeSec: newCycleTime,
              },
            };
          }
          return m;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Reset demo data
  const handleResetData = useCallback(() => {
    setMachines(INITIAL_MACHINES);
    setMetrics(INITIAL_OEE_METRICS);
    setDowntimeCauses(INITIAL_DOWNTIME_CAUSES);
    setGoodParts(153);
    setScrapCount(3);
    setAlerts(INITIAL_ALERTS);
    setStatusFilter('all');
  }, []);

  // Update machine status
  const handleUpdateMachineStatus = (
    machineId: string,
    newStatus: MachineStatus,
    operationName?: string
  ) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId) {
          return {
            ...m,
            status: newStatus,
            currentOperation: operationName || m.currentOperation,
            telemetry: {
              ...m.telemetry,
              spindleRpm: newStatus === 'running' ? m.telemetry.spindleMaxRpm * 0.7 : 0,
              spindleLoadPercent: newStatus === 'running' ? 55 : 0,
              feedRateMmMin: newStatus === 'running' ? 3200 : 0,
            },
          };
        }
        return m;
      })
    );
  };

  // Increment finished part on machine
  const handleIncrementPart = (machineId: string) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId) {
          return {
            ...m,
            partsCompleted: m.partsCompleted + 1,
          };
        }
        return m;
      })
    );
    setGoodParts((prev) => prev + 1);
  };

  // Select machine drilldown
  const handleSelectMachine = (machineId: string) => {
    setSelectedMachineId(machineId);
    setCurrentScreen('machine-detail');
  };

  // Acknowledge alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 lg:p-10 font-sans text-slate-800">
      {/* Top Utility Bar */}
      <TopNav
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          if (screen !== 'machine-detail') setSelectedMachineId(null);
        }}
        isLiveActive={isLiveActive}
        onToggleLive={() => setIsLiveActive(!isLiveActive)}
        alerts={alerts}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onSelectMachine={handleSelectMachine}
      />

      {/* Screen Routing */}
      {currentScreen === 'machine-detail' ? (
        <MachineDetailScreen
          machine={selectedMachine}
          onBack={() => {
            setCurrentScreen('overview');
            setSelectedMachineId(null);
          }}
          onUpdateStatus={handleUpdateMachineStatus}
          onIncrementPart={handleIncrementPart}
        />
      ) : currentScreen === 'analytics' ? (
        <ShiftAnalyticsScreen
          machines={machines}
          downtimeCauses={downtimeCauses}
          metrics={metrics}
          currentShift={currentShift}
          onBack={() => setCurrentScreen('overview')}
          onSelectMachine={handleSelectMachine}
        />
      ) : (
        /* Primary Screen: Main Shop Floor Performance Dashboard */
        <main
          id="dashboard-container"
          className="w-full max-w-7xl bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col"
          data-purpose="dashboard-container"
        >
          {/* Dashboard Dark Header Banner */}
          <DashboardHeader
            machineCount={machines.length}
            isLiveActive={isLiveActive}
            onToggleLive={() => setIsLiveActive(!isLiveActive)}
            onResetData={handleResetData}
            currentShift={currentShift}
            shifts={shifts}
            onSelectShift={setCurrentShift}
          />

          {/* Dashboard Content Grid */}
          <div
            id="dashboard-body"
            className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-slate-50/50"
            data-purpose="dashboard-body"
          >
            {/* Left Column (Metrics & Downtime) */}
            <aside
              id="left-column-metrics"
              className="lg:col-span-4 flex flex-col gap-6"
              data-purpose="left-column-metrics"
            >
              {/* Today OEE Dark Card */}
              <OEECard
                metrics={metrics}
                onDrillDown={() => setCurrentScreen('analytics')}
              />

              {/* Downtime Causes Breakdown */}
              <DowntimeCard
                causes={downtimeCauses}
                onOpenPareto={() => setCurrentScreen('analytics')}
              />

              {/* Shift Output Counter */}
              <ShiftOutputCard
                goodParts={goodParts}
                planTarget={planTarget}
                scrapCount={scrapCount}
              />
            </aside>

            {/* Right Column (Machine Status Board) */}
            <MachineStatusBoard
              machines={machines}
              onSelectMachine={handleSelectMachine}
              statusFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>
        </main>
      )}

      {/* Slide-over Navigation Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          if (screen !== 'machine-detail') setSelectedMachineId(null);
        }}
        currentShift={currentShift}
        isLiveActive={isLiveActive}
      />

      {/* ⌘K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        machines={machines}
        onSelectMachine={handleSelectMachine}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          if (screen !== 'machine-detail') setSelectedMachineId(null);
        }}
        isLiveActive={isLiveActive}
        onToggleLive={() => setIsLiveActive(!isLiveActive)}
        onResetData={handleResetData}
      />
    </div>
  );
}
