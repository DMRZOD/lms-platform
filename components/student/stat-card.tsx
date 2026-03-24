import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  subtitle?: string;
  className?: string;
};

export function StatCard({ label, value, icon: Icon, subtitle, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-background p-5", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-secondary-foreground" />}
        <p className="text-sm text-secondary-foreground">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtitle && <p className="mt-0.5 text-xs text-secondary-foreground">{subtitle}</p>}
    </div>
  );
}
