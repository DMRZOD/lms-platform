// --- Status / Enum Types ---

export type ServiceStatus = "Healthy" | "Degraded" | "Down" | "Maintenance";
export type AlertSeverity = "critical" | "high" | "medium" | "low" | "info";
export type IncidentStatus =
  | "Open"
  | "Investigating"
  | "Mitigated"
  | "Resolved"
  | "Closed";
export type IncidentSeverity = "P1" | "P2" | "P3" | "P4";
export type IntegrationStatus =
  | "Connected"
  | "Disconnected"
  | "Error"
  | "Syncing";
export type BackupStatus =
  | "Completed"
  | "Running"
  | "Failed"
  | "Scheduled"
  | "Skipped";
export type BackupType = "Full" | "Incremental" | "Differential";
export type CertificateStatus = "Valid" | "ExpiringSoon" | "Expired";
export type ComplianceStatus =
  | "Compliant"
  | "PartiallyCompliant"
  | "NonCompliant"
  | "InReview";
export type MaintenanceStatus =
  | "Scheduled"
  | "InProgress"
  | "Completed"
  | "Cancelled";
export type AccessRequestStatus =
  | "Pending"
  | "Approved"
  | "Denied"
  | "Expired";
export type ReportStatus = "Ready" | "Generating" | "Failed" | "Scheduled";
export type ReportType =
  | "SLA"
  | "Uptime"
  | "Performance"
  | "Security"
  | "Capacity";
export type VulnerabilitySeverity =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Info";
export type SSHKeyStatus = "Active" | "Expired" | "Revoked";
export type ChangeRequestStatus =
  | "Pending"
  | "Approved"
  | "InProgress"
  | "Completed"
  | "Rejected";
export type ChangeRequestPriority = "Critical" | "High" | "Medium" | "Low";

// --- Dashboard ---

export type ItOpsDashboardStats = {
  uptime: string;
  avgResponseTime: string;
  errorRate: string;
  activeAlerts: number;
  openIncidents: number;
  pendingDeployments: number;
};

// --- Monitoring ---

export type ItOpsService = {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: number;
  responseTime: number;
  lastChecked: string;
  cpuUsage: number;
  memoryUsage: number;
  errorRate: number;
  endpoint: string;
};

export type ItOpsAlert = {
  id: string;
  title: string;
  severity: AlertSeverity;
  service: string;
  timestamp: string;
  acknowledged: boolean;
  resolvedAt: string | null;
  description: string;
};

export type AlertRule = {
  id: string;
  name: string;
  condition: string;
  threshold: string;
  severity: AlertSeverity;
  enabled: boolean;
  lastTriggered: string | null;
};

export type UptimeRecord = {
  id: string;
  service: string;
  date: string;
  uptimePercent: number;
  downtime: string;
  incidents: number;
};

export type MonitoringStats = {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIO: string;
  activeAlerts: number;
  uptimePercent: number;
};

// --- Integrations ---

export type ItOpsIntegration = {
  id: string;
  name: string;
  type: string;
  status: IntegrationStatus;
  lastSync: string;
  syncFrequency: string;
  errorCount: number;
  recordsSynced: number;
  endpoint: string;
  description: string;
};

export type ItOpsSyncEvent = {
  id: string;
  integrationId: string;
  integrationName: string;
  timestamp: string;
  status: "Success" | "Failed" | "Partial";
  recordsProcessed: number;
  errors: number;
  duration: string;
};

export type IntegrationStats = {
  totalIntegrations: number;
  connected: number;
  errored: number;
  totalSyncsToday: number;
  failedSyncsToday: number;
  avgSyncDuration: string;
};

// --- Incidents ---

export type IncidentTimelineEvent = {
  timestamp: string;
  action: string;
  actor: string;
};

export type ItOpsIncident = {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  affectedServices: string[];
  timeline: IncidentTimelineEvent[];
};

