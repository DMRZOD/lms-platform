import type { Course } from "@/types/student";
import { BookOpen, User } from "lucide-react";
import Link from "next/link";
import { StudentStatusBadge } from "./student-status-badge";

type CourseCardProps = {
  course: Course;
  blocked?: boolean;
};

export function CourseCard({ course, blocked }: CourseCardProps) {
  return (
    <Link
      href={`/student/courses/${course.id}`}
      className="group block rounded-lg border border-border bg-background p-5 transition-colors hover:bg-secondary"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary group-hover:bg-background">
            <BookOpen className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary-foreground">{course.code}</p>
            <p className="font-semibold leading-tight">{course.name}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <StudentStatusBadge status={course.status} />
          {blocked && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              Read-only
            </span>
          )}
        </div>
      </div>

      <div className="mb-3 flex items-center gap-1.5 text-sm text-secondary-foreground">
        <User className="h-3.5 w-3.5" />
        <span>{course.teacherName}</span>
      </div>

      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-secondary-foreground">Progress</span>
        <span className="font-medium">{course.progress}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div
          className="h-1.5 rounded-full bg-foreground"
          style={{ width: `${course.progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-secondary-foreground">
          {course.completedLectures}/{course.totalLectures} lectures
        </span>
        {course.currentGrade && (
          <span className="font-semibold">{course.currentGrade}</span>
        )}
      </div>
    </Link>
  );
}
