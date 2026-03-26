import type {
  AccessRequest,
  AlertRule,
  AlertThreshold,
  AuditLogEntry,
  BackupRetentionPolicy,
  CapacityResource,
  CapacityStats,
  ChangeRequest,
  CDNMetric,
  ComplianceFramework,
  ComplianceStats,
  CostEntry,
  EscalationPolicy,
  FirewallRule,
  InfraItem,
  IncidentStats,
  IntegrationStats,
  ItOpsAlert,
  ItOpsBackup,
  ItOpsDRPlan,
  ItOpsDashboardStats,
  ItOpsIncident,
  ItOpsIntegration,
  ItOpsRestoreTest,
  ItOpsService,
  ItOpsSyncEvent,
  MaintenanceStats,
  MaintenanceWindow,
  MonitoringStats,
  NotificationChannel,
  OnCallEntry,
  PatchStatus,
  PerformanceMetric,
  PerformanceRecommendation,
  PerformanceStats,
  PolicyViolation,
  ReportSchedule,
  ReportsStats,
  SSHKey,
  SSLCertificate,
  ScalingRecommendation,
  SecurityEvent,
  SecurityPageStats,
  ServerAccess,
  ServiceAccount,
  ServiceRestart,
  SettingsStats,
  SlowQuery,
  AccessStats,
  BackupStats,
  TechReport,
  UptimeRecord,
  VulnerabilityScan,
} from "@/types/it-ops";

// --- Dashboard Stats ---

export const mockItOpsDashboardStats: ItOpsDashboardStats = {
  uptime: "99.87%",
  avgResponseTime: "142ms",
  errorRate: "0.23%",
  activeAlerts: 3,
  openIncidents: 1,
  pendingDeployments: 2,
};

// --- Services ---

export const mockItOpsServices: ItOpsService[] = [
  {
    id: "svc-001",
    name: "LMS Core",
    status: "Healthy",
    uptime: 99.97,
    responseTime: 118,
    lastChecked: "2026-03-26T10:45:00Z",
    cpuUsage: 34,
    memoryUsage: 61,
    errorRate: 0.1,
    endpoint: "https://lms.university.edu/api/health",
  },
  {
    id: "svc-002",
    name: "Auth Service",
    status: "Healthy",
    uptime: 99.99,
    responseTime: 45,
    lastChecked: "2026-03-26T10:45:00Z",
    cpuUsage: 12,
    memoryUsage: 28,
    errorRate: 0.0,
    endpoint: "https://auth.university.edu/health",
  },
  {
    id: "svc-003",
    name: "Storage Service",
    status: "Degraded",
    uptime: 99.41,
    responseTime: 380,
    lastChecked: "2026-03-26T10:45:00Z",
    cpuUsage: 71,
    memoryUsage: 84,
    errorRate: 1.2,
    endpoint: "https://storage.university.edu/health",
  },
  {
    id: "svc-004",
    name: "Messaging Service",
    status: "Healthy",
    uptime: 99.95,
    responseTime: 67,
    lastChecked: "2026-03-26T10:45:00Z",
    cpuUsage: 22,
    memoryUsage: 41,
    errorRate: 0.05,
    endpoint: "https://messaging.university.edu/health",
  },
  {
    id: "svc-005",
    name: "Video Streaming",
    status: "Healthy",
    uptime: 99.78,
    responseTime: 210,
    lastChecked: "2026-03-26T10:45:00Z",
    cpuUsage: 58,
    memoryUsage: 72,
    errorRate: 0.3,
    endpoint: "https://video.university.edu/health",
  },
  {
    id: "svc-006",
    name: "API Gateway",
    status: "Healthy",
    uptime: 99.99,
    responseTime: 28,
    lastChecked: "2026-03-26T10:45:00Z",
    cpuUsage: 18,
    memoryUsage: 35,
    errorRate: 0.02,
    endpoint: "https://api.university.edu/health",
  },
  {
    id: "svc-007",
    name: "Notification Service",
    status: "Down",
    uptime: 97.12,
    responseTime: 0,
    lastChecked: "2026-03-26T10:45:00Z",
    cpuUsage: 0,
    memoryUsage: 0,
    errorRate: 100,
    endpoint: "https://notifications.university.edu/health",
  },
  {
    id: "svc-008",
    name: "Report Engine",
    status: "Maintenance",
    uptime: 98.9,
    responseTime: 0,
    lastChecked: "2026-03-26T10:45:00Z",
    cpuUsage: 0,
    memoryUsage: 0,
    errorRate: 0,
    endpoint: "https://reports.university.edu/health",
  },
];

// --- Alerts ---

export const mockItOpsAlerts: ItOpsAlert[] = [
  {
    id: "alert-001",
    title: "Storage Service high memory usage",
    severity: "high",
    service: "Storage Service",
    timestamp: "2026-03-26T09:32:00Z",
    acknowledged: false,
    resolvedAt: null,
    description: "Memory usage exceeded 80% threshold on storage node 3.",
  },
  {
    id: "alert-002",
    title: "Notification Service is down",
    severity: "critical",
    service: "Notification Service",
    timestamp: "2026-03-26T08:15:00Z",
    acknowledged: true,
    resolvedAt: null,
    description: "Health check failed for the notification microservice.",
  },
  {
    id: "alert-003",
    title: "Video Streaming CPU spike",
    severity: "medium",
    service: "Video Streaming",
    timestamp: "2026-03-26T10:10:00Z",
    acknowledged: false,
    resolvedAt: null,
    description: "CPU usage reached 85% during peak lecture hours.",
  },
  {
    id: "alert-004",
    title: "API Gateway response time elevated",
    severity: "low",
    service: "API Gateway",
    timestamp: "2026-03-26T07:55:00Z",
    acknowledged: true,
    resolvedAt: "2026-03-26T08:30:00Z",
    description: "Average response time exceeded 50ms for 10 minutes.",
  },
  {
    id: "alert-005",
    title: "Database connection pool near limit",
    severity: "high",
    service: "LMS Core",
    timestamp: "2026-03-25T22:45:00Z",
    acknowledged: true,
    resolvedAt: "2026-03-25T23:10:00Z",
    description: "Connection pool utilization reached 92% of maximum capacity.",
  },
];

// --- Alert Rules ---

