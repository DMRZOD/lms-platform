import { AlertTriangle, Info, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AlertBannerProps = {
  type: "warning" | "danger" | "info";
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

const variants = {
  warning: {
    container: "bg-[#fef3c7] border-[#fde68a]",
    icon: "text-[#d97706]",
    title: "text-[#92400e]",
    text: "text-[#78350f]",
    action: "text-[#d97706] hover:text-[#92400e]",
    Icon: AlertTriangle,
  },
  danger: {
    container: "bg-[#fee2e2] border-[#fecaca]",
    icon: "text-[#dc2626]",
    title: "text-[#7f1d1d]",
    text: "text-[#7f1d1d]",
    action: "text-[#dc2626] hover:text-[#7f1d1d]",
    Icon: XCircle,
  },
  info: {
    container: "bg-[#dbeafe] border-[#bfdbfe]",
    icon: "text-[#2563eb]",
    title: "text-[#1e3a8a]",
    text: "text-[#1e40af]",
    action: "text-[#2563eb] hover:text-[#1e3a8a]",
    Icon: Info,
  },
};

export function AlertBanner({
  type,
  title,
  message,
  actionHref,
  actionLabel,
  className,
}: AlertBannerProps) {
  const v = variants[type];
  return (
    <div
      className={cn(
        "mb-4 flex items-start gap-3 rounded-lg border p-4",
        v.container,
        className,
      )}
    >
      <v.Icon className={cn("mt-0.5 h-4 w-4 shrink-0", v.icon)} />
      <div className="flex-1">
        <p className={cn("text-sm font-semibold", v.title)}>{title}</p>
        <p className={cn("mt-0.5 text-sm", v.text)}>{message}</p>
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className={cn("shrink-0 text-sm font-medium underline-offset-2 hover:underline", v.action)}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
