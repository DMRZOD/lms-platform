// ─── Status / Enum Types ────────────────────────────────────────────────────

export type ContractStatus = "Active" | "Expired" | "Pending" | "Terminated";
export type ContractType = "Full" | "Partial" | "Grant";

export type PaymentStatus = "Completed" | "Pending" | "Failed" | "Refunded";
export type PaymentType = "Tuition" | "Installment" | "Fine" | "Other";
export type PaymentMethod = "Card" | "Bank Transfer" | "Cash" | "Online";

export type DebtStatus = "Outstanding" | "Overdue" | "PartiallyPaid" | "WrittenOff";
export type DebtSeverity = "Critical" | "High" | "Medium" | "Low";

export type BlockType = "Auto" | "Manual";
export type BlockStatus = "Active" | "Resolved";
export type ExceptionStatus = "None" | "Pending" | "Approved" | "Rejected";

export type ReconciliationStatus = "Matched" | "Mismatch" | "Pending";

export type AuditActionType =
  | "ContractCreated"
  | "ContractTerminated"
  | "PaymentRecorded"
  | "DebtCreated"
  | "DebtWrittenOff"
  | "StudentBlocked"
  | "StudentUnblocked"
  | "ExceptionGranted"
  | "SettingsUpdated"
  | "ReportGenerated"
  | "SyncTriggered";

export type ReportType =
  | "Revenue"
  | "Debt"
  | "PaymentCollection"
  | "ContractSummary"
  | "Reconciliation"
  | "StudentBalance";

export type ReportFormat = "PDF" | "Excel";

export type AlertSeverity = "warning" | "danger" | "info" | "success";

// ─── Entity Interfaces ───────────────────────────────────────────────────────

export interface Contract {
  id: string;
  contractNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  program: string;
  faculty: string;
  type: ContractType;
  totalAmount: number;
  paidAmount: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  installmentCount: number;
  nextPaymentDate: string | null;
  nextPaymentAmount: number | null;
  notes: string;
  createdAt: string;
  createdBy: string;
}

export interface ContractPaymentSchedule {
  id: string;
  contractId: string;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: PaymentStatus;
  paidAt: string | null;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  contractId: string;
  contractNumber: string;
  studentId: string;
  studentName: string;
  amount: number;
  type: PaymentType;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  description: string;
  processedBy: string;
}

export interface Debt {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  contractId: string;
  contractNumber: string;
  program: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  status: DebtStatus;
  severity: DebtSeverity;
  lastReminderDate: string | null;
  notes: string;
}

export interface Block {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  program: string;
  reason: string;
  blockDate: string;
  type: BlockType;
  status: BlockStatus;
  exceptionStatus: ExceptionStatus;
  blockedBy: string;
  debtAmount?: number;
}

export interface BlockHistoryEntry {
  id: string;
  studentId: string;
  studentName: string;
  action: "Blocked" | "Unblocked";
  type: BlockType;
  reason: string;
  date: string;
  actor: string;
}

export interface ReconciliationRecord {
  id: string;
  recordNumber: string;
  studentId: string;
  studentName: string;
  contractNumber: string;
  lmsAmount: number;
  oneCAmount: number;
  difference: number;
  status: ReconciliationStatus;
  lastCheckedAt: string;
  resolvedBy: string | null;
  resolvedAt: string | null;
  notes: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditActionType;
  entityType: string;
  entityId: string;
  entityLabel: string;
  details: string;
  severity: AlertSeverity;
}

export interface FinanceReport {
  id: string;
  type: ReportType;
  period: string;
  format: ReportFormat;
  generatedAt: string;
  generatedBy: string;
  fileSize: string;
  status: "Ready" | "Generating" | "Failed";
}

export interface ImportRecord {
  id: string;
  fileName: string;
  importedAt: string;
  importedBy: string;
  totalRows: number;
  validRows: number;
  errorRows: number;
  status: "Completed" | "Failed" | "PartialSuccess";
}

export interface ImportValidationRow {
  rowNumber: number;
  studentName: string;
  studentId: string;
  program: string;
  amount: string;
  status: "Valid" | "Error";
  errorDetails?: string;
}

export interface FinanceSettings {
  paymentMethods: PaymentMethod[];
  paymentDeadlineDays: number;
  latePenaltyPercent: number;
  autoBlockEnabled: boolean;
  autoBlockThresholdDays: number;
  gracePeriodDays: number;
  defaultInstallmentCount: number;
  minDownPaymentPercent: number;
  lateInstallmentPenaltyPercent: number;
  syncFrequency: "hourly" | "daily" | "weekly";
  autoResolveThreshold: number;
  notificationEmail: string;
  paymentReminderTemplate: string;
  overdueNoticeTemplate: string;
  blockNotificationTemplate: string;
}

// ─── Stats Interfaces ─────────────────────────────────────────────────────────

export interface FinanceDashboardStats {
  totalRevenue: number;
  outstandingDebts: number;
  pendingPayments: number;
  activeContracts: number;
  blockedStudents: number;
  monthlyCollections: number;
  revenueChangePercent: number;
  lastSyncAt: string;
  syncStatus: "Synced" | "Syncing" | "Error" | "Pending";
}

export interface ContractStats {
  total: number;
  active: number;
  expiringSoon: number;
  totalValue: number;
}

export interface PaymentStats {
  totalCollected: number;
  pending: number;
  failed: number;
  refunds: number;
}

export interface DebtStats {
  totalOutstanding: number;
  overdueAmount: number;
  studentsWithDebt: number;
  avgDaysOverdue: number;
}

export interface BlockingStats {
  currentlyBlocked: number;
  autoBlocked: number;
  manualBlocks: number;
  pendingExceptions: number;
}

export interface ReconciliationStats {
  totalRecords: number;
  matched: number;
  mismatches: number;
  pendingReview: number;
}