export const mockAlertRules: AlertRule[] = [
  {
    id: "rule-001",
    name: "High CPU Usage",
    condition: "cpu_usage > threshold",
    threshold: "80%",
    severity: "high",
    enabled: true,
    lastTriggered: "2026-03-26T10:10:00Z",
  },
  {
    id: "rule-002",
    name: "Memory Pressure",
    condition: "memory_usage > threshold",
    threshold: "85%",
    severity: "high",
    enabled: true,
    lastTriggered: "2026-03-26T09:32:00Z",
  },
  {
    id: "rule-003",
    name: "Service Down",
    condition: "health_check_failed",
    threshold: "3 consecutive",
    severity: "critical",
    enabled: true,
    lastTriggered: "2026-03-26T08:15:00Z",
  },
  {
    id: "rule-004",
    name: "Slow Response Time",
    condition: "avg_response_time > threshold",
    threshold: "500ms",
    severity: "medium",
    enabled: true,
    lastTriggered: "2026-03-25T14:20:00Z",
  },
  {
    id: "rule-005",
    name: "Error Rate Spike",
    condition: "error_rate > threshold",
    threshold: "2%",
    severity: "high",
    enabled: true,
    lastTriggered: null,
  },
  {
    id: "rule-006",
    name: "Disk Usage High",
    condition: "disk_usage > threshold",
    threshold: "90%",
    severity: "critical",
    enabled: true,
    lastTriggered: "2026-03-20T11:00:00Z",
  },
];

// --- Uptime Records ---

export const mockUptimeRecords: UptimeRecord[] = [
  { id: "upt-001", service: "LMS Core", date: "2026-03-25", uptimePercent: 100, downtime: "0m", incidents: 0 },
  { id: "upt-002", service: "Auth Service", date: "2026-03-25", uptimePercent: 100, downtime: "0m", incidents: 0 },
  { id: "upt-003", service: "Storage Service", date: "2026-03-25", uptimePercent: 99.2, downtime: "6m", incidents: 1 },
  { id: "upt-004", service: "Video Streaming", date: "2026-03-25", uptimePercent: 99.8, downtime: "3m", incidents: 0 },
  { id: "upt-005", service: "Notification Service", date: "2026-03-25", uptimePercent: 95.1, downtime: "71m", incidents: 2 },
];

// --- Monitoring Stats ---

export const mockMonitoringStats: MonitoringStats = {
  cpuUsage: 42,
  memoryUsage: 61,
  diskUsage: 73,
  networkIO: "1.2 GB/s",
  activeAlerts: 3,
  uptimePercent: 99.87,
};

// --- Integrations ---

export const mockItOpsIntegrations: ItOpsIntegration[] = [
  {
    id: "int-001",
    name: "Microsoft Teams",
    type: "Communication",
    status: "Connected",
    lastSync: "2026-03-26T10:30:00Z",
    syncFrequency: "Real-time",
    errorCount: 0,
    recordsSynced: 15420,
    endpoint: "https://graph.microsoft.com/v1.0",
    description: "LMS notifications and virtual class links via Teams.",
  },
  {
    id: "int-002",
    name: "1C Accounting",
    type: "Finance",
    status: "Connected",
    lastSync: "2026-03-26T06:00:00Z",
    syncFrequency: "Every 6 hours",
    errorCount: 2,
    recordsSynced: 8930,
    endpoint: "https://1c.university.edu/api",
    description: "Student payment and contract synchronization.",
  },
  {
    id: "int-003",
    name: "aSc Timetables",
    type: "Scheduling",
    status: "Syncing",
    lastSync: "2026-03-26T10:00:00Z",
    syncFrequency: "Daily",
    errorCount: 0,
    recordsSynced: 4210,
    endpoint: "https://asc.university.edu/api",
    description: "Academic schedule and room booking import.",
  },
  {
    id: "int-004",
    name: "Classmate",
    type: "Academic",
    status: "Error",
    lastSync: "2026-03-25T18:00:00Z",
    syncFrequency: "Every 3 hours",
    errorCount: 14,
    recordsSynced: 0,
    endpoint: "https://classmate.university.edu/api",
    description: "Grade and attendance data exchange.",
  },
  {
    id: "int-005",
    name: "SMTP Email",
    type: "Notification",
    status: "Connected",
    lastSync: "2026-03-26T10:44:00Z",
    syncFrequency: "Real-time",
    errorCount: 1,
    recordsSynced: 42100,
    endpoint: "smtp.university.edu:587",
    description: "Transactional email delivery for all platform notifications.",
  },
  {
    id: "int-006",
    name: "SMS Gateway",
    type: "Notification",
    status: "Disconnected",
    lastSync: "2026-03-24T12:00:00Z",
    syncFrequency: "Real-time",
    errorCount: 0,
    recordsSynced: 0,
    endpoint: "https://sms.provider.com/api",
    description: "SMS alerts for critical incidents and payment reminders.",
  },
];

export const mockItOpsSyncEvents: ItOpsSyncEvent[] = [
  { id: "sync-001", integrationId: "int-001", integrationName: "Microsoft Teams", timestamp: "2026-03-26T10:30:00Z", status: "Success", recordsProcessed: 42, errors: 0, duration: "1.2s" },
  { id: "sync-002", integrationId: "int-002", integrationName: "1C Accounting", timestamp: "2026-03-26T06:00:00Z", status: "Partial", recordsProcessed: 890, errors: 2, duration: "45s" },
  { id: "sync-003", integrationId: "int-003", integrationName: "aSc Timetables", timestamp: "2026-03-26T10:00:00Z", status: "Success", recordsProcessed: 214, errors: 0, duration: "8.4s" },
  { id: "sync-004", integrationId: "int-004", integrationName: "Classmate", timestamp: "2026-03-25T18:00:00Z", status: "Failed", recordsProcessed: 0, errors: 14, duration: "3s" },
  { id: "sync-005", integrationId: "int-005", integrationName: "SMTP Email", timestamp: "2026-03-26T10:44:00Z", status: "Success", recordsProcessed: 128, errors: 1, duration: "0.8s" },
  { id: "sync-006", integrationId: "int-002", integrationName: "1C Accounting", timestamp: "2026-03-26T00:00:00Z", status: "Success", recordsProcessed: 760, errors: 0, duration: "38s" },
];

export const mockIntegrationStats: IntegrationStats = {
  totalIntegrations: 6,
  connected: 3,
  errored: 1,
  totalSyncsToday: 18,
  failedSyncsToday: 2,
  avgSyncDuration: "9.4s",
};

// --- Incidents ---

