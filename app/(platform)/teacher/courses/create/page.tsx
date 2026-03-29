"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/platform/page-header";
import { teacherApi } from "@/lib/teacher-api";
import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

const LEVELS    = ["beginner", "intermediate", "advanced"];
const LANGUAGES = ["English", "Russian", "Uzbek"];

export default function CreateCoursePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title:           "",
    description:     "",
    language:        "English",
    level:           "intermediate",
    learningOutcomes: "",
    prerequisites:   "",
    gradingPolicy:   "",
  });

  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const missingFields: string[] = [];
  if (!form.title.trim())           missingFields.push("Title");
  if (!form.description.trim())     missingFields.push("Description");
  if (!form.learningOutcomes.trim()) missingFields.push("Learning Outcomes");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (missingFields.length > 0) return;
    setSaving(true);
    setError(null);
    try {
      const course = await teacherApi.createCourse({
        title:            form.title.trim(),
        description:      form.description.trim(),
        language:         form.language,
        level:            form.level,
        learningOutcomes: form.learningOutcomes.trim(),
        prerequisites:    form.prerequisites.trim(),
        gradingPolicy:    form.gradingPolicy.trim(),
      });
      router.push(`/teacher/courses/${course.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
      <div>
        <Link
            href="/teacher/courses"
            className="mb-4 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Courses
        </Link>

        <div className="mb-6">
          <PageHeader title="Create Course" description="Fill in the required information" />
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
            <h2 className="font-semibold">Basic Information</h2>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Title <span className="text-[#ef4444]">*</span>
              </label>
              <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Algorithms & Data Structures"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description <span className="text-[#ef4444]">*</span>
              </label>
              <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Brief course description..."
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Language</label>
                <select
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                >
                  {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Level</label>
                <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                >
                  {LEVELS.map((l) => (
                      <option key={l} value={l} className="capitalize">{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="rounded-lg border border-border bg-background p-5 space-y-4">
            <h2 className="font-semibold">Academic Information</h2>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Learning Outcomes <span className="text-[#ef4444]">*</span>
              </label>
              <textarea
                  value={form.learningOutcomes}
                  onChange={(e) => setForm({ ...form, learningOutcomes: e.target.value })}
                  rows={4}
                  placeholder="List the key learning outcomes students will achieve..."
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Prerequisites</label>
              <textarea
                  value={form.prerequisites}
                  onChange={(e) => setForm({ ...form, prerequisites: e.target.value })}
                  rows={2}
                  placeholder="List any required prior knowledge..."
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Grading Policy</label>
              <textarea
                  value={form.gradingPolicy}
                  onChange={(e) => setForm({ ...form, gradingPolicy: e.target.value })}
                  rows={3}
                  placeholder="Describe the grading breakdown (e.g. 30% assignments, 40% exam...)"
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link
                href="/teacher/courses"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </Link>
            <button
                type="submit"
                disabled={saving || missingFields.length > 0}
                className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
            >
              {saving ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
  );
}