import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-secondary p-4">
        <Icon className="h-8 w-8 text-secondary-foreground" />
      </div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-secondary-foreground">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