export const mockItOpsIncidents: ItOpsIncident[] = [
  {
    id: "inc-001",
    title: "Notification Service complete outage",
    description: "The notification microservice stopped responding to health checks and is not processing any events.",
    severity: "P2",
    status: "Investigating",
    assignee: "Rustam Nazarov",
    createdAt: "2026-03-26T08:15:00Z",
    updatedAt: "2026-03-26T09:45:00Z",
    resolvedAt: null,
    affectedServices: ["Notification Service", "Messaging Service"],
    timeline: [
      { timestamp: "2026-03-26T08:15:00Z", action: "Incident created automatically by monitoring", actor: "System" },
      { timestamp: "2026-03-26T08:22:00Z", action: "Assigned to Rustam Nazarov", actor: "Dilnoza Yusupova" },
      { timestamp: "2026-03-26T09:00:00Z", action: "Root cause identified: OOM kill on container restart", actor: "Rustam Nazarov" },
      { timestamp: "2026-03-26T09:45:00Z", action: "Fix deployed to staging, monitoring production", actor: "Rustam Nazarov" },
    ],
  },
  {
    id: "inc-002",
    title: "Storage Service degraded performance",
    description: "Storage service is responding slowly with latency above 300ms. Disk I/O saturation detected.",
    severity: "P3",
    status: "Mitigated",
    assignee: "Amir Tashkentov",
    createdAt: "2026-03-26T09:10:00Z",
    updatedAt: "2026-03-26T10:30:00Z",
    resolvedAt: null,
    affectedServices: ["Storage Service"],
    timeline: [
      { timestamp: "2026-03-26T09:10:00Z", action: "Incident created", actor: "Dilnoza Yusupova" },
      { timestamp: "2026-03-26T09:25:00Z", action: "Disk cleanup initiated, freeing 40GB", actor: "Amir Tashkentov" },
      { timestamp: "2026-03-26T10:30:00Z", action: "Latency reduced to 380ms. Still above SLA, monitoring", actor: "Amir Tashkentov" },
    ],
  },
  {
    id: "inc-003",
    title: "Classmate integration sync failure",
    description: "Classmate API returning 503 errors. Grade and attendance sync has been failing for 16 hours.",
    severity: "P3",
    status: "Open",
    assignee: "Nodira Karimova",
    createdAt: "2026-03-25T18:00:00Z",
    updatedAt: "2026-03-26T08:00:00Z",
    resolvedAt: null,
    affectedServices: ["Classmate"],
    timeline: [
      { timestamp: "2026-03-25T18:00:00Z", action: "Alert triggered: integration sync failing", actor: "System" },
      { timestamp: "2026-03-25T18:30:00Z", action: "Confirmed API-side issue with Classmate vendor", actor: "Nodira Karimova" },
      { timestamp: "2026-03-26T08:00:00Z", action: "Vendor ticket escalated to P1", actor: "Nodira Karimova" },
    ],
  },
  {
    id: "inc-004",
    title: "Database connection pool exhaustion",
    description: "LMS Core DB connection pool reached 92% capacity during evening peak hours causing query timeouts.",
    severity: "P2",
    status: "Resolved",
    assignee: "Rustam Nazarov",
    createdAt: "2026-03-25T22:45:00Z",
    updatedAt: "2026-03-25T23:30:00Z",
    resolvedAt: "2026-03-25T23:10:00Z",
    affectedServices: ["LMS Core"],
    timeline: [
      { timestamp: "2026-03-25T22:45:00Z", action: "Alert triggered: connection pool at 92%", actor: "System" },
      { timestamp: "2026-03-25T22:50:00Z", action: "Pool size increased from 100 to 150 connections", actor: "Rustam Nazarov" },
      { timestamp: "2026-03-25T23:10:00Z", action: "Pool utilization dropped to 58%. Incident resolved", actor: "Rustam Nazarov" },
    ],
  },
  {
    id: "inc-005",
    title: "API Gateway certificate renewal failure",
    description: "Automated SSL certificate renewal failed for api.university.edu. Certificate expires in 12 days.",
    severity: "P4",
    status: "Closed",
    assignee: "Amir Tashkentov",
    createdAt: "2026-03-20T09:00:00Z",
    updatedAt: "2026-03-21T11:00:00Z",
    resolvedAt: "2026-03-21T11:00:00Z",
    affectedServices: ["API Gateway"],
    timeline: [
      { timestamp: "2026-03-20T09:00:00Z", action: "Alert: auto-renewal failed", actor: "System" },
      { timestamp: "2026-03-21T10:30:00Z", action: "DNS validation issue identified and fixed", actor: "Amir Tashkentov" },
      { timestamp: "2026-03-21T11:00:00Z", action: "Certificate renewed successfully, valid 90 days", actor: "Amir Tashkentov" },
    ],
  },
];

export const mockIncidentStats: IncidentStats = {
  openIncidents: 3,
  mttrMinutes: 48,
  mttaMinutes: 12,
  resolvedThisWeek: 4,
  p1Count: 0,
  p2Count: 2,
};

// --- Security ---

export const mockFirewallRules: FirewallRule[] = [
  { id: "fw-001", name: "Allow HTTPS Inbound", source: "0.0.0.0/0", destination: "LMS Core", port: "443", protocol: "TCP", action: "Allow", enabled: true },
  { id: "fw-002", name: "Allow HTTP Inbound", source: "0.0.0.0/0", destination: "LMS Core", port: "80", protocol: "TCP", action: "Allow", enabled: true },
  { id: "fw-003", name: "Block Telnet", source: "0.0.0.0/0", destination: "All", port: "23", protocol: "TCP", action: "Deny", enabled: true },
  { id: "fw-004", name: "Allow SSH from VPN", source: "10.0.0.0/8", destination: "All servers", port: "22", protocol: "TCP", action: "Allow", enabled: true },
  { id: "fw-005", name: "Block External DB Access", source: "0.0.0.0/0", destination: "Database Cluster", port: "5432", protocol: "TCP", action: "Deny", enabled: true },
  { id: "fw-006", name: "Allow Internal APIs", source: "10.0.0.0/8", destination: "API Gateway", port: "8080", protocol: "TCP", action: "Allow", enabled: true },
];

export const mockSSLCertificates: SSLCertificate[] = [
  { id: "ssl-001", domain: "lms.university.edu", issuer: "Let's Encrypt", issuedAt: "2026-01-15", expiresAt: "2026-04-15", status: "ExpiringSoon", autoRenew: true },
  { id: "ssl-002", domain: "auth.university.edu", issuer: "Let's Encrypt", issuedAt: "2026-02-01", expiresAt: "2026-05-01", status: "Valid", autoRenew: true },
  { id: "ssl-003", domain: "api.university.edu", issuer: "Let's Encrypt", issuedAt: "2026-03-21", expiresAt: "2026-06-21", status: "Valid", autoRenew: true },
  { id: "ssl-004", domain: "storage.university.edu", issuer: "DigiCert", issuedAt: "2025-09-01", expiresAt: "2026-09-01", status: "Valid", autoRenew: false },
  { id: "ssl-005", domain: "video.university.edu", issuer: "Let's Encrypt", issuedAt: "2025-12-10", expiresAt: "2026-03-10", status: "Expired", autoRenew: false },
];

export const mockVulnerabilityScans: VulnerabilityScan[] = [
  { id: "vscan-001", target: "LMS Core", timestamp: "2026-03-25T02:00:00Z", critical: 0, high: 1, medium: 3, low: 7, info: 12, status: "Completed" },
  { id: "vscan-002", target: "Auth Service", timestamp: "2026-03-25T02:30:00Z", critical: 0, high: 0, medium: 1, low: 2, info: 8, status: "Completed" },
  { id: "vscan-003", target: "Storage Service", timestamp: "2026-03-25T03:00:00Z", critical: 1, high: 2, medium: 4, low: 9, info: 15, status: "Completed" },
  { id: "vscan-004", target: "API Gateway", timestamp: "2026-03-25T03:30:00Z", critical: 0, high: 0, medium: 2, low: 5, info: 10, status: "Completed" },
  { id: "vscan-005", target: "Video Streaming", timestamp: "2026-03-26T02:00:00Z", critical: 0, high: 1, medium: 2, low: 4, info: 6, status: "Running" },
];

