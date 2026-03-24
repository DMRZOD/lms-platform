import type { Lecture } from "@/types/student";
import { Calendar, Clock, Radio, User, Video } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StudentStatusBadge } from "./student-status-badge";

type LectureCardProps = {
  lecture: Lecture;
  showCourse?: boolean;
};

export function LectureCard({ lecture, showCourse = true }: LectureCardProps) {
  const isLive = lecture.status === "live";
  const isUpcoming = lecture.status === "upcoming";

  return (
    <Link
      href={`/student/lectures/${lecture.id}`}
      className={cn(
        "block rounded-lg border bg-background p-4 transition-colors hover:bg-secondary",
        isLive ? "border-red-200 bg-red-50 hover:bg-red-100" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              isLive ? "bg-red-100" : "bg-secondary",
            )}
          >
            {isLive ? (
              <Radio className="h-4 w-4 text-red-600" />
            ) : (
              <Video className="h-4 w-4 text-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium leading-tight">{lecture.title}</p>
            {showCourse && (
              <p className="mt-0.5 text-xs text-secondary-foreground">{lecture.courseName}</p>
            )}
          </div>
        </div>
        <StudentStatusBadge status={lecture.status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-foreground">
        <span className="flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          {lecture.teacherName}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(lecture.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {lecture.startTime} – {lecture.endTime}
        </span>
      </div>

      {(isLive || isUpcoming) && lecture.meetingUrl && (
        <div className="mt-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
              isLive
                ? "bg-red-600 text-white"
                : "border border-border bg-background text-foreground",
            )}
          >
            {isLive ? (
              <>
                <Radio className="h-3 w-3" /> Join Now
              </>
            ) : (
              <>
                <Video className="h-3 w-3" /> Join Lecture
              </>
            )}
          </span>
        </div>
      )}

      {lecture.status === "completed" && lecture.attendanceStatus && (
        <div className="mt-3">
          <StudentStatusBadge status={lecture.attendanceStatus} />
        </div>
      )}
    </Link>
  );
}
