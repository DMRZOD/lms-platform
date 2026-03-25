import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KPIMetric } from "@/types/deputy";

type KPIGaugeProps = {
  kpi: KPIMetric;
};

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string; barColor: string }
> = {
  OnTrack: {
    label: "On Track",
    color: "text-[#166534]",
    bgColor: "bg-[#dcfce7]",
    barColor: "bg-[#22c55e]",
  },
  AtRisk: {
    label: "At Risk",
    color: "text-[#92400e]",
    bgColor: "bg-[#fef3c7]",
    barColor: "bg-[#f59e0b]",
  },
  Critical: {
    label: "Critical",
    color: "text-[#991b1b]",
    bgColor: "bg-[#fee2e2]",
    barColor: "bg-[#ef4444]",
  },
  Exceeded: {
    label: "Exceeded",
    color: "text-[#1e40af]",
    bgColor: "bg-[#dbeafe]",
    barColor: "bg-[#3b82f6]",
  },
};

export function KPIGauge({ kpi }: KPIGaugeProps) {
  const config = statusConfig[kpi.status];
  const progressPct = Math.min(
    (kpi.currentValue / kpi.targetValue) * 100,
    120,
  );

  const formatValue = (val: number) => {
    if (kpi.unit === "$") return `$${(val / 1_000_000).toFixed(1)}M`;
    if (kpi.unit === "GPA") return val.toFixed(2);
    if (kpi.unit === "score") return val.toFixed(1);
    if (kpi.unit === "students" || kpi.unit === "count")
      return val.toLocaleString();
    if (kpi.unit === "days") return `${val}d`;
    return `${val}${kpi.unit}`;
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{kpi.name}</p>
          <p className="text-xs text-secondary-foreground">{kpi.category}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            config.bgColor,
            config.color,
          )}
        >
          {config.label}
        </span>
      </div>

      <div className="mb-1 flex items-end justify-between">
        <p className="text-xl font-bold">{formatValue(kpi.currentValue)}</p>
        <div className="flex items-center gap-1 text-xs text-secondary-foreground">
          {kpi.trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-[#22c55e]" />
          ) : kpi.trend === "down" ? (
            <TrendingDown className="h-3 w-3 text-[#ef4444]" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          <span
            className={cn(
              kpi.changePercent > 0
                ? "text-[#22c55e]"
                : kpi.changePercent < 0
                  ? "text-[#ef4444]"
                  : "text-secondary-foreground",
            )}
          >
            {kpi.changePercent > 0 ? "+" : ""}
            {kpi.changePercent}%
          </span>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all", config.barColor)}
          style={{ width: `${Math.min(progressPct, 100)}%` }}
        />
      </div>

      <p className="mt-1 text-xs text-secondary-foreground">
        Target: {formatValue(kpi.targetValue)}
      </p>
    </div>
  );
}
