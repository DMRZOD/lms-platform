import type { Exam } from "@/types/student";
import { BookOpen, Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { StudentStatusBadge } from "./student-status-badge";
import { ExamEligibilityChecklist } from "./exam-eligibility-checklist";
import { Button } from "@/components/ui/button";
import { canTakeExam } from "@/lib/student-access";
import type { AccessStatus } from "@/types/student";

type ExamCardProps = {
  exam: Exam;
  accessStatus?: AccessStatus;
  showEligibility?: boolean;
};

export function ExamCard({ exam, accessStatus = "Active", showEligibility = false }: ExamCardProps) {
  const isCompleted = exam.status === "completed";
  const isEligible = exam.eligibility.isEligible && canTakeExam(accessStatus);

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{exam.title}</p>
            <StudentStatusBadge status={exam.type} />
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-secondary-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{exam.courseName}</span>
          </div>
        </div>
        <StudentStatusBadge status={exam.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-secondary-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(exam.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {exam.startTime} – {exam.endTime}
        </span>
        {exam.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {exam.location}
          </span>
        )}
      </div>

      {showEligibility && !isCompleted && (
        <div className="mt-4 rounded-md border border-border p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
            Eligibility
          </p>
          <ExamEligibilityChecklist eligibility={exam.eligibility} />
        </div>
      )}

      {isCompleted && exam.score !== undefined && (
        <div className="mt-3 rounded-md border border-border p-3 text-sm">
          <span className="text-secondary-foreground">Result: </span>
          <span className="font-bold">
            {exam.score}/{exam.maxScore}
          </span>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {!isCompleted && isEligible && (
          <Link href={`/student/exams/${exam.id}/take`}>
            <Button size="sm">Take Exam</Button>
          </Link>
        )}
        {!isCompleted && !isEligible && (
          <Button size="sm" disabled>
            {canTakeExam(accessStatus) ? "Not Eligible" : "Access Restricted"}
          </Button>
        )}
        {isCompleted && (
          <Button variant="outline" size="sm">
            View Results
          </Button>
        )}
      </div>
    </div>
  );
}
