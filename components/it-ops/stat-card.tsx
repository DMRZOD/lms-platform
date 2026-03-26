import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  subtitle?: string;
  className?: string;
  accent?: "default" | "warning" | "danger" | "success" | "info";
};

const accentClasses: Record<string, string> = {
  default: "",
  warning: "border-l-4 border-l-[#f59e0b]",
  danger: "border-l-4 border-l-[#ef4444]",
  success: "border-l-4 border-l-[#22c55e]",
  info: "border-l-4 border-l-[#3b82f6]",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  className,
  accent = "default",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-5",
        accentClasses[accent],
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-secondary-foreground" />}
        <p className="text-sm text-secondary-foreground">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-secondary-foreground">{subtitle}</p>
      )}
    </div>
  );
}
