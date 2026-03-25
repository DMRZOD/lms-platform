import { cn } from "@/lib/utils";
import type {
  AssignmentStatus,
  AssignmentType,
  ReplacementStatus,
  TeacherStatus,
  WorkloadStatus,
  AccessLevel,
  DocumentStatus,
} from "@/constants/resource-mock-data";

type StatusBadgeProps = {
  status:
    | TeacherStatus
    | AssignmentStatus
    | AssignmentType
    | WorkloadStatus
    | ReplacementStatus
    | AccessLevel
    | DocumentStatus
    | string;
  className?: string;
};

const statusStyles: Record<string, string> = {
  // Teacher statuses
  Pending: "bg-[#fef3c7] text-[#92400e]",
  Verified: "bg-[#dbeafe] text-[#1e40af]",
  Active: "bg-[#dcfce7] text-[#166534]",
  Suspended: "bg-[#fee2e2] text-[#991b1b]",

  // Assignment statuses
  Completed: "bg-[#f3f4f6] text-[#374151]",

  // Assignment types
  Primary: "bg-[#dbeafe] text-[#1e40af]",
  CoTeaching: "bg-[#ede9fe] text-[#5b21b6]",
  TA: "bg-[#f3f4f6] text-[#374151]",

  // Workload statuses
  Normal: "bg-[#dcfce7] text-[#166534]",
  High: "bg-[#fef3c7] text-[#92400e]",
  Overloaded: "bg-[#fee2e2] text-[#991b1b]",
  Underloaded: "bg-[#f3f4f6] text-[#374151]",

  // Replacement statuses
  Initiated: "bg-[#dbeafe] text-[#1e40af]",
  InProgress: "bg-[#fef3c7] text-[#92400e]",
  Cancelled: "bg-[#f3f4f6] text-[#374151]",

  // Access levels
  Full: "bg-[#dbeafe] text-[#1e40af]",
  ReadOnly: "bg-[#f3f4f6] text-[#374151]",

  // Document statuses
  Rejected: "bg-[#fee2e2] text-[#991b1b]",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] ?? "bg-[#f3f4f6] text-[#374151]";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className,
      )}
    >
      {status}
    </span>
  );
}
