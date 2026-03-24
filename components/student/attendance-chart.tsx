import type { CourseAttendanceSummary } from "@/types/student";
import { cn } from "@/lib/utils";

type AttendanceChartProps = {
  courses: CourseAttendanceSummary[];
};

export function AttendanceChart({ courses }: AttendanceChartProps) {
  return (
    <div className="space-y-4">
      {courses.map((course) => {
        const isBelowThreshold = course.rate < course.threshold;
        const isAtThreshold = course.rate === course.threshold;
        return (
          <div key={course.courseId}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">{course.courseName}</span>
              <span
                className={cn(
                  "font-semibold",
                  isBelowThreshold
                    ? "text-red-600"
                    : isAtThreshold
                      ? "text-amber-600"
                      : "text-foreground",
                )}
              >
                {course.rate}%
              </span>
            </div>
            <div className="relative h-2.5 w-full rounded-full bg-secondary">
              <div
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  isBelowThreshold
                    ? "bg-red-500"
                    : isAtThreshold
                      ? "bg-amber-500"
                      : "bg-foreground",
                )}
                style={{ width: `${course.rate}%` }}
              />
              <div
                className="absolute top-0 h-2.5 w-px bg-amber-400"
                style={{ left: `${course.threshold}%` }}
                title={`Threshold: ${course.threshold}%`}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-secondary-foreground">
              <span>
                {course.attended} present · {course.missed} absent{course.late > 0 ? ` · ${course.late} late` : ""}
              </span>
              <span>Min: {course.threshold}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