export type IncidentStats = {
  openIncidents: number;
  mttrMinutes: number;
  mttaMinutes: number;
  resolvedThisWeek: number;
  p1Count: number;
  p2Count: number;
};

// --- Security ---

export type FirewallRule = {
  id: string;
  name: string;
  source: string;
  destination: string;
  port: string;
  protocol: string;
  action: "Allow" | "Deny";
  enabled: boolean;
};

export type SSLCertificate = {
  id: string;
  domain: string;
  issuer: string;
  issuedAt: string;
  expiresAt: string;
  status: CertificateStatus;
  autoRenew: boolean;
};

export type VulnerabilityScan = {
  id: string;
  target: string;
  timestamp: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  status: "Completed" | "Running" | "Failed";
};

export type SecurityEvent = {
  id: string;
  type: string;
  timestamp: string;
  sourceIP: string;
  details: string;
  severity: AlertSeverity;
};

export type SecurityPageStats = {
  firewallRules: number;
  sslCertificates: number;
  vulnerabilities: number;
  failedLogins24h: number;
  blockedIPs: number;
  securityEvents24h: number;
};

// --- Backups ---

export type ItOpsBackup = {
  id: string;
  name: string;
  type: BackupType;
  status: BackupStatus;
  startedAt: string;
  completedAt: string | null;
  size: string;
  location: string;
  retentionDays: number;
};

export type ItOpsDRPlan = {
  id: string;
  name: string;
  lastTested: string;
  rtoMinutes: number;
  rpoMinutes: number;
  status: "Verified" | "Untested" | "Failed";
};

export type ItOpsRestoreTest = {
  id: string;
  backupId: string;
  backupName: string;
  testedAt: string;
  result: "Success" | "Failed" | "Partial";
  duration: string;
  testedBy: string;
};

export type BackupStats = {
  lastBackup: string;
  successRate: string;
  totalSize: string;
  drPlansVerified: number;
  drPlansTotal: number;
  nextScheduled: string;
};

// --- Performance ---

export type PerformanceMetric = {
  id: string;
  endpoint: string;
  method: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  throughput: number;
  errorRate: number;
};

export type SlowQuery = {
  id: string;
  query: string;
  avgDuration: number;
  executions: number;
  lastExecuted: string;
  database: string;
};

export type CDNMetric = {
  id: string;
  region: string;
  cacheHitRatio: number;
  bandwidth: string;
  requests: number;
  latency: number;
};

export type PerformanceRecommendation = {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  category: string;
};

export type PerformanceStats = {
  avgPageLoad: string;
  avgApiResponse: string;
  cacheHitRatio: string;
  slowQueries: number;
  errorRate: string;
  throughput: string;
};

// --- Access ---

export type SSHKey = {
  id: string;
  name: string;
  user: string;
  fingerprint: string;
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  status: SSHKeyStatus;
};

export type ServerAccess = {
  id: string;
  serverName: string;
  userName: string;
  role: string;
  grantedAt: string;
  grantedBy: string;
  expiresAt: string | null;
};

export type AccessRequest = {
  id: string;
  requester: string;
  serverName: string;
  reason: string;
  status: AccessRequestStatus;
  requestedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
};

export type ServiceAccount = {
  id: string;
  name: string;
  service: string;
  createdAt: string;
  lastUsed: string | null;
  keyRotatedAt: string;
  permissions: string[];
};

export type AccessStats = {
  totalSSHKeys: number;
  activeServers: number;
  pendingRequests: number;
  serviceAccounts: number;
  expiringSoon: number;
  recentAccesses: number;
};

// --- Compliance ---

export type ComplianceFramework = {
  id: string;
  name: string;
  status: ComplianceStatus;
  controlsTotal: number;
  controlsPassed: number;
  controlsFailed: number;
  lastAudit: string;
  nextAudit: string;
};

export type AuditLogEntry = {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  category: string;
  details: string;
};

