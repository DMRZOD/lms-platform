import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type QuickActionCardProps = {
  icon: LucideIcon;
  title: string;
  href: string;
  description?: string;
  className?: string;
};

export function QuickActionCard({ icon: Icon, title, href, description, className }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 text-center transition-colors hover:bg-secondary",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-background">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="text-xs text-secondary-foreground">{description}</p>}
    </Link>
  );
}
