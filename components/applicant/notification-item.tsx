import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types/applicant";
import {
  Bell,
  FileText,
  GraduationCap,
  Info,
  Scale,
} from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  status_change: Bell,
  document: FileText,
  exam: GraduationCap,
  appeal: Scale,
  general: Info,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US");
}

export function NotificationItem({
  notification,
  className,
}: {
  notification: AppNotification;
  className?: string;
}) {
  const Icon = typeIcons[notification.type] ?? Info;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border border-border p-4 transition-colors",
        !notification.read && "bg-secondary/50",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          !notification.read ? "bg-foreground/10" : "bg-secondary",
        )}
      >
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm",
              !notification.read ? "font-semibold" : "font-medium",
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="mt-0.5 text-sm text-secondary-foreground">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-secondary-foreground">
          {timeAgo(notification.timestamp)}
        </p>
      </div>
    </div>
  );
}
