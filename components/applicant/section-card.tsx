import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-background p-6", className)}
    >
      {title && <h2 className="mb-4 font-semibold">{title}</h2>}
      {children}
    </div>
  );
}