export type PolicyViolation = {
  id: string;
  policy: string;
  violatedBy: string;
  detectedAt: string;
  severity: AlertSeverity;
  status: "Open" | "Resolved" | "Accepted";
  resolution: string | null;
};

export type ComplianceStats = {
  frameworksTotal: number;
  compliant: number;
  violations: number;
  pendingAudits: number;
  controlsTotal: number;
  controlsPassed: number;
};

// --- Capacity ---

export type CapacityResource = {
  id: string;
  name: string;
  type: string;
  currentUsage: number;
  limit: number;
  unit: string;
  trend: "Up" | "Down" | "Stable";
  forecastedFullDate: string | null;
};

export type CostEntry = {
  id: string;
  resource: string;
  monthlyCost: number;
  trend: "Up" | "Down" | "Stable";
  category: string;
};

export type InfraItem = {
  id: string;
  name: string;
  type: string;
  specs: string;
  location: string;
  status: "Active" | "Inactive" | "Decommissioned";
  addedAt: string;
};

export type ScalingRecommendation = {
  id: string;
  resource: string;
  recommendation: string;
  urgency: "Immediate" | "Soon" | "Planned";
  estimatedCost: string;
};

export type CapacityStats = {
  cpuUtilization: number;
  memoryUtilization: number;
  storageUtilization: number;
  activeUsers: number;
  projectedFullDate: string;
  monthlyGrowthPercent: number;
};

// --- Maintenance ---

export type MaintenanceWindow = {
  id: string;
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: MaintenanceStatus;
  affectedServices: string[];
  type: "Planned" | "Emergency" | "Routine";
  createdBy: string;
};

export type PatchStatus = {
  id: string;
  systemName: string;
  currentVersion: string;
  latestVersion: string;
  patchDate: string | null;
  status: "UpToDate" | "PatchAvailable" | "PatchPending" | "Failed";
};

export type ChangeRequest = {
  id: string;
  title: string;
  requester: string;
  status: ChangeRequestStatus;
  priority: ChangeRequestPriority;
  createdAt: string;
  scheduledFor: string | null;
};

export type ServiceRestart = {
  id: string;
  serviceName: string;
  restartedAt: string;
  reason: string;
  restartedBy: string;
  downtime: string;
};

export type MaintenanceStats = {
  scheduledWindows: number;
  completedThisMonth: number;
  pendingPatches: number;
  changeRequests: number;
  avgDowntimeMinutes: number;
  nextWindow: string;
};

// --- Reports ---

export type TechReport = {
  id: string;
  type: ReportType;
  title: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  format: "PDF" | "CSV" | "XLSX";
  fileSize: string;
  status: ReportStatus;
};

export type ReportSchedule = {
  id: string;
  name: string;
  type: ReportType;
  frequency: "Daily" | "Weekly" | "Monthly";
  nextRun: string;
  lastRun: string | null;
  recipients: string[];
};

export type ReportsStats = {
  totalReports: number;
  generatedThisMonth: number;
  scheduledReports: number;
  slaCompliance: string;
};

// --- Settings ---

export type NotificationChannel = {
  id: string;
  name: string;
  type: "Email" | "Slack" | "Teams" | "SMS" | "Webhook";
  endpoint: string;
  enabled: boolean;
  events: string[];
};

export type OnCallEntry = {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  phone: string;
  email: string;
};

export type EscalationLevel = {
  level: number;
  contact: string;
  delayMinutes: number;
};

export type EscalationPolicy = {
  id: string;
  name: string;
  levels: EscalationLevel[];
};

export type BackupRetentionPolicy = {
  id: string;
  name: string;
  backupType: BackupType;
  retentionDays: number;
  storageLocation: string;
  enabled: boolean;
};

export type AlertThreshold = {
  id: string;
  metric: string;
  warning: number;
  critical: number;
  unit: string;
};

export type SettingsStats = {
  notificationChannels: number;
  activeAlertRules: number;
  backupPolicies: number;
  onCallMembers: number;
};
