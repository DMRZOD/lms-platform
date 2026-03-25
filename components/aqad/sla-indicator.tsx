import { cn } from "@/lib/utils";

type SLAIndicatorProps = {
  deadline: string;
  className?: string;
};

function getDaysRemaining(deadline: string): number {
  const now = new Date();
  const due = new Date(deadline);
  const diffMs = due.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function SLAIndicator({ deadline, className }: SLAIndicatorProps) {
  const days = getDaysRemaining(deadline);

  if (days < 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#fee2e2] text-[#dc2626]",
          className,
        )}
      >
        Overdue {Math.abs(days)}d
      </span>
    );
  }

  if (days === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#fee2e2] text-[#dc2626]",
          className,
        )}
      >
        Due today
      </span>
    );
  }

  if (days <= 1) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#fee2e2] text-[#dc2626]",
          className,
        )}
      >
        {days}d left
      </span>
    );
  }

  if (days <= 2) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#fef3c7] text-[#d97706]",
          className,
        )}
      >
        {days}d left
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#dcfce7] text-[#16a34a]",
        className,
      )}
    >
      {days}d left
    </span>
  );
}
