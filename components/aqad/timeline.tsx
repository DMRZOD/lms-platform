import { cn } from "@/lib/utils";

type TimelineItem = {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  actor?: string;
  type?: "default" | "success" | "warning" | "danger";
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

const dotStyles = {
  default: "bg-[#e3e3e3]",
  success: "bg-[#22c55e]",
  warning: "bg-[#f59e0b]",
  danger: "bg-[#ef4444]",
};

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                dotStyles[item.type ?? "default"],
              )}
            />
            {index < items.length - 1 && (
              <div className="w-px flex-1 bg-border" />
            )}
          </div>
          <div className={cn("pb-5", index === items.length - 1 && "pb-0")}>
            <p className="text-sm font-medium">{item.title}</p>
            {item.description && (
              <p className="mt-0.5 text-sm text-secondary-foreground">
                {item.description}
              </p>
            )}
            <div className="mt-1 flex items-center gap-2 text-xs text-secondary-foreground">
              {item.actor && <span>{item.actor}</span>}
              {item.actor && <span>·</span>}
              <span>{formatDate(item.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
