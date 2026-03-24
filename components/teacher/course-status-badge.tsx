import { cn } from "@/lib/utils";
import type { CourseStatus } from "@/types/teacher";

type CourseStatusBadgeProps = {
  status: CourseStatus;
  className?: string;
};

const statusConfig: Record<CourseStatus, { label: string; className: string }> = {
  Draft: { label: "Draft", className: "bg-[#f0f0f0] text-[#666666]" },
  InReview: { label: "In Review", className: "bg-[#fef9c3] text-[#854d0e]" },
  Approved: { label: "Approved", className: "bg-[#dbeafe] text-[#1d4ed8]" },
  Published: { label: "Published", className: "bg-[#dcfce7] text-[#166534]" },
  Rejected: { label: "Rejected", className: "bg-[#fee2e2] text-[#991b1b]" },
  ReApprovalRequired: {
    label: "Re-Approval Required",
    className: "bg-[#ffedd5] text-[#9a3412]",
  },
};

export function CourseStatusBadge({ status, className }: CourseStatusBadgeProps) {
  const config = statusConfig[status];
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
