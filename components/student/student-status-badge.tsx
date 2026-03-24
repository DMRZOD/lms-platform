import { cn } from "@/lib/utils";

type StudentStatusBadgeProps = {
  status: string;
  className?: string;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  // Access status
  Active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200" },
  BlockedByDebt: { label: "Blocked (Debt)", className: "bg-amber-100 text-amber-800 border-amber-200" },
  BlockedByFraud: { label: "Blocked (Fraud)", className: "bg-red-100 text-red-800 border-red-200" },
  SuspendedByAdmin: { label: "Suspended", className: "bg-red-100 text-red-800 border-red-200" },
  TemporaryOverride: { label: "Temp. Access", className: "bg-blue-100 text-blue-800 border-blue-200" },
  // Course status
  in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200" },
  completed: { label: "Completed", className: "bg-green-100 text-green-800 border-green-200" },
  dropped: { label: "Dropped", className: "bg-secondary text-secondary-foreground border-border" },
  upcoming: { label: "Upcoming", className: "bg-secondary text-secondary-foreground border-border" },
  // Lecture status
  live: { label: "Live Now", className: "bg-red-100 text-red-800 border-red-200" },
  missed: { label: "Missed", className: "bg-red-100 text-red-800 border-red-200" },
  // Attendance status
  present: { label: "Present", className: "bg-green-100 text-green-800 border-green-200" },
  absent: { label: "Absent", className: "bg-red-100 text-red-800 border-red-200" },
  late: { label: "Late", className: "bg-amber-100 text-amber-800 border-amber-200" },
  excused: { label: "Excused", className: "bg-blue-100 text-blue-800 border-blue-200" },
  // Assignment status
  not_started: { label: "Not Started", className: "bg-secondary text-secondary-foreground border-border" },
  in_progress_asg: { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200" },
  submitted: { label: "Submitted", className: "bg-blue-100 text-blue-800 border-blue-200" },
  graded: { label: "Graded", className: "bg-green-100 text-green-800 border-green-200" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-800 border-red-200" },
  // Exam status
  eligible: { label: "Eligible", className: "bg-green-100 text-green-800 border-green-200" },
  ineligible: { label: "Not Eligible", className: "bg-red-100 text-red-800 border-red-200" },
  in_progress_exam: { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200" },
  // Payment status
  paid: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800 border-amber-200" },
  partial: { label: "Partial", className: "bg-amber-100 text-amber-800 border-amber-200" },
  // Exam type
  midterm: { label: "Midterm", className: "bg-purple-100 text-purple-800 border-purple-200" },
  final: { label: "Final", className: "bg-purple-100 text-purple-800 border-purple-200" },
  quiz: { label: "Quiz", className: "bg-blue-100 text-blue-800 border-blue-200" },
  retake: { label: "Retake", className: "bg-amber-100 text-amber-800 border-amber-200" },
};

export function StudentStatusBadge({ status, className }: StudentStatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-secondary text-secondary-foreground border-border" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
