import { cn } from "@/lib/utils";
import type { AdmissionStatus, AppealStatus, DocumentStatus } from "@/types/applicant";

type StatusType = AdmissionStatus | DocumentStatus | AppealStatus;

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  // Admission statuses
  Applied: { label: "Submitted", className: "bg-secondary text-secondary-foreground" },
  DocsPending: { label: "Documents Pending", className: "bg-amber-50 text-amber-700" },
  DocsInReview: { label: "Documents In Review", className: "bg-blue-50 text-blue-700" },
  Verified: { label: "Verified", className: "bg-emerald-50 text-emerald-700" },
  ExamScheduled: { label: "Exam Scheduled", className: "bg-blue-50 text-blue-700" },
  ExamInProgress: { label: "Exam In Progress", className: "bg-amber-50 text-amber-700" },
  ExamCompleted: { label: "Exam Completed", className: "bg-secondary text-secondary-foreground" },
  Passed: { label: "Passed", className: "bg-emerald-50 text-emerald-700" },
  Failed: { label: "Failed", className: "bg-red-50 text-red-700" },
  Enrolled: { label: "Enrolled", className: "bg-emerald-50 text-emerald-700" },
  // Document statuses
  pending: { label: "Pending", className: "bg-secondary text-secondary-foreground" },
  uploaded: { label: "Uploaded", className: "bg-blue-50 text-blue-700" },
  in_review: { label: "In Review", className: "bg-amber-50 text-amber-700" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700" },
  // Appeal statuses
  not_submitted: { label: "Not Submitted", className: "bg-secondary text-secondary-foreground" },
  submitted: { label: "Submitted", className: "bg-blue-50 text-blue-700" },
  in_review_appeal: { label: "Under Review", className: "bg-amber-50 text-amber-700" },
  approved_appeal: { label: "Approved", className: "bg-emerald-50 text-emerald-700" },
  rejected_appeal: { label: "Rejected", className: "bg-red-50 text-red-700" },
};

function getKey(status: StatusType, variant?: "appeal"): string {
  if (variant === "appeal" && (status === "in_review" || status === "approved" || status === "rejected")) {
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
  const key = getKey(status, variant);
  const config = statusConfig[key] ?? {
    label: status,
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
