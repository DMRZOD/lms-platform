import { cn } from "@/lib/utils";
import type {
  AcademicStanding,
  AdmissionDecision,
  EligibilityStatus,
  ExceptionStatus,
  ExceptionType,
  GroupStatus,
  ProgramStatus,
  RetakeStatus,
  ScheduleSyncStatus,
} from "@/types/academic";

type BadgeVariant =
  | ProgramStatus
  | GroupStatus
  | AdmissionDecision
  | EligibilityStatus
  | ExceptionStatus
  | ExceptionType
  | AcademicStanding
  | RetakeStatus
  | ScheduleSyncStatus
  | string;

const badgeStyles: Record<string, string> = {
  // Program
  Active: "bg-[#dcfce7] text-[#16a34a]",
  Draft: "bg-[#f4f4f4] text-[#6b7280]",
  Archived: "bg-[#f4f4f4] text-[#6b7280]",
  Suspended: "bg-[#fef3c7] text-[#d97706]",

  // Group
  Graduated: "bg-[#dbeafe] text-[#2563eb]",
  Dissolved: "bg-[#fee2e2] text-[#dc2626]",
  OnHold: "bg-[#fef3c7] text-[#d97706]",

  // Admission
  Pending: "bg-[#f4f4f4] text-[#6b7280]",
  DocsPending: "bg-[#fef3c7] text-[#d97706]",
  DocsInReview: "bg-[#dbeafe] text-[#2563eb]",
  Verified: "bg-[#dcfce7] text-[#16a34a]",
  RejectedDocs: "bg-[#fee2e2] text-[#dc2626]",
  Waitlisted: "bg-[#ede9fe] text-[#7c3aed]",

  // Eligibility
  Eligible: "bg-[#dcfce7] text-[#16a34a]",
  Ineligible: "bg-[#fee2e2] text-[#dc2626]",
  Override: "bg-[#fef3c7] text-[#d97706]",

  // Exception status
  Expired: "bg-[#f4f4f4] text-[#6b7280]",
  Revoked: "bg-[#fee2e2] text-[#dc2626]",
  PendingReview: "bg-[#fef3c7] text-[#d97706]",

  // Exception type
  Debt: "bg-[#fee2e2] text-[#dc2626]",
  Attendance: "bg-[#fef3c7] text-[#d97706]",
  Prerequisite: "bg-[#dbeafe] text-[#2563eb]",
  Probation: "bg-[#ede9fe] text-[#7c3aed]",

  // Academic standing
  GoodStanding: "bg-[#dcfce7] text-[#16a34a]",
  Warning: "bg-[#fef3c7] text-[#d97706]",
  Dismissed: "bg-[#fee2e2] text-[#dc2626]",

  // Retake
  Scheduled: "bg-[#dbeafe] text-[#2563eb]",
  InProgress: "bg-[#fef3c7] text-[#d97706]",
  Completed: "bg-[#dcfce7] text-[#16a34a]",
  Cancelled: "bg-[#fee2e2] text-[#dc2626]",

  // Sync status
  Synced: "bg-[#dcfce7] text-[#16a34a]",
  PendingSync: "bg-[#fef3c7] text-[#d97706]",
  Conflict: "bg-[#fee2e2] text-[#dc2626]",
  ManualOverride: "bg-[#ede9fe] text-[#7c3aed]",
};

const badgeLabels: Record<string, string> = {
  GoodStanding: "Good Standing",
  DocsPending: "Docs Pending",
  DocsInReview: "In Review",
  RejectedDocs: "Docs Rejected",
  PendingReview: "Pending Review",
  PendingSync: "Pending Sync",
  ManualOverride: "Manual Override",
  InProgress: "In Progress",
  OnHold: "On Hold",
};

type StatusBadgeProps = {
  status: BadgeVariant;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = badgeStyles[status] ?? "bg-[#f4f4f4] text-[#6b7280]";
  const label = badgeLabels[status] ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
