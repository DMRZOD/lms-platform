import { cn } from "@/lib/utils";
import type { AdmissionStatus, AppealStatus, DocumentStatus } from "@/types/applicant";

// Добавляем API статусы (snake_case с сервера)
type ApiStatus =
    | "APPLIED"
    | "DOCS_PENDING"
    | "DOCS_IN_REVIEW"
    | "VERIFIED"
    | "EXAM_SCHEDULED"
    | "EXAM_IN_PROGRESS"
    | "EXAM_COMPLETED"
    | "PASSED"
    | "FAILED"
    | "UNDER_REVIEW"
    | "ENROLLED"
    | "REJECTED_DOCS"
    | "PENDING_REVIEW"
    | "APPROVED"
    | "REJECTED";

type StatusType = AdmissionStatus | DocumentStatus | AppealStatus | ApiStatus | string;

const statusConfig: Record<string, { label: string; className: string }> = {
  // ── Admission statuses (frontend PascalCase) ──
  Applied:        { label: "Submitted",          className: "bg-secondary text-secondary-foreground" },
  DocsPending:    { label: "Documents Pending",  className: "bg-amber-50 text-amber-700" },
  DocsInReview:   { label: "Documents In Review",className: "bg-blue-50 text-blue-700" },
  Verified:       { label: "Verified",           className: "bg-emerald-50 text-emerald-700" },
  ExamScheduled:  { label: "Exam Scheduled",     className: "bg-blue-50 text-blue-700" },
  ExamInProgress: { label: "Exam In Progress",   className: "bg-amber-50 text-amber-700" },
  ExamCompleted:  { label: "Exam Completed",     className: "bg-secondary text-secondary-foreground" },
  Passed:         { label: "Passed",             className: "bg-emerald-50 text-emerald-700" },
  Failed:         { label: "Failed",             className: "bg-red-50 text-red-700" },
  Enrolled:       { label: "Enrolled",           className: "bg-emerald-50 text-emerald-700" },

  // ── Admission statuses (API SCREAMING_SNAKE_CASE) ──
  APPLIED:          { label: "Submitted",           className: "bg-secondary text-secondary-foreground" },
  DOCS_PENDING:     { label: "Documents Pending",   className: "bg-amber-50 text-amber-700" },
  DOCS_IN_REVIEW:   { label: "Documents In Review", className: "bg-blue-50 text-blue-700" },
  VERIFIED:         { label: "Verified",            className: "bg-emerald-50 text-emerald-700" },
  EXAM_SCHEDULED:   { label: "Exam Scheduled",      className: "bg-blue-50 text-blue-700" },
  EXAM_IN_PROGRESS: { label: "Exam In Progress",    className: "bg-amber-50 text-amber-700" },
  EXAM_COMPLETED:   { label: "Exam Completed",      className: "bg-secondary text-secondary-foreground" },
  PASSED:           { label: "Passed",              className: "bg-emerald-50 text-emerald-700" },
  FAILED:           { label: "Failed",              className: "bg-red-50 text-red-700" },
  UNDER_REVIEW:     { label: "Under Review",        className: "bg-amber-50 text-amber-700" },
  ENROLLED:         { label: "Enrolled",            className: "bg-emerald-50 text-emerald-700" },
  REJECTED_DOCS:    { label: "Docs Rejected",       className: "bg-red-50 text-red-700" },

  // ── Document statuses (frontend) ──
  pending:   { label: "Pending",   className: "bg-secondary text-secondary-foreground" },
  uploaded:  { label: "Uploaded",  className: "bg-blue-50 text-blue-700" },
  in_review: { label: "In Review", className: "bg-amber-50 text-amber-700" },
  approved:  { label: "Approved",  className: "bg-emerald-50 text-emerald-700" },
  rejected:  { label: "Rejected",  className: "bg-red-50 text-red-700" },

  // ── Document statuses (API) ──
  PENDING_REVIEW: { label: "Pending Review", className: "bg-amber-50 text-amber-700" },
  APPROVED:       { label: "Approved",       className: "bg-emerald-50 text-emerald-700" },
  REJECTED:       { label: "Rejected",       className: "bg-red-50 text-red-700" },

  // ── Appeal statuses ──
  not_submitted:    { label: "Not Submitted", className: "bg-secondary text-secondary-foreground" },
  submitted:        { label: "Submitted",     className: "bg-blue-50 text-blue-700" },
  in_review_appeal: { label: "Under Review",  className: "bg-amber-50 text-amber-700" },
  approved_appeal:  { label: "Approved",      className: "bg-emerald-50 text-emerald-700" },
  rejected_appeal:  { label: "Rejected",      className: "bg-red-50 text-red-700" },
};

function getKey(status: string, variant?: "appeal"): string {
  if (
      variant === "appeal" &&
      (status === "in_review" || status === "approved" || status === "rejected")
  ) {
    return `${status}_appeal`;
  }
  return status;
}

export function StatusBadge({
                              status,
                              variant,
                              className,
                            }: {
  status: StatusType;
  variant?: "appeal";
  className?: string;
}) {
  const key = getKey(status as string, variant);
  const config = statusConfig[key] ?? {
    label: (status as string).replace(/_/g, " "),
    className: "bg-secondary text-secondary-foreground",
  };

  return (
      <span
          className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              config.className,
              className,
          )}
      >
      {config.label}
    </span>
  );
}