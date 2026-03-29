"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { LectureCard } from "@/components/student/lecture-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { studentApi } from "@/lib/student-api";
import type { ApiCourse, ApiModule, ApiLecture } from "@/lib/student-api";
import Link from "next/link";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse]     = useState<ApiCourse | null>(null);
  const [modules, setModules]   = useState<ApiModule[]>([]);
  const [lectures, setLectures] = useState<ApiLecture[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const id = Number(courseId);
      const [courseRes, modulesRes, lecturesRes] = await Promise.allSettled([
        studentApi.getCourse(id),
        studentApi.getCourseModules(id),
        studentApi.getCourseLectures(id),
      ]);
      if (courseRes.status === "fulfilled")   setCourse(courseRes.value);
      if (modulesRes.status === "fulfilled")  setModules(Array.isArray(modulesRes.value) ? modulesRes.value : []);
      if (lecturesRes.status === "fulfilled") setLectures(Array.isArray(lecturesRes.value) ? lecturesRes.value : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load course");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  if (error || !course) {
    return (
        <div className="py-12 text-center">
          <p className="text-secondary-foreground">{error ?? "Course not found."}</p>
          <Link href="/student/courses" className="mt-2 text-sm underline">
            Back to courses
          </Link>
        </div>
    );
  }

  return (
      <div>
        <div className="mb-2">
          <Link href="/student/courses" className="text-sm text-secondary-foreground hover:text-foreground">
            ← Back to courses
          </Link>
        </div>
        <PageHeader
            title={course.title}
            description={course.teacherName ?? ""}
        />

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Credits"    value={String(course.credits ?? "—")} />
          <StatCard label="Language"   value={course.language ?? "—"} />
          <StatCard label="Modules"    value={String(modules.length)} />
          <StatCard label="Lectures"   value={String(lectures.length)} />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules ({modules.length})</TabsTrigger>
            <TabsTrigger value="lectures">Lectures ({lectures.length})</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <SectionCard title="Course Overview">
              {course.description ? (
                  <p className="text-sm leading-relaxed text-secondary-foreground">
                    {course.description}
                  </p>
              ) : (
                  <p className="text-sm text-secondary-foreground">No description available.</p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {course.teacherName && (
                    <div>
                      <p className="text-xs text-secondary-foreground">Teacher</p>
                      <p className="font-medium">{course.teacherName}</p>
                    </div>
                )}
                {course.language && (
                    <div>
                      <p className="text-xs text-secondary-foreground">Language</p>
                      <p className="font-medium">{course.language}</p>
                    </div>
                )}
                <div>
                  <p className="text-xs text-secondary-foreground">Status</p>
                  <p className="font-medium">{course.status}</p>
                </div>
                {course.credits && (
                    <div>
                      <p className="text-xs text-secondary-foreground">Credits</p>
                      <p className="font-medium">{course.credits}</p>
                    </div>
                )}
              </div>
            </SectionCard>
          </TabsContent>

          {/* Modules */}
          <TabsContent value="modules">
            <SectionCard title="Course Modules">
              {modules.length === 0 ? (
                  <p className="text-sm text-secondary-foreground">No modules defined for this course.</p>
              ) : (
                  <div className="space-y-3">
                    {modules.map((mod) => (
                        <div key={mod.id} className="rounded-lg border border-border p-4">
                          <p className="font-medium">{mod.title}</p>
                          {mod.description && (
                              <p className="mt-1 text-sm text-secondary-foreground">{mod.description}</p>
                          )}
                        </div>
                    ))}
                  </div>
              )}
            </SectionCard>
          </TabsContent>

          {/* Lectures */}
          <TabsContent value="lectures">
            <SectionCard title="Lectures">
              {lectures.length === 0 ? (
                  <p className="text-sm text-secondary-foreground">No lectures available.</p>
              ) : (
                  <div className="space-y-3">
                    {lectures.map((lecture) => (
                        <div key={lecture.id} className="rounded-lg border border-border p-4">
                          <p className="font-medium">{lecture.title}</p>
                          {lecture.description && (
                              <p className="mt-1 text-sm text-secondary-foreground line-clamp-2">
                                {lecture.description}
                              </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary-foreground">
                            {lecture.date && <span>📅 {lecture.date}</span>}
                            {lecture.startTime && <span>🕐 {lecture.startTime} – {lecture.endTime}</span>}
                            {lecture.status && <span>Status: {lecture.status}</span>}
                          </div>
                          {lecture.meetingUrl && (
                            <a
                              href={lecture.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-block rounded-md bg-foreground px-3 py-1 text-xs text-background hover:opacity-90"
                            >
                            Join Meeting
                            </a>
                            )}
                        </div>
                    ))}
                  </div>
              )}
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
  );
}