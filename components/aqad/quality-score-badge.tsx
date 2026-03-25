import { cn } from "@/lib/utils";

type QualityScoreBadgeProps = {
  score: number;
  className?: string;
};

export function QualityScoreBadge({ score, className }: QualityScoreBadgeProps) {
  const style =
    score >= 80
      ? "bg-[#dcfce7] text-[#16a34a]"
      : score >= 60
        ? "bg-[#fef3c7] text-[#d97706]"
        : "bg-[#fee2e2] text-[#dc2626]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums",
        style,
        className,
      )}
    >
      {score}
    </span>
  );
}