export const mockSecurityEvents: SecurityEvent[] = [
  { id: "se-001", type: "Failed Login", timestamp: "2026-03-26T10:22:00Z", sourceIP: "185.220.101.45", details: "5 consecutive failed login attempts for user admin@university.edu", severity: "medium" },
  { id: "se-002", type: "Brute Force Detected", timestamp: "2026-03-26T09:55:00Z", sourceIP: "192.168.1.105", details: "120 requests/min to /auth/login endpoint. IP blocked.", severity: "high" },
  { id: "se-003", type: "Suspicious API Access", timestamp: "2026-03-26T08:30:00Z", sourceIP: "203.0.113.42", details: "Unusual access pattern: 500 requests to /api/users in 2 minutes.", severity: "high" },
  { id: "se-004", type: "Certificate Expiry Warning", timestamp: "2026-03-26T00:00:00Z", sourceIP: "internal", details: "lms.university.edu certificate expires in 20 days.", severity: "medium" },
  { id: "se-005", type: "Failed SSH Login", timestamp: "2026-03-25T23:41:00Z", sourceIP: "45.33.32.156", details: "Failed SSH login attempt on server prod-db-01.", severity: "low" },
  { id: "se-006", type: "Config Change", timestamp: "2026-03-25T16:00:00Z", sourceIP: "10.0.0.5", details: "Firewall rule added: allow TCP 8080 from 10.0.0.0/8.", severity: "info" },
];

export const mockSecurityStats: SecurityPageStats = {
  firewallRules: 6,
  sslCertificates: 5,
  vulnerabilities: 4,
  failedLogins24h: 23,
  blockedIPs: 3,
  securityEvents24h: 6,
};

// --- Backups ---

export const mockItOpsBackups: ItOpsBackup[] = [
  { id: "bk-001", name: "LMS Core DB — Full", type: "Full", status: "Completed", startedAt: "2026-03-26T01:00:00Z", completedAt: "2026-03-26T01:48:00Z", size: "18.4 GB", location: "s3://university-backups/lms-core/", retentionDays: 30 },
  { id: "bk-002", name: "Auth DB — Incremental", type: "Incremental", status: "Completed", startedAt: "2026-03-26T02:00:00Z", completedAt: "2026-03-26T02:08:00Z", size: "1.2 GB", location: "s3://university-backups/auth/", retentionDays: 7 },
  { id: "bk-003", name: "Storage Files — Full", type: "Full", status: "Completed", startedAt: "2026-03-25T23:00:00Z", completedAt: "2026-03-26T02:15:00Z", size: "420 GB", location: "s3://university-backups/storage/", retentionDays: 60 },
  { id: "bk-004", name: "LMS Core DB — Incremental", type: "Incremental", status: "Scheduled", startedAt: "2026-03-26T13:00:00Z", completedAt: null, size: "—", location: "s3://university-backups/lms-core/", retentionDays: 7 },
  { id: "bk-005", name: "Config Backup", type: "Full", status: "Completed", startedAt: "2026-03-26T00:30:00Z", completedAt: "2026-03-26T00:33:00Z", size: "240 MB", location: "s3://university-backups/configs/", retentionDays: 90 },
  { id: "bk-006", name: "Messaging DB — Differential", type: "Differential", status: "Failed", startedAt: "2026-03-25T03:00:00Z", completedAt: "2026-03-25T03:02:00Z", size: "0 B", location: "s3://university-backups/messaging/", retentionDays: 14 },
];

export const mockItOpsDRPlans: ItOpsDRPlan[] = [
  { id: "dr-001", name: "LMS Core Full Recovery", lastTested: "2026-03-01", rtoMinutes: 120, rpoMinutes: 60, status: "Verified" },
  { id: "dr-002", name: "Auth Service Recovery", lastTested: "2026-02-15", rtoMinutes: 30, rpoMinutes: 15, status: "Verified" },
  { id: "dr-003", name: "Storage Service Recovery", lastTested: "2026-01-10", rtoMinutes: 240, rpoMinutes: 60, status: "Untested" },
  { id: "dr-004", name: "Complete Platform DR", lastTested: "2025-12-01", rtoMinutes: 480, rpoMinutes: 120, status: "Failed" },
];

export const mockRestoreTests: ItOpsRestoreTest[] = [
  { id: "rt-001", backupId: "bk-001", backupName: "LMS Core DB — Full", testedAt: "2026-03-01T10:00:00Z", result: "Success", duration: "52m", testedBy: "Rustam Nazarov" },
  { id: "rt-002", backupId: "bk-003", backupName: "Storage Files — Full", testedAt: "2026-02-15T14:00:00Z", result: "Partial", duration: "3h 10m", testedBy: "Amir Tashkentov" },
  { id: "rt-003", backupId: "bk-002", backupName: "Auth DB — Incremental", testedAt: "2026-02-15T09:00:00Z", result: "Success", duration: "8m", testedBy: "Amir Tashkentov" },
];

export const mockBackupStats: BackupStats = {
  lastBackup: "2026-03-26T02:15:00Z",
  successRate: "94.2%",
  totalSize: "440 GB",
  drPlansVerified: 2,
  drPlansTotal: 4,
  nextScheduled: "2026-03-26T13:00:00Z",
};

// --- Performance ---

export const mockPerformanceMetrics: PerformanceMetric[] = [
  { id: "pm-001", endpoint: "GET /api/courses", method: "GET", avgResponseTime: 98, p95ResponseTime: 180, p99ResponseTime: 320, throughput: 1240, errorRate: 0.1 },
  { id: "pm-002", endpoint: "POST /api/auth/login", method: "POST", avgResponseTime: 145, p95ResponseTime: 280, p99ResponseTime: 510, throughput: 420, errorRate: 0.2 },
  { id: "pm-003", endpoint: "GET /api/lectures/:id", method: "GET", avgResponseTime: 210, p95ResponseTime: 480, p99ResponseTime: 820, throughput: 680, errorRate: 0.3 },
  { id: "pm-004", endpoint: "GET /api/grades", method: "GET", avgResponseTime: 340, p95ResponseTime: 720, p99ResponseTime: 1240, throughput: 380, errorRate: 0.5 },
  { id: "pm-005", endpoint: "POST /api/assignments/submit", method: "POST", avgResponseTime: 420, p95ResponseTime: 890, p99ResponseTime: 1600, throughput: 140, errorRate: 0.8 },
  { id: "pm-006", endpoint: "GET /api/users/profile", method: "GET", avgResponseTime: 65, p95ResponseTime: 120, p99ResponseTime: 200, throughput: 890, errorRate: 0.0 },
];

