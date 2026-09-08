export type MachineStatus = 'running' | 'idle' | 'stopped';

export interface TimelineSegment {
  id: string;
  status: MachineStatus;
  flex: number;
  startTime: string;
  endTime: string;
  label: string;
  durationMinutes: number;
  notes?: string;
}

export interface MachineTelemetry {
  spindleRpm: number;
  spindleMaxRpm: number;
  spindleLoadPercent: number;
  feedRateMmMin: number;
  axisLoads: { x: number; y: number; z: number };
  temperatureC: number;
  currentTool: string;
  toolWearPercent: number;
  programName: string;
  cycleTimeSec: number;
  cycleTotalSec: number;
  coolantPressureBar: number;
}

export interface Machine {
  id: string;
  name: string;
  model: string;
  cell: string;
  status: MachineStatus;
  currentOperation: string;
  operator: string;
  runtimeFormatted: string; // e.g. "05:44:24"
  runtimeSeconds: number;
  utilizationPercent: number;
  partsCompleted: number;
  partsPlanned: number;
  scrapCount: number;
  timeline: TimelineSegment[];
  telemetry: MachineTelemetry;
  notes?: string;
}

export interface DowntimeCause {
  id: string;
  label: string;
  minutes: number;
  color: string;
  percent: number;
  description: string;
  occurrences: number;
}

export interface OEEMetrics {
  oee: number;
  availability: number;
  performance: number;
  quality: number;
}

export interface ShopAlert {
  id: string;
  machineId: string;
  machineName: string;
  severity: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
}

export type DashboardScreen = 'overview' | 'machine-detail' | 'analytics' | 'machines-grid';

export interface ShiftInfo {
  id: 'early' | 'late' | 'night';
  name: string;
  timeRange: string;
  supervisor: string;
  plannedMinutes: number;
}
