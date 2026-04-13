"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { studentApi } from "@/lib/student-api";
import type { ApiGrade, ApiStudentProgram } from "@/lib/student-api";
import { BarChart3 } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const LETTER_COLORS: Record<string, string> = {
  "A":  "text-green-700",
  "A-": "text-green-600",
  "B+": "text-blue-600",
  "B":  "text-blue-500",
  "B-": "text-blue-400",
  "C+": "text-amber-600",
  "C":  "text-amber-500",
  "F":  "text-red-600",
};

function scoreBar(score: number, max: number) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  const color = pct >= 90 ? "bg-green-500" : pct >= 75 ? "bg-blue-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";
  return { pct, color };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GradesPage() {
  const [grades, setGrades]   = useState<ApiGrade[]>([]);
  const [program, setProgram] = useState<ApiStudentProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [gradesRes, programRes] = await Promise.allSettled([
        studentApi.getMyGrades(),
        studentApi.getProgram(),
      ]);
      if (gradesRes.status  === "fulfilled") setGrades(Array.isArray(gradesRes.value) ? gradesRes.value : []);
      if (programRes.status === "fulfilled") setProgram(programRes.value);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load grades");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Computed stats ──
  const totalCredits   = grades.reduce((s, g) => s + (g.credits ?? 0), 0);
  const earnedCredits  = program?.earnedCredits ?? totalCredits;
  const cumulativeGPA  = program?.gpa?.toFixed(2) ?? "—";

  const semesterGPA = grades.length > 0
      ? (
          grades.reduce((s, g) => s + (g.gpaPoints ?? 0) * (g.credits ?? 1), 0) /
          grades.reduce((s, g) => s + (g.credits ?? 1), 0)
      ).toFixed(2)
      : "—";

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={fetchData} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        <PageHeader title="Grades" description="Your academic performance overview" />

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Cumulative GPA" value={loading ? "—" : cumulativeGPA}    icon={BarChart3} />
          <StatCard label="Semester GPA"   value={loading ? "—" : semesterGPA}      icon={BarChart3} subtitle="Current semester" />
          <StatCard label="Credits"         value={loading ? "—" : `${earnedCredits}/${program?.totalCredits ?? "—"}`} icon={BarChart3} />
          <StatCard label="Courses"         value={loading ? "—" : String(grades.length)} icon={BarChart3} subtitle="With grades" />
        </div>

        {/* Grade list */}
        {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
        ) : grades.length === 0 ? (
            <SectionCard>
              <p className="py-8 text-center text-sm text-secondary-foreground">No grades available yet.</p>
            </SectionCard>
        ) : (
            <SectionCard title="Course Grades">
              <Accordion type="multiple" className="space-y-2">
                {grades.map((grade) => {
                  const { pct, color } = scoreBar(grade.totalScore ?? 0, 100);
                  return (
                      <AccordionItem
                          key={grade.courseId}
                          value={String(grade.courseId)}
                          className="rounded-lg border border-border px-4"
                      >
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex w-full items-center justify-between gap-4 pr-2">
                            <div>
                              <p className="text-left font-semibold">
                                {grade.courseTitle ?? `Course #${grade.courseId}`}
                              </p>
                              <p className="text-left text-xs text-secondary-foreground">
                                {grade.courseCode ? `${grade.courseCode} · ` : ""}
                                {grade.credits ? `${grade.credits} credits` : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                        <span className="text-sm text-secondary-foreground">
                          {grade.totalScore ?? "—"}/100
                        </span>
                              {grade.letterGrade && (
                                  <span className={`text-lg font-bold ${LETTER_COLORS[grade.letterGrade] ?? "text-foreground"}`}>
                            {grade.letterGrade}
                          </span>
                              )}
                              {grade.gpaPoints !== undefined && (
                                  <span className="text-sm text-secondary-foreground">
                            {grade.gpaPoints.toFixed(1)} GPA
                          </span>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pb-4">
                          {/* Score bar */}
                          {grade.totalScore !== undefined && (
                              <div className="mb-4">
                                <div className="mb-1 flex justify-between text-xs text-secondary-foreground">
                                  <span>Overall Score</span>
                                  <span>{pct}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                          )}

                          {/* Grade items */}
                          {grade.items && grade.items.length > 0 ? (
                              <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-border">
                                  <th className="pb-2 text-left font-medium text-secondary-foreground">Item</th>
                                  <th className="pb-2 text-right font-medium text-secondary-foreground">Weight</th>
                                  <th className="pb-2 text-right font-medium text-secondary-foreground">Score</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                {grade.items.map((item) => (
                                    <tr key={item.id}>
                                      <td className="py-2">
                                        <p className="font-medium">{item.name}</p>
                                        {item.type && (
                                            <p className="text-xs text-secondary-foreground capitalize">{item.type}</p>
                                        )}
                                      </td>
                                      <td className="py-2 text-right text-secondary-foreground">
                                        {item.weight !== undefined ? `${item.weight}%` : "—"}
                                      </td>
                                      <td className="py-2 text-right font-semibold">
                                        {item.score !== undefined
                                            ? `${item.score}${item.maxScore !== undefined ? `/${item.maxScore}` : ""}`
                                            : "—"}
                                      </td>
                                    </tr>
                                ))}
                                </tbody>
                              </table>
                          ) : (
                              <p className="text-sm text-secondary-foreground">No grade breakdown available.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                  );
                })}
              </Accordion>
            </SectionCard>
        )}
      </div>
  );
}