export const mockSlowQueries: SlowQuery[] = [
  { id: "sq-001", query: "SELECT * FROM courses JOIN enrollments ON ...", avgDuration: 1240, executions: 842, lastExecuted: "2026-03-26T10:38:00Z", database: "lms_core" },
  { id: "sq-002", query: "SELECT grade, attendance FROM students WHERE ...", avgDuration: 980, executions: 1240, lastExecuted: "2026-03-26T10:42:00Z", database: "lms_core" },
  { id: "sq-003", query: "UPDATE assignments SET status = ... WHERE deadline < NOW()", avgDuration: 760, executions: 48, lastExecuted: "2026-03-26T09:00:00Z", database: "lms_core" },
  { id: "sq-004", query: "SELECT f.* FROM files f JOIN storage_nodes s ON ...", avgDuration: 640, executions: 2100, lastExecuted: "2026-03-26T10:44:00Z", database: "storage" },
  { id: "sq-005", query: "SELECT COUNT(*) FROM audit_logs WHERE created_at > ...", avgDuration: 520, executions: 380, lastExecuted: "2026-03-26T10:15:00Z", database: "lms_core" },
];

export const mockCDNMetrics: CDNMetric[] = [
  { id: "cdn-001", region: "Central Asia", cacheHitRatio: 87.4, bandwidth: "12.4 GB", requests: 284000, latency: 18 },
  { id: "cdn-002", region: "Europe", cacheHitRatio: 91.2, bandwidth: "4.1 GB", requests: 82000, latency: 42 },
  { id: "cdn-003", region: "Russia", cacheHitRatio: 84.8, bandwidth: "8.7 GB", requests: 165000, latency: 28 },
];

export const mockPerformanceRecommendations: PerformanceRecommendation[] = [
  { id: "rec-001", title: "Add index to courses.enrollment_count", description: "Missing index on frequently queried column causing full table scans.", impact: "High", effort: "Low", category: "Database" },
  { id: "rec-002", title: "Enable Redis caching for /api/grades", description: "Grades endpoint is called 1200x/day with same data. Redis TTL of 5 min would reduce DB load by ~60%.", impact: "High", effort: "Medium", category: "Caching" },
  { id: "rec-003", title: "Implement connection pooling for Storage Service", description: "Storage service opens new DB connections per request. PgBouncer would reduce overhead.", impact: "Medium", effort: "Medium", category: "Database" },
  { id: "rec-004", title: "Upgrade Video Streaming to HLS adaptive bitrate", description: "Current implementation serves fixed bitrate causing buffering on slow connections.", impact: "Medium", effort: "High", category: "Application" },
  { id: "rec-005", title: "Increase CDN cache TTL for static assets", description: "Static assets TTL is 1 hour. Increasing to 7 days would improve cache hit ratio by ~8%.", impact: "Low", effort: "Low", category: "CDN" },
];

export const mockPerformanceStats: PerformanceStats = {
  avgPageLoad: "1.8s",
  avgApiResponse: "142ms",
  cacheHitRatio: "87.4%",
  slowQueries: 5,
  errorRate: "0.23%",
  throughput: "3,330 req/min",
};

// --- Access ---

export const mockSSHKeys: SSHKey[] = [
  { id: "key-001", name: "rustam-prod-key", user: "Rustam Nazarov", fingerprint: "SHA256:abc123def456", createdAt: "2025-10-01", lastUsed: "2026-03-26T09:15:00Z", expiresAt: "2027-10-01", status: "Active" },
  { id: "key-002", name: "amir-deploy-key", user: "Amir Tashkentov", fingerprint: "SHA256:xyz789ghi012", createdAt: "2025-11-15", lastUsed: "2026-03-25T14:30:00Z", expiresAt: "2026-11-15", status: "Active" },
  { id: "key-003", name: "nodira-backup-key", user: "Nodira Karimova", fingerprint: "SHA256:jkl345mno678", createdAt: "2025-09-01", lastUsed: "2026-03-10T08:00:00Z", expiresAt: "2026-04-01", status: "Active" },
  { id: "key-004", name: "dilnoza-old-key", user: "Dilnoza Yusupova", fingerprint: "SHA256:pqr901stu234", createdAt: "2024-06-01", lastUsed: "2025-12-01T11:00:00Z", expiresAt: "2026-01-01", status: "Expired" },
  { id: "key-005", name: "ci-deploy-key", user: "CI/CD Pipeline", fingerprint: "SHA256:vwx567yza890", createdAt: "2026-01-01", lastUsed: "2026-03-26T10:00:00Z", expiresAt: null, status: "Active" },
];

export const mockServerAccess: ServerAccess[] = [
  { id: "sa-001", serverName: "prod-app-01", userName: "Rustam Nazarov", role: "admin", grantedAt: "2025-10-01", grantedBy: "System", expiresAt: null },
  { id: "sa-002", serverName: "prod-db-01", userName: "Rustam Nazarov", role: "read-only", grantedAt: "2025-10-01", grantedBy: "System", expiresAt: null },
  { id: "sa-003", serverName: "prod-app-01", userName: "Amir Tashkentov", role: "deploy", grantedAt: "2025-11-15", grantedBy: "Rustam Nazarov", expiresAt: null },
  { id: "sa-004", serverName: "staging-app-01", userName: "Nodira Karimova", role: "admin", grantedAt: "2025-09-01", grantedBy: "System", expiresAt: "2026-09-01" },
  { id: "sa-005", serverName: "prod-storage-01", userName: "Amir Tashkentov", role: "admin", grantedAt: "2025-11-15", grantedBy: "Rustam Nazarov", expiresAt: null },
  { id: "sa-006", serverName: "prod-db-01", userName: "Nodira Karimova", role: "backup-operator", grantedAt: "2025-09-01", grantedBy: "Rustam Nazarov", expiresAt: null },
];

export const mockAccessRequests: AccessRequest[] = [
  { id: "ar-001", requester: "Kamola Mirzayeva", serverName: "prod-app-01", reason: "Debugging deployment issue with video module", status: "Pending", requestedAt: "2026-03-26T09:00:00Z", reviewedBy: null, reviewedAt: null },
  { id: "ar-002", requester: "Jasur Umarov", serverName: "staging-db-01", reason: "Performance testing new query optimizations", status: "Approved", requestedAt: "2026-03-25T14:00:00Z", reviewedBy: "Rustam Nazarov", reviewedAt: "2026-03-25T15:30:00Z" },
  { id: "ar-003", requester: "Sarvar Boymurodov", serverName: "prod-db-01", reason: "Need to run analytics query for monthly report", status: "Denied", requestedAt: "2026-03-24T10:00:00Z", reviewedBy: "Rustam Nazarov", reviewedAt: "2026-03-24T11:00:00Z" },
];

