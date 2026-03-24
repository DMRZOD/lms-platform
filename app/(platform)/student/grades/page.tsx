"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { GradeBreakdown } from "@/components/student/grade-breakdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockGrades, mockStudentProfile } from "@/constants/student-mock-data";
import { BarChart3 } from "lucide-react";

const letterGradeColors: Record<string, string> = {
  A: "text-green-700",
  "A-": "text-green-600",
  "B+": "text-blue-600",
  B: "text-blue-500",
  "B-": "text-blue-400",
  "C+": "text-amber-600",
  C: "text-amber-500",
  F: "text-red-600",
};

export default function GradesPage() {
  const profile = mockStudentProfile;

  const semesterGPA =
    mockGrades
      .filter((g) => ["crs-001", "crs-002", "crs-003", "crs-004"].includes(g.courseId))
      .reduce((sum, g) => sum + g.gpaPoints * g.credits, 0) /
    mockGrades
      .filter((g) => ["crs-001", "crs-002", "crs-003", "crs-004"].includes(g.courseId))
      .reduce((sum, g) => sum + g.credits, 0);

  const completedCourses = mockGrades.filter((g) => g.courseId === "crs-005").length;

  return (
    <div>
      <PageHeader title="Grades" description="Your academic performance overview" />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Cumulative GPA" value={profile.gpa.toFixed(2)} icon={BarChart3} />
        <StatCard
          label="Semester GPA"
          value={semesterGPA.toFixed(2)}
          icon={BarChart3}
          subtitle="Spring 2026"
        />
        <StatCard
          label="Credits"
          value={`${profile.earnedCredits}/${profile.totalCredits}`}
          icon={BarChart3}
        />
        <StatCard label="Completed" value={completedCourses} icon={BarChart3} subtitle="Courses" />
      </div>

      <SectionCard title="Course Grades">
        <Accordion type="multiple" className="space-y-2">
          {mockGrades.map((grade) => (
            <AccordionItem
              key={grade.courseId}
              value={grade.courseId}
              className="rounded-lg border border-border px-4"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex w-full items-center justify-between gap-4 pr-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-left font-semibold">{grade.courseName}</p>
                      <p className="text-left text-xs text-secondary-foreground">
                        {grade.courseCode} · {grade.credits} credits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-secondary-foreground">{grade.totalScore}/100</span>
                    <span
                      className={`text-lg font-bold ${letterGradeColors[grade.letterGrade] ?? "text-foreground"}`}
                    >
                      {grade.letterGrade}
                    </span>
                    <span className="text-sm text-secondary-foreground">{grade.gpaPoints.toFixed(1)} GPA</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <GradeBreakdown
                  items={grade.items}
                  totalScore={grade.totalScore}
                  letterGrade={grade.letterGrade}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionCard>
    </div>
  );
}
