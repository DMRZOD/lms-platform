import { cn } from "@/lib/utils";
import type {
  ComplaintStatus,
  CorrectiveActionStatus,
  AuditResult,
  CourseStatus,
  ReviewDecision,
  ReviewType,
  FraudFlagStatus,
} from "@/types/aqad";

type BadgeVariant =
  | CourseStatus
  | ComplaintStatus
  | CorrectiveActionStatus
  | AuditResult
  | ReviewDecision
  | ReviewType
  | FraudFlagStatus
  | string;

const badgeStyles: Record<string, string> = {
  // Course status
  Draft: "bg-[#f4f4f4] text-[#6b7280]",
  InReview: "bg-[#dbeafe] text-[#2563eb]",
  Approved: "bg-[#dcfce7] text-[#16a34a]",
  Rejected: "bg-[#fee2e2] text-[#dc2626]",
  ConditionalApproval: "bg-[#fef3c7] text-[#d97706]",
  Published: "bg-[#dcfce7] text-[#16a34a]",
  ReApprovalRequired: "bg-[#fef3c7] text-[#d97706]",
  Suspended: "bg-[#fee2e2] text-[#dc2626]",
  Archived: "bg-[#f4f4f4] text-[#6b7280]",

  // Review type
  Initial: "bg-[#dbeafe] text-[#2563eb]",
  Resubmission: "bg-[#ede9fe] text-[#7c3aed]",
  ReApproval: "bg-[#fef3c7] text-[#d97706]",

  // Complaint status
  Submitted: "bg-[#fef3c7] text-[#d97706]",
  Resolved: "bg-[#dcfce7] text-[#16a34a]",

  // Corrective action status
  Issued: "bg-[#fef3c7] text-[#d97706]",
  InProgress: "bg-[#dbeafe] text-[#2563eb]",
  Completed: "bg-[#dcfce7] text-[#16a34a]",
  Verified: "bg-[#dcfce7] text-[#15803d]",
  Overdue: "bg-[#fee2e2] text-[#dc2626]",
  Reopened: "bg-[#fee2e2] text-[#dc2626]",

  // Audit results
  Passed: "bg-[#dcfce7] text-[#16a34a]",
  IssuesFound: "bg-[#fef3c7] text-[#d97706]",

  // Fraud flags
  Pending: "bg-[#fef3c7] text-[#d97706]",
  Confirmed: "bg-[#fee2e2] text-[#dc2626]",
  Dismissed: "bg-[#f4f4f4] text-[#6b7280]",

  // Exam audit status
  PendingReview: "bg-[#fef3c7] text-[#d97706]",
  Reviewed: "bg-[#dcfce7] text-[#16a34a]",
};

const badgeLabels: Record<string, string> = {
  InReview: "In Review",
  ConditionalApproval: "Conditional",
  ReApprovalRequired: "Re-Approval Required",
  InProgress: "In Progress",
  IssuesFound: "Issues Found",
  PendingReview: "Pending Review",
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
