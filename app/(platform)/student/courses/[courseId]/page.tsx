"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { LectureCard } from "@/components/student/lecture-card";
import { AssignmentCard } from "@/components/student/assignment-card";
import { ExamCard } from "@/components/student/exam-card";
import { GradeBreakdown } from "@/components/student/grade-breakdown";
import { AttendanceChart } from "@/components/student/attendance-chart";
import { StudentStatusBadge } from "@/components/student/student-status-badge";
import {
  mockCourses,
  mockLectures,
  mockAssignments,
  mockExams,
  mockGrades,
  mockCourseAttendance,
  mockAttendanceRecords,
  mockStudentProfile,
} from "@/constants/student-mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { StudentStatusBadge as ModuleStatusBadge } from "@/components/student/student-status-badge";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = mockCourses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="py-12 text-center">
        <p className="text-secondary-foreground">Course not found.</p>
        <Link href="/student/courses" className="mt-2 text-sm underline">
          Back to courses
        </Link>
      </div>
    );
  }

  const courseLectures = mockLectures.filter((l) => l.courseId === courseId);
  const courseAssignments = mockAssignments.filter((a) => a.courseId === courseId);
  const courseExams = mockExams.filter((e) => e.courseId === courseId);
  const courseGrade = mockGrades.find((g) => g.courseId === courseId);
  const courseAttendance = mockCourseAttendance.find((ca) => ca.courseId === courseId);
  const courseAttendanceRecords = mockAttendanceRecords.filter((ar) => ar.courseId === courseId);
  const { accessStatus } = mockStudentProfile;

  return (
    <div>
      <div className="mb-2">
        <Link href="/student/courses" className="text-sm text-secondary-foreground hover:text-foreground">
          ← Back to courses
        </Link>
      </div>
      <PageHeader title={course.name} description={`${course.code} · ${course.teacherName}`} />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Progress" value={`${course.progress}%`} />
        <StatCard label="Grade" value={course.currentGrade ?? "N/A"} subtitle={course.currentScore !== undefined ? `${course.currentScore}/100` : undefined} />
        <StatCard label="Attendance" value={`${course.attendanceRate}%`} />
        <StatCard label="Credits" value={course.credits} />
      </div>

      <Tabs defaultValue="syllabus">
        <TabsList className="mb-6 w-full flex-wrap">
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        {/* Syllabus */}
        <TabsContent value="syllabus">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SectionCard title="Course Overview">
              <p className="text-sm leading-relaxed text-secondary-foreground">{course.description}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="w-24 shrink-0 text-secondary-foreground">Language</span>
                  <span>{course.language}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-24 shrink-0 text-secondary-foreground">Category</span>
                  <span>{course.category}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-24 shrink-0 text-secondary-foreground">Schedule</span>
                  <span>{course.schedule}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-24 shrink-0 text-secondary-foreground">Teacher</span>
                  <span>{course.teacherName}</span>
                </div>
              </div>
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mt-4">
                  <p className="mb-1 text-sm font-medium">Prerequisites</p>
                  <ul className="space-y-1">
                    {course.prerequisites.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-secondary-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Grading Policy">
              <div className="space-y-2">
                {course.gradingPolicy.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border border-border px-4 py-2.5 text-sm">
                    <div>
                      <p className="font-medium">{item.type}</p>
                      {item.description && <p className="text-xs text-secondary-foreground">{item.description}</p>}
                    </div>
                    <span className="font-bold">{item.weight}%</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Modules */}
        <TabsContent value="modules">
          <SectionCard title="Course Modules">
            {course.modules.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No modules defined for this course.</p>
            ) : (
              <Accordion type="multiple" className="space-y-2">
                {course.modules.map((mod) => {
                  const modLectures = courseLectures.filter((l) => l.moduleId === mod.id);
                  return (
                    <AccordionItem key={mod.id} value={mod.id} className="rounded-lg border border-border px-4">
                      <AccordionTrigger className="py-3 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{mod.name}</span>
                          <ModuleStatusBadge status={mod.status} />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        {mod.description && (
                          <p className="mb-3 text-sm text-secondary-foreground">{mod.description}</p>
                        )}
                        {modLectures.length === 0 ? (
                          <p className="text-sm text-secondary-foreground">No lectures in this module yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {modLectures.map((l) => (
                              <LectureCard key={l.id} lecture={l} showCourse={false} />
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </SectionCard>
        </TabsContent>

        {/* Assignments */}
        <TabsContent value="assignments">
          <SectionCard title="Assignments">
            {courseAssignments.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No assignments for this course.</p>
            ) : (
              <div className="space-y-3">
                {courseAssignments.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} />
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* Exams */}
        <TabsContent value="exams">
          <SectionCard title="Exams">
            {courseExams.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No exams scheduled.</p>
            ) : (
              <div className="space-y-4">
                {courseExams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    accessStatus={accessStatus}
                    showEligibility
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance">
          <div className="space-y-6">
            {courseAttendance && (
              <SectionCard title="Attendance Summary">
                <AttendanceChart courses={[courseAttendance]} />
              </SectionCard>
            )}
            <SectionCard title="Attendance History">
              {courseAttendanceRecords.length === 0 ? (
                <p className="text-sm text-secondary-foreground">No attendance records yet.</p>
              ) : (
                <div className="space-y-2">
                  {courseAttendanceRecords.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between rounded-md border border-border px-4 py-2.5">
                      <div>
                        <p className="text-sm font-medium">{rec.lectureTitle}</p>
                        <p className="text-xs text-secondary-foreground">
                          {new Date(rec.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
                          {rec.joinTime && ` · Joined ${rec.joinTime}`}
                          {rec.duration !== undefined && ` · ${rec.duration} min`}
                        </p>
                      </div>
                      <StudentStatusBadge status={rec.status} />
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </TabsContent>

        {/* Grades */}
        <TabsContent value="grades">
          <SectionCard title="Grade Breakdown">
            {courseGrade ? (
              <GradeBreakdown
                items={courseGrade.items}
                totalScore={courseGrade.totalScore}
                letterGrade={courseGrade.letterGrade}
              />
            ) : (
              <p className="text-sm text-secondary-foreground">No grades available yet.</p>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
