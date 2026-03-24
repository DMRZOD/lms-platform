import { Clock } from "lucide-react";
import type { AuditTrailEntry } from "@/types/academic";

type AuditTrailProps = {
  entries: AuditTrailEntry[];
};

export function AuditTrail({ entries }: AuditTrailProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-secondary-foreground">No audit entries yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
              <Clock className="h-3.5 w-3.5 text-secondary-foreground" />
            </div>
            {index < entries.length - 1 && (
              <div className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium">{entry.action}</p>
            <p className="mt-0.5 text-sm text-secondary-foreground">
              {entry.details}
            </p>
            <p className="mt-1 text-xs text-secondary-foreground">
              {entry.performedBy} ·{" "}
              {new Date(entry.performedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
