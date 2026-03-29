"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiCourse, ApiModule } from "@/lib/teacher-api";
import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

const DELIVERY_MODES = ["TEAMS", "OFFLINE", "HYBRID"];

function CreateLectureContent() {
  const { courseId }   = useParams<{ courseId: string }>();
  const searchParams   = useSearchParams();
  const router         = useRouter();
  const numCourseId    = Number(courseId);
  const defaultModuleId = searchParams.get("moduleId");

  const [course, setCourse]   = useState<ApiCourse | null>(null);
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdTitle, setCreatedTitle] = useState("");

  const [form, setForm] = useState({
    moduleId:        defaultModuleId ?? "",
    title:           "",
    topic:           "",
    outline:         "",
    learningOutcomes: "",
    scheduledStart:  "",
    scheduledEnd:    "",
    deliveryMode:    "TEAMS",
    recordingLink:   "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [courseRes, modulesRes] = await Promise.allSettled([
        teacherApi.getCourse(numCourseId),
        teacherApi.getCourseModules(numCourseId),
      ]);
      if (courseRes.status === "fulfilled")   setCourse(courseRes.value);
      if (modulesRes.status === "fulfilled")  {
        const d = modulesRes.value;
        const arr = Array.isArray(d) ? d : [];
        setModules(arr);
        if (!form.moduleId && arr.length > 0) {
          setForm((prev) => ({ ...prev, moduleId: String(arr[0].id) }));
        }
      }
    } finally {
      setLoading(false);
    }
  }, [numCourseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const missingFields: string[] = [];
  if (!form.moduleId)         missingFields.push("Module");
  if (!form.title.trim())     missingFields.push("Title");
  if (!form.topic.trim())     missingFields.push("Topic");
  if (!form.scheduledStart)   missingFields.push("Start time");
  if (!form.scheduledEnd)     missingFields.push("End time");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (missingFields.length > 0) return;
    setSaving(true);
    setError(null);
    try {
      await teacherApi.createLecture(Number(form.moduleId), {
        title:            form.title.trim(),
        topic:            form.topic.trim(),
        outline:          form.outline.trim(),
        learningOutcomes: form.learningOutcomes.trim(),
        scheduledStart:   new Date(form.scheduledStart).toISOString(),
        scheduledEnd:     new Date(form.scheduledEnd).toISOString(),
        deliveryMode:     form.deliveryMode,
        recordingLink:    form.recordingLink.trim() || undefined,
      });
      setCreatedTitle(form.title);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create lecture");
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7]">
            <svg className="h-8 w-8 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Lecture Created!</h2>
          <p className="mt-2 text-sm text-secondary-foreground">
            <span className="font-medium">&ldquo;{createdTitle}&rdquo;</span> has been added.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
                href={`/teacher/courses/${courseId}/modules`}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Back to Modules
            </Link>
            <button
                onClick={() => {
                  setSuccess(false);
                  setForm({
                    moduleId: defaultModuleId ?? (modules[0] ? String(modules[0].id) : ""),
                    title: "", topic: "", outline: "", learningOutcomes: "",
                    scheduledStart: "", scheduledEnd: "", deliveryMode: "TEAMS", recordingLink: "",
                  });
                }}
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Add Another Lecture
            </button>
          </div>
        </div>
    );
  }

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />)}
        </div>
    );
  }

  return (
      <div>
        <Link
            href={`/teacher/courses/${courseId}/modules`}
            className="mb-4 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Modules
        </Link>

        <div className="mb-6">
          <PageHeader title="Create Lecture" description={`${course?.title ?? ""}`} />
        </div>

        {missingFields.length > 0 && (
            <div className="mb-6 rounded-lg border border-[#fde68a] bg-[#fef9c3] p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#92400e]" />
                <p className="text-sm font-medium text-[#92400e]">
                  Required: {missingFields.join(", ")}
                </p>
              </div>
            </div>
        )}

        {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-lg border border-border bg-background p-5 space-y-4">
            <h2 className="font-semibold">Lecture Information</h2>

            {modules.length > 0 && (
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Module <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                      value={form.moduleId}
                      onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  >
                    <option value="">Select module...</option>
                    {modules.map((m) => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Title <span className="text-[#ef4444]">*</span>
              </label>
              <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Introduction to Binary Search Trees"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Topic <span className="text-[#ef4444]">*</span>
              </label>
              <input
                  type="text"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  placeholder="e.g. Binary Search Trees"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Lecture Outline</label>
              <textarea
                  value={form.outline}
                  onChange={(e) => setForm({ ...form, outline: e.target.value })}
                  rows={4}
                  placeholder="1. Introduction&#10;2. Key concepts&#10;3. Examples&#10;4. Practice"
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Learning Outcomes</label>
              <textarea
                  value={form.learningOutcomes}
                  onChange={(e) => setForm({ ...form, learningOutcomes: e.target.value })}
                  rows={3}
                  placeholder="What students will learn from this lecture..."
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-lg border border-border bg-background p-5 space-y-4">
            <h2 className="font-semibold">Schedule & Delivery</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Start Date & Time <span className="text-[#ef4444]">*</span>
                </label>
                <input
                    type="datetime-local"
                    value={form.scheduledStart}
                    onChange={(e) => setForm({ ...form, scheduledStart: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  End Date & Time <span className="text-[#ef4444]">*</span>
                </label>
                <input
                    type="datetime-local"
                    value={form.scheduledEnd}
                    onChange={(e) => setForm({ ...form, scheduledEnd: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Delivery Mode</label>
              <select
                  value={form.deliveryMode}
                  onChange={(e) => setForm({ ...form, deliveryMode: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              >
                {DELIVERY_MODES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Recording Link</label>
              <input
                  type="url"
                  value={form.recordingLink}
                  onChange={(e) => setForm({ ...form, recordingLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link
                href={`/teacher/courses/${courseId}/modules`}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </Link>
            <button
                type="submit"
                disabled={saving || missingFields.length > 0}
                className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
            >
              {saving ? "Creating..." : "Create Lecture"}
            </button>
          </div>
        </form>
      </div>
  );
}

export default function CreateLecturePage() {
  return (
      <Suspense fallback={<div className="h-8 w-8 animate-pulse rounded-md bg-secondary" />}>
        <CreateLectureContent />
      </Suspense>
  );
}