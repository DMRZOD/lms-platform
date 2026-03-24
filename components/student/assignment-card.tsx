import type { Assignment } from "@/types/student";
import { BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StudentStatusBadge } from "./student-status-badge";

type AssignmentCardProps = {
  assignment: Assignment;
};

function getTimeLeft(dueDate: string): { text: string; urgent: boolean } {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  if (diffMs < 0) return { text: "Overdue", urgent: true };
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (diffDays === 0 && diffHours < 24) return { text: `${diffHours}h left`, urgent: true };
  if (diffDays === 1) return { text: "Tomorrow", urgent: true };
  if (diffDays <= 3) return { text: `${diffDays} days left`, urgent: true };
  return { text: `${diffDays} days left`, urgent: false };
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const timeLeft = getTimeLeft(assignment.dueDate);
  const isGraded = assignment.status === "graded";

  return (
    <Link
      href={`/student/assignments/${assignment.id}`}
      className="block rounded-lg border border-border bg-background p-4 transition-colors hover:bg-secondary"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{assignment.title}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-secondary-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{assignment.courseName}</span>
          </div>
        </div>
        <StudentStatusBadge status={assignment.status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-1 text-secondary-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            Due{" "}
            {new Date(assignment.dueDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        {!isGraded && (
          <span
            className={cn(
              "text-xs font-medium",
              timeLeft.urgent ? "text-red-600" : "text-secondary-foreground",
            )}
          >
            {timeLeft.text}
          </span>
        )}
        {isGraded && assignment.score !== undefined && (
          <span className="text-sm font-semibold">
            {assignment.score}/{assignment.maxScore}
          </span>
        )}
      </div>
      <div className="mt-1 text-xs text-secondary-foreground">Weight: {assignment.weight}%</div>
    </Link>
  );
}
