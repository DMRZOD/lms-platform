import type { GradeBreakdownItem } from "@/types/student";

type GradeBreakdownProps = {
  items: GradeBreakdownItem[];
  totalScore: number;
  letterGrade: string;
};

const typeLabels: Record<string, string> = {
  assignment: "Assignment",
  midterm: "Midterm",
  final: "Final",
  quiz: "Quiz",
  participation: "Participation",
};

export function GradeBreakdown({ items, totalScore, letterGrade }: GradeBreakdownProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between rounded-md bg-secondary px-4 py-3">
        <span className="text-sm font-medium">Overall Grade</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-secondary-foreground">{totalScore}/100</span>
          <span className="text-lg font-bold">{letterGrade}</span>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-md border border-border px-4 py-2.5 text-sm"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-secondary-foreground">
                {typeLabels[item.type] ?? item.type} · Weight: {item.weight}%
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {item.score}/{item.maxScore}
              </p>
              {item.gradedAt && (
                <p className="text-xs text-secondary-foreground">
                  {new Date(item.gradedAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