export const mockServiceAccounts: ServiceAccount[] = [
  { id: "svc-acc-001", name: "lms-core-db", service: "LMS Core", createdAt: "2025-01-01", lastUsed: "2026-03-26T10:45:00Z", keyRotatedAt: "2026-01-01", permissions: ["db:read", "db:write", "cache:read", "cache:write"] },
  { id: "svc-acc-002", name: "auth-service-db", service: "Auth Service", createdAt: "2025-01-01", lastUsed: "2026-03-26T10:44:00Z", keyRotatedAt: "2026-01-01", permissions: ["db:read", "db:write"] },
  { id: "svc-acc-003", name: "backup-agent", service: "Backup System", createdAt: "2025-03-01", lastUsed: "2026-03-26T02:15:00Z", keyRotatedAt: "2026-03-01", permissions: ["db:read", "storage:read", "s3:write"] },
  { id: "svc-acc-004", name: "monitoring-agent", service: "Monitoring", createdAt: "2025-01-01", lastUsed: "2026-03-26T10:45:00Z", keyRotatedAt: "2026-01-15", permissions: ["metrics:read", "logs:read"] },
];

export const mockAccessStats: AccessStats = {
  totalSSHKeys: 5,
  activeServers: 8,
  pendingRequests: 1,
  serviceAccounts: 4,
  expiringSoon: 2,
  recentAccesses: 14,
};

// --- Compliance ---

export const mockComplianceFrameworks: ComplianceFramework[] = [
  { id: "cf-001", name: "ISO 27001", status: "PartiallyCompliant", controlsTotal: 114, controlsPassed: 98, controlsFailed: 16, lastAudit: "2026-01-15", nextAudit: "2026-07-15" },
  { id: "cf-002", name: "GDPR", status: "Compliant", controlsTotal: 42, controlsPassed: 42, controlsFailed: 0, lastAudit: "2026-02-01", nextAudit: "2026-08-01" },
  { id: "cf-003", name: "SOC 2 Type II", status: "InReview", controlsTotal: 64, controlsPassed: 50, controlsFailed: 14, lastAudit: "2025-12-01", nextAudit: "2026-06-01" },
  { id: "cf-004", name: "PCI DSS", status: "NonCompliant", controlsTotal: 12, controlsPassed: 8, controlsFailed: 4, lastAudit: "2026-03-01", nextAudit: "2026-04-01" },
];

export const mockAuditLog: AuditLogEntry[] = [
  { id: "al-001", action: "Firewall rule added", actor: "Amir Tashkentov", target: "prod-fw-01", timestamp: "2026-03-25T16:00:00Z", category: "Network", details: "Added rule to allow TCP 8080 from internal network" },
  { id: "al-002", action: "SSH key created", actor: "Rustam Nazarov", target: "prod-app-01", timestamp: "2026-03-25T11:30:00Z", category: "Access", details: "New deploy key created for CI/CD pipeline" },
  { id: "al-003", action: "Backup policy updated", actor: "Nodira Karimova", target: "lms-core-db", timestamp: "2026-03-24T14:00:00Z", category: "Backup", details: "Retention period changed from 14 to 30 days" },
  { id: "al-004", action: "Service restarted", actor: "Rustam Nazarov", target: "Notification Service", timestamp: "2026-03-26T08:30:00Z", category: "Operations", details: "Container restarted due to OOM kill" },
  { id: "al-005", action: "User access granted", actor: "Rustam Nazarov", target: "Jasur Umarov", timestamp: "2026-03-25T15:30:00Z", category: "Access", details: "Temporary access to staging-db-01 approved" },
  { id: "al-006", action: "SSL certificate renewed", actor: "System", target: "api.university.edu", timestamp: "2026-03-21T11:00:00Z", category: "Security", details: "Certificate auto-renewed via Let's Encrypt" },
];

export const mockPolicyViolations: PolicyViolation[] = [
  { id: "pv-001", policy: "Password Rotation Policy", violatedBy: "Amir Tashkentov", detectedAt: "2026-03-20T09:00:00Z", severity: "medium", status: "Open", resolution: null },
  { id: "pv-002", policy: "MFA Enforcement Policy", violatedBy: "Kamola Mirzayeva", detectedAt: "2026-03-18T10:00:00Z", severity: "high", status: "Resolved", resolution: "MFA enabled on 2026-03-19" },
  { id: "pv-003", policy: "Data Retention Policy", violatedBy: "System", detectedAt: "2026-03-15T00:00:00Z", severity: "low", status: "Accepted", resolution: "Exception granted for audit logs" },
];

export const mockComplianceStats: ComplianceStats = {
  frameworksTotal: 4,
  compliant: 1,
  violations: 3,
  pendingAudits: 2,
  controlsTotal: 232,
  controlsPassed: 198,
};

// --- Capacity ---

export const mockCapacityResources: CapacityResource[] = [
  { id: "cr-001", name: "Production CPU", type: "Compute", currentUsage: 42, limit: 100, unit: "vCores", trend: "Up", forecastedFullDate: null },
  { id: "cr-002", name: "Production Memory", type: "Compute", currentUsage: 61, limit: 128, unit: "GB", trend: "Stable", forecastedFullDate: null },
  { id: "cr-003", name: "Primary Storage", type: "Storage", currentUsage: 420, limit: 600, unit: "GB", trend: "Up", forecastedFullDate: "2026-07-15" },
  { id: "cr-004", name: "Database Storage", type: "Storage", currentUsage: 184, limit: 500, unit: "GB", trend: "Up", forecastedFullDate: null },
  { id: "cr-005", name: "Active Users", type: "Application", currentUsage: 2840, limit: 5000, unit: "users", trend: "Up", forecastedFullDate: "2026-12-01" },
  { id: "cr-006", name: "Bandwidth", type: "Network", currentUsage: 1.2, limit: 10, unit: "Gbps", trend: "Stable", forecastedFullDate: null },
];

export const mockCostEntries: CostEntry[] = [
  { id: "cost-001", resource: "Cloud Compute (Prod)", monthlyCost: 1840, trend: "Up", category: "Compute" },
  { id: "cost-002", resource: "Object Storage (S3)", monthlyCost: 420, trend: "Up", category: "Storage" },
  { id: "cost-003", resource: "CDN", monthlyCost: 280, trend: "Stable", category: "Network" },
  { id: "cost-004", resource: "Database (Managed PG)", monthlyCost: 960, trend: "Stable", category: "Database" },
  { id: "cost-005", resource: "Monitoring Stack", monthlyCost: 180, trend: "Stable", category: "Operations" },
  { id: "cost-006", resource: "Backup Storage", monthlyCost: 145, trend: "Up", category: "Storage" },
];

export const mockInfraItems: InfraItem[] = [
  { id: "infra-001", name: "prod-app-01", type: "Virtual Machine", specs: "8 vCPU, 32 GB RAM", location: "Datacenter A", status: "Active", addedAt: "2025-01-15" },
  { id: "infra-002", name: "prod-app-02", type: "Virtual Machine", specs: "8 vCPU, 32 GB RAM", location: "Datacenter A", status: "Active", addedAt: "2025-06-01" },
  { id: "infra-003", name: "prod-db-01", type: "Virtual Machine", specs: "16 vCPU, 64 GB RAM, NVMe", location: "Datacenter B", status: "Active", addedAt: "2025-01-15" },
  { id: "infra-004", name: "prod-storage-01", type: "Storage Node", specs: "4 vCPU, 16 GB RAM, 2 TB SSD", location: "Datacenter A", status: "Active", addedAt: "2025-03-01" },
  { id: "infra-005", name: "old-backup-server", type: "Physical Server", specs: "4 core Xeon, 8 GB RAM, 10 TB HDD", location: "Datacenter B", status: "Decommissioned", addedAt: "2023-01-01" },
];

