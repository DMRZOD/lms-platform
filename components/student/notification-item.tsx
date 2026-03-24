import type { StudentNotification } from "@/types/student";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  Info,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NotificationItemProps = {
  notification: StudentNotification;
  onMarkRead?: (id: string) => void;
};

const typeConfig: Record<string, { icon: React.ElementType; className: string }> = {
  lecture: { icon: Calendar, className: "bg-blue-50 text-blue-600" },
  assignment: { icon: BookOpen, className: "bg-amber-50 text-amber-600" },
  grade: { icon: BarChart3, className: "bg-green-50 text-green-600" },
  exam: { icon: BookOpen, className: "bg-purple-50 text-purple-600" },
  finance: { icon: CreditCard, className: "bg-red-50 text-red-600" },
  attendance: { icon: UserCheck, className: "bg-orange-50 text-orange-600" },
  system: { icon: Info, className: "bg-secondary text-secondary-foreground" },
  access: { icon: AlertCircle, className: "bg-red-50 text-red-600" },
};

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const config = typeConfig[notification.type] ?? typeConfig.system;
  const Icon = config.icon;

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg p-3 transition-colors",
        notification.read ? "opacity-70" : "bg-secondary/50",
        notification.actionHref && "cursor-pointer hover:bg-secondary",
      )}
      onClick={() => !notification.read && onMarkRead?.(notification.id)}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", config.className)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
          {!notification.read && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-secondary-foreground line-clamp-2">{notification.message}</p>
        <p className="mt-1 text-xs text-secondary-foreground">
          {new Date(notification.timestamp).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );

  if (notification.actionHref) {
    return <Link href={notification.actionHref}>{content}</Link>;
  }
  return content;
}
