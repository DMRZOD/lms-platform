// ─── Status / Enum Types ─────────────────────────────────────────────────────

export type UserStatus = "Active" | "Inactive" | "Suspended" | "Pending";
export type UserRole =
  | "applicant"
  | "student"
  | "teacher"
  | "academic"
  | "aqad"
  | "resource"
  | "accountant"
  | "deputy"
  | "admin"
  | "it-ops";

export type LogLevel = "info" | "warning" | "error" | "critical";
export type LogSource =
  | "Auth"
  | "API"
  | "System"
  | "Database"
  | "Scheduler"
  | "Integration";

export type PermissionModule =
  | "users"
  | "courses"
  | "finance"
  | "reports"
  | "settings"
  | "integrations"
  | "logs"
  | "security";
export type RolePermission = "read" | "write" | "delete" | "admin";

export type IntegrationStatus =
  | "Connected"
  | "Disconnected"
  | "Error"
  | "Syncing";
export type IntegrationType =
  | "Teams"
  | "Classmate"
  | "1C"
  | "aSc"
  | "SMTP"
  | "SMS Gateway";

export type ServiceStatus = "Healthy" | "Degraded" | "Down";
export type AlertSeverity = "warning" | "danger" | "info" | "success";

export type BackupStatus =
  | "Completed"
  | "Running"
  | "Failed"
  | "Scheduled";
export type BackupType = "Full" | "Incremental" | "Differential";

export type SecurityEventType =
  | "LoginFailed"
  | "LoginSuccess"
  | "PasswordChanged"
  | "2FAEnabled"
  | "2FADisabled"
  | "IPBlocked"
  | "SessionRevoked"
  | "RoleChanged"
  | "SuspiciousActivity";

export type TicketStatus =
  | "Open"
  | "InProgress"
  | "WaitingOnUser"
  | "Resolved"
  | "Closed";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low";
export type TicketCategory =
  | "Account"
  | "Technical"
  | "Billing"
  | "Access"
  | "Bug"
  | "Other";

export type ReportType =
  | "UserActivity"
  | "SystemPerformance"
  | "SecurityAudit"
  | "UsageStatistics"
  | "ComplianceReport"
  | "ErrorAnalysis";
export type ReportFormat = "PDF" | "Excel" | "CSV";
export type ReportStatus = "Ready" | "Generating" | "Failed";

export type DRPlanStatus = "Verified" | "NeedsTesting" | "Outdated";
export type ConfigCategory =
  | "General"
  | "Email"
  | "Security"
  | "Limits"
  | "Scheduling"
  | "Storage";

// ─── Entity Interfaces ────────────────────────────────────────────────────────

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string | null;
  createdAt: string;
  department: string;
  twoFactorEnabled: boolean;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  userId: string | null;
  userName: string | null;
  ipAddress: string;
  details: string;
}

export interface RoleDefinition {
  id: string;
  role: UserRole;
  label: string;
  userCount: number;
  permissions: { module: PermissionModule; access: RolePermission[] }[];
  isSystem: boolean;
  description: string;
}

export interface Integration {
  id: string;
  name: IntegrationType;
  status: IntegrationStatus;
  lastSync: string | null;
  nextSync: string | null;
  recordsSynced: number;
  errorCount: number;
  endpoint: string;
  description: string;
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: number;
  responseTime: number;
  lastChecked: string;
  cpuUsage: number;
  memoryUsage: number;
  errorRate: number;
}

export interface SystemMetric {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  requestsPerMinute: number;
}

export interface Backup {
  id: string;
  type: BackupType;
  status: BackupStatus;
  startedAt: string;
  completedAt: string | null;
  size: string;
  location: string;
  initiatedBy: string;
  retentionDays: number;
}

export interface DisasterRecoveryPlan {
  id: string;
  name: string;
  lastTested: string;
  rtoMinutes: number;
  rpoMinutes: number;
  status: DRPlanStatus;
}

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  timestamp: string;
  userId: string | null;
  userName: string | null;
  ipAddress: string;
  userAgent: string;
  details: string;
  severity: AlertSeverity;
}

export interface BlockedIP {
  id: string;
  ipAddress: string;
  reason: string;
  blockedAt: string;
  blockedBy: string;
  expiresAt: string | null;
  attempts: number;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  ipAddress: string;
  userAgent: string;
  startedAt: string;
  lastActivity: string;
  location: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  submittedBy: string;
  submittedByRole: UserRole;
  assignedTo: string | null;
  responseCount: number;
}

export interface SystemReport {
  id: string;
  type: ReportType;
  title: string;
  period: string;
  format: ReportFormat;
  generatedAt: string;
  generatedBy: string;
  fileSize: string;
  status: ReportStatus;
}

export interface SystemConfigItem {
  id: string;
  key: string;
  value: string;
  category: ConfigCategory;
  description: string;
  lastModified: string;
  modifiedBy: string;
  isSecret: boolean;
}

// ─── Stats Interfaces ─────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  activeSessions: number;
  systemUptime: number;
  errorRate: number;
  avgResponseTime: number;
  pendingTickets: number;
  securityAlerts: number;
}

export interface UserManagementStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingUsers: number;
  newUsersThisMonth: number;
  twoFactorAdoption: number;
}

export interface LogsPageStats {
  totalLogs24h: number;
  errors24h: number;
  warnings24h: number;
  criticalEvents: number;
}

export interface MonitoringStats {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  requestsPerMinute: number;
  avgResponseTime: number;
}

export interface SecurityStats {
  failedLogins24h: number;
  blockedIPs: number;
  activeSessions: number;
  twoFactorAdoption: number;
  securityEvents24h: number;
  suspiciousActivities: number;
}

export interface MaintenanceStats {
  lastBackup: string;
  backupSuccessRate: number;
  totalBackupSize: string;
  drPlansVerified: number;
  drPlansTotal: number;
  nextScheduledBackup: string;
  failedBackups: number;
}

export interface SupportStats {
  openTickets: number;
  inProgressTickets: number;
  avgResponseTime: string;
  avgResolutionTime: string;
  satisfactionRate: number;
  resolvedThisWeek: number;
}

export interface ReportsStats {
  totalReports: number;
  generatedThisMonth: number;
  scheduledReports: number;
  failedReports: number;
}