export const mockScalingRecommendations: ScalingRecommendation[] = [
  { id: "srec-001", resource: "Primary Storage", recommendation: "Add 200 GB storage. At current growth rate, limit reached by July 2026.", urgency: "Soon", estimatedCost: "$120/mo" },
  { id: "srec-002", resource: "Active Users", recommendation: "Plan capacity for 5,000+ users. Current infra handles ~5,000 concurrent.", urgency: "Planned", estimatedCost: "$800/mo additional" },
  { id: "srec-003", resource: "Video Streaming CPU", recommendation: "Add dedicated video transcoding node during exam season (May–June).", urgency: "Soon", estimatedCost: "$450/mo" },
];

export const mockCapacityStats: CapacityStats = {
  cpuUtilization: 42,
  memoryUtilization: 61,
  storageUtilization: 70,
  activeUsers: 2840,
  projectedFullDate: "2026-07-15",
  monthlyGrowthPercent: 4.2,
};

// --- Maintenance ---

export const mockMaintenanceWindows: MaintenanceWindow[] = [
  { id: "mw-001", title: "Storage Service Disk Expansion", description: "Adding 200 GB to primary storage node. Brief service interruption expected.", scheduledStart: "2026-03-29T02:00:00Z", scheduledEnd: "2026-03-29T04:00:00Z", status: "Scheduled", affectedServices: ["Storage Service"], type: "Planned", createdBy: "Amir Tashkentov" },
  { id: "mw-002", title: "OS Patching — Production Servers", description: "Applying March 2026 security patches to all production VMs.", scheduledStart: "2026-03-30T00:00:00Z", scheduledEnd: "2026-03-30T06:00:00Z", status: "Scheduled", affectedServices: ["LMS Core", "Auth Service", "API Gateway"], type: "Routine", createdBy: "Rustam Nazarov" },
  { id: "mw-003", title: "Report Engine Maintenance", description: "Upgrading report engine to v3.2.1. Service will be offline for 2 hours.", scheduledStart: "2026-03-26T08:00:00Z", scheduledEnd: "2026-03-26T10:00:00Z", status: "InProgress", affectedServices: ["Report Engine"], type: "Planned", createdBy: "Nodira Karimova" },
  { id: "mw-004", title: "Database Index Rebuild", description: "Scheduled quarterly index rebuild on lms_core database.", scheduledStart: "2026-03-15T01:00:00Z", scheduledEnd: "2026-03-15T03:30:00Z", status: "Completed", affectedServices: ["LMS Core"], type: "Routine", createdBy: "Rustam Nazarov" },
  { id: "mw-005", title: "Emergency: Notification Service Restart", description: "Emergency restart to recover from OOM kill.", scheduledStart: "2026-03-26T08:15:00Z", scheduledEnd: "2026-03-26T08:45:00Z", status: "Completed", affectedServices: ["Notification Service"], type: "Emergency", createdBy: "Rustam Nazarov" },
];

export const mockPatchStatuses: PatchStatus[] = [
  { id: "ps-001", systemName: "prod-app-01", currentVersion: "Ubuntu 22.04 (5.15.0-100)", latestVersion: "Ubuntu 22.04 (5.15.0-102)", patchDate: null, status: "PatchAvailable" },
  { id: "ps-002", systemName: "prod-app-02", currentVersion: "Ubuntu 22.04 (5.15.0-102)", latestVersion: "Ubuntu 22.04 (5.15.0-102)", patchDate: "2026-03-20", status: "UpToDate" },
  { id: "ps-003", systemName: "prod-db-01", currentVersion: "Ubuntu 22.04 (5.15.0-100)", latestVersion: "Ubuntu 22.04 (5.15.0-102)", patchDate: null, status: "PatchPending" },
  { id: "ps-004", systemName: "prod-storage-01", currentVersion: "Debian 12 (6.1.69)", latestVersion: "Debian 12 (6.1.76)", patchDate: null, status: "PatchAvailable" },
  { id: "ps-005", systemName: "staging-app-01", currentVersion: "Ubuntu 22.04 (5.15.0-102)", latestVersion: "Ubuntu 22.04 (5.15.0-102)", patchDate: "2026-03-22", status: "UpToDate" },
];

export const mockChangeRequests: ChangeRequest[] = [
  { id: "cr-req-001", title: "Increase DB connection pool size", requester: "Rustam Nazarov", status: "Approved", priority: "High", createdAt: "2026-03-25T10:00:00Z", scheduledFor: "2026-03-27T02:00:00Z" },
  { id: "cr-req-002", title: "Add Redis caching layer to Grades API", requester: "Amir Tashkentov", status: "Pending", priority: "Medium", createdAt: "2026-03-26T09:00:00Z", scheduledFor: null },
  { id: "cr-req-003", title: "Update API Gateway rate limiting rules", requester: "Nodira Karimova", status: "InProgress", priority: "High", createdAt: "2026-03-24T14:00:00Z", scheduledFor: "2026-03-26T22:00:00Z" },
  { id: "cr-req-004", title: "Migrate SMS Gateway to new provider", requester: "Rustam Nazarov", status: "Pending", priority: "Low", createdAt: "2026-03-20T11:00:00Z", scheduledFor: null },
];

export const mockServiceRestarts: ServiceRestart[] = [
  { id: "sr-001", serviceName: "Notification Service", restartedAt: "2026-03-26T08:30:00Z", reason: "OOM kill — container exceeded memory limit", restartedBy: "Rustam Nazarov", downtime: "15m" },
  { id: "sr-002", serviceName: "Storage Service", restartedAt: "2026-03-24T03:15:00Z", reason: "Scheduled maintenance", restartedBy: "System", downtime: "2m" },
  { id: "sr-003", serviceName: "LMS Core", restartedAt: "2026-03-22T02:00:00Z", reason: "Config change deployment", restartedBy: "Amir Tashkentov", downtime: "45s" },
  { id: "sr-004", serviceName: "API Gateway", restartedAt: "2026-03-20T01:30:00Z", reason: "SSL certificate renewal", restartedBy: "System", downtime: "30s" },
];

export const mockMaintenanceStats: MaintenanceStats = {
  scheduledWindows: 2,
  completedThisMonth: 3,
  pendingPatches: 3,
  changeRequests: 4,
  avgDowntimeMinutes: 22,
  nextWindow: "2026-03-29T02:00:00Z",
};

// --- Reports ---

