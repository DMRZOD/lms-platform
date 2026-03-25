// ─── Status / Enum Types ────────────────────────────────────────────────────

export type KPIStatus = "OnTrack" | "AtRisk" | "Critical" | "Exceeded";
export type KPICategory =
  | "Academic"
  | "Financial"
  | "Quality"
  | "Operational"
  | "Student";
export type Department =
  | "Engineering"
  | "Economics"
  | "Health Sciences"
  | "Humanities"
  | "Design"
  | "Natural Sciences";
export type TrendDirection = "up" | "down" | "stable";
export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus =
  | "open"
  | "investigating"
  | "resolved"
  | "escalated";
export type ReportType =
  | "Executive"
  | "Academic"
  | "Financial"
  | "Quality"
  | "Custom";
export type ReportFormat = "PDF" | "Excel" | "PowerPoint";
export type AlertSeverity = "warning" | "danger" | "info" | "success";
export type ForecastConfidence = "high" | "medium" | "low";

// ─── Entity Interfaces ───────────────────────────────────────────────────────

export interface KPIMetric {
  id: string;
  name: string;
  category: KPICategory;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: KPIStatus;
  trend: TrendDirection;
  changePercent: number;
  department?: Department;
  period: string;
}

export interface DepartmentPerformance {
  department: Department;
  gpa: number;
  enrollmentCount: number;
  retentionRate: number;
  satisfactionScore: number;
  completionRate: number;
  revenueCollected: number;
  outstandingDebt: number;
  qualityScore: number;
  teacherCount: number;
  studentTeacherRatio: number;
}

export interface AcademicProgram {
  id: string;
  name: string;
  department: Department;
  enrolledStudents: number;
  avgGPA: number;
  completionRate: number;
  satisfactionScore: number;
  coursesCount: number;
}

export interface AttendanceSummary {
  department: Department;
  totalStudents: number;
  avgAttendanceRate: number;
  belowThresholdCount: number;
  trend: TrendDirection;
  byMonth: { month: string; rate: number }[];
}

export interface FinancialSummary {
  department: Department;
  budgetAllocated: number;
  budgetSpent: number;
  revenueCollected: number;
  outstandingDebt: number;
  collectionRate: number;
  forecastedRevenue: number;
}

export interface QualityMetric {
  id: string;
  name: string;
  department: Department;
  score: number;
  maxScore: number;
  status: KPIStatus;
  auditsCompleted: number;
  issuesOpen: number;
  lastAuditDate: string;
}

export interface StudentProgression {
  cohort: string;
  initialEnrollment: number;
  currentEnrollment: number;
  retentionRate: number;
  graduationRate: number;
  avgTimeToGraduation: number;
  atRiskCount: number;
  droppedCount: number;
}

export interface ComparativeEntry {
  department: Department;
  metric: string;
  currentPeriodValue: number;
  previousPeriodValue: number;
  changePercent: number;
  trend: TrendDirection;
}

export interface ForecastDataPoint {
  period: string;
  actual: number | null;
  forecast: number;
  confidence: ForecastConfidence;
  lower: number;
  upper: number;
}

export interface ForecastScenario {
  id: string;
  name: string;
  description: string;
  assumptions: string[];
  projections: ForecastDataPoint[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  department: Department;
  reportedAt: string;
  reportedBy: string;
  assignedTo: string;
  resolvedAt: string | null;
  impactDescription: string;
}

export interface ExecutiveReport {
  id: string;
  type: ReportType;
  title: string;
  period: string;
  format: ReportFormat;
  generatedAt: string;
  generatedBy: string;
  fileSize: string;
  status: "Ready" | "Generating" | "Failed";
}

export interface DeputySettings {
  dashboardRefreshInterval: number;
  defaultDepartment: string;
  kpiAlertThreshold: number;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  notificationEmail: string;
  preferredReportFormat: ReportFormat;
}

// ─── Stats Interfaces ─────────────────────────────────────────────────────────

export interface DeputyDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  overallGPA: number;
  retentionRate: number;
  satisfactionScore: number;
  revenueYTD: number;
  kpisOnTrack: number;
  kpisAtRisk: number;
  openIncidents: number;
  qualityScore: number;
}

export interface KPICenterStats {
  totalKPIs: number;
  onTrack: number;
  atRisk: number;
  critical: number;
  exceeded: number;
}

export interface AttendanceStats {
  universityAvgRate: number;
  belowThresholdDepartments: number;
  trendDirection: TrendDirection;
}

export interface FinancialOverviewStats {
  totalBudget: number;
  totalSpent: number;
  totalRevenue: number;
  totalDebt: number;
  overallCollectionRate: number;
}
