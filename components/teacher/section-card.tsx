import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
};

export function SectionCard({ title, children, className, action }: SectionCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-background p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="font-semibold">{title}</h2>}
          {action && <div className="text-sm">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