export const mockTechReports: TechReport[] = [
  { id: "rep-001", type: "Uptime", title: "March 2026 System Uptime Report", period: "March 2026", generatedAt: "2026-03-25T08:00:00Z", generatedBy: "System", format: "PDF", fileSize: "1.2 MB", status: "Ready" },
  { id: "rep-002", type: "SLA", title: "Q1 2026 SLA Compliance Report", period: "Q1 2026", generatedAt: "2026-03-25T09:00:00Z", generatedBy: "Rustam Nazarov", format: "PDF", fileSize: "3.4 MB", status: "Ready" },
  { id: "rep-003", type: "Performance", title: "March 2026 Performance Analysis", period: "March 2026", generatedAt: "2026-03-24T10:00:00Z", generatedBy: "System", format: "PDF", fileSize: "2.1 MB", status: "Ready" },
  { id: "rep-004", type: "Security", title: "March 2026 Security Incidents Report", period: "March 2026", generatedAt: "2026-03-24T11:00:00Z", generatedBy: "Nodira Karimova", format: "PDF", fileSize: "1.8 MB", status: "Ready" },
  { id: "rep-005", type: "Capacity", title: "Q1 2026 Capacity Planning Report", period: "Q1 2026", generatedAt: "2026-03-23T14:00:00Z", generatedBy: "Amir Tashkentov", format: "XLSX", fileSize: "840 KB", status: "Ready" },
  { id: "rep-006", type: "Uptime", title: "April 2026 System Uptime Report", period: "April 2026", generatedAt: "2026-04-01T08:00:00Z", generatedBy: "System", format: "PDF", fileSize: "—", status: "Scheduled" },
  { id: "rep-007", type: "Performance", title: "Weekly Performance — Week 12", period: "Mar 18–24, 2026", generatedAt: "2026-03-18T08:00:00Z", generatedBy: "System", format: "CSV", fileSize: "220 KB", status: "Ready" },
];

export const mockReportSchedules: ReportSchedule[] = [
  { id: "rs-001", name: "Weekly Uptime Report", type: "Uptime", frequency: "Weekly", nextRun: "2026-04-02T08:00:00Z", lastRun: "2026-03-26T08:00:00Z", recipients: ["rustam@university.edu", "director@university.edu"] },
  { id: "rs-002", name: "Monthly Performance Report", type: "Performance", frequency: "Monthly", nextRun: "2026-04-01T08:00:00Z", lastRun: "2026-03-01T08:00:00Z", recipients: ["rustam@university.edu", "amir@university.edu"] },
  { id: "rs-003", name: "Monthly Security Report", type: "Security", frequency: "Monthly", nextRun: "2026-04-01T08:00:00Z", lastRun: "2026-03-01T08:00:00Z", recipients: ["nodira@university.edu", "security@university.edu"] },
  { id: "rs-004", name: "Weekly SLA Report", type: "SLA", frequency: "Weekly", nextRun: "2026-04-02T09:00:00Z", lastRun: "2026-03-26T09:00:00Z", recipients: ["director@university.edu"] },
];

export const mockReportsStats: ReportsStats = {
  totalReports: 7,
  generatedThisMonth: 5,
  scheduledReports: 4,
  slaCompliance: "99.1%",
};

// --- Settings ---

export const mockNotificationChannels: NotificationChannel[] = [
  { id: "nc-001", name: "Ops Email", type: "Email", endpoint: "it-ops@university.edu", enabled: true, events: ["critical", "high"] },
  { id: "nc-002", name: "Teams IT-Ops Channel", type: "Teams", endpoint: "https://outlook.office.com/webhook/...", enabled: true, events: ["critical", "high", "medium"] },
  { id: "nc-003", name: "Slack #incidents", type: "Slack", endpoint: "https://hooks.slack.com/services/...", enabled: false, events: ["critical"] },
  { id: "nc-004", name: "PagerDuty Webhook", type: "Webhook", endpoint: "https://events.pagerduty.com/v2/enqueue", enabled: true, events: ["critical"] },
  { id: "nc-005", name: "SMS On-call", type: "SMS", endpoint: "+998712345678", enabled: true, events: ["critical"] },
];

export const mockOnCallEntries: OnCallEntry[] = [
  { id: "oc-001", name: "Rustam Nazarov", role: "Primary On-Call", startDate: "2026-03-24", endDate: "2026-03-30", phone: "+998901234567", email: "rustam@university.edu" },
  { id: "oc-002", name: "Amir Tashkentov", role: "Secondary On-Call", startDate: "2026-03-24", endDate: "2026-03-30", phone: "+998902345678", email: "amir@university.edu" },
  { id: "oc-003", name: "Nodira Karimova", role: "Primary On-Call", startDate: "2026-03-31", endDate: "2026-04-06", phone: "+998903456789", email: "nodira@university.edu" },
];

export const mockEscalationPolicies: EscalationPolicy[] = [
  {
    id: "ep-001",
    name: "P1 Critical Incidents",
    levels: [
      { level: 1, contact: "Primary On-Call", delayMinutes: 0 },
      { level: 2, contact: "Secondary On-Call", delayMinutes: 15 },
      { level: 3, contact: "IT Operations Manager", delayMinutes: 30 },
      { level: 4, contact: "CTO", delayMinutes: 60 },
    ],
  },
  {
    id: "ep-002",
    name: "P2 High Incidents",
    levels: [
      { level: 1, contact: "Primary On-Call", delayMinutes: 0 },
      { level: 2, contact: "Secondary On-Call", delayMinutes: 30 },
    ],
  },
];

export const mockBackupRetentionPolicies: BackupRetentionPolicy[] = [
  { id: "brp-001", name: "Daily Incremental — Short", backupType: "Incremental", retentionDays: 7, storageLocation: "s3://university-backups/daily/", enabled: true },
  { id: "brp-002", name: "Full Backup — Monthly", backupType: "Full", retentionDays: 30, storageLocation: "s3://university-backups/full/", enabled: true },
  { id: "brp-003", name: "Full Backup — Quarterly", backupType: "Full", retentionDays: 90, storageLocation: "s3://university-backups/quarterly/", enabled: true },
  { id: "brp-004", name: "Config Snapshots", backupType: "Differential", retentionDays: 365, storageLocation: "s3://university-backups/configs/", enabled: true },
];

export const mockAlertThresholds: AlertThreshold[] = [
  { id: "at-001", metric: "CPU Usage", warning: 70, critical: 85, unit: "%" },
  { id: "at-002", metric: "Memory Usage", warning: 75, critical: 90, unit: "%" },
  { id: "at-003", metric: "Disk Usage", warning: 80, critical: 90, unit: "%" },
  { id: "at-004", metric: "API Response Time", warning: 300, critical: 1000, unit: "ms" },
  { id: "at-005", metric: "Error Rate", warning: 1, critical: 5, unit: "%" },
  { id: "at-006", metric: "Connection Pool Usage", warning: 70, critical: 90, unit: "%" },
];

export const mockSettingsStats: SettingsStats = {
  notificationChannels: 5,
  activeAlertRules: 6,
  backupPolicies: 4,
  onCallMembers: 3,
};
