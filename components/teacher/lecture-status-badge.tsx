import { cn } from "@/lib/utils";
import type { LectureStatus } from "@/types/teacher";

type LectureStatusBadgeProps = {
  status: LectureStatus;
  className?: string;
};

const statusConfig: Record<LectureStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-[#dbeafe] text-[#1d4ed8]" },
  live: { label: "Live", className: "bg-[#dcfce7] text-[#166534]" },
  completed: { label: "Completed", className: "bg-[#f0f0f0] text-[#666666]" },
  cancelled: { label: "Cancelled", className: "bg-[#fee2e2] text-[#991b1b]" },
};

export function LectureStatusBadge({ status, className }: LectureStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {status === "live" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
      )}
      {config.label}
    </span>
  );
}
