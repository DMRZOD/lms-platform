"use client";

import { PageHeader } from "@/components/platform/page-header";
import { CourseStatusBadge } from "@/components/teacher/course-status-badge";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type FormData = {
  name: string;
  code: string;
  description: string;
  credits: string;
  language: string;
  difficultyLevel: string;
  learningOutcomes: string[];
  prerequisites: string[];
  assignmentsWeight: number;
  midtermWeight: number;
  finalWeight: number;
  attendanceWeight: number;
  lateSubmissionPolicy: string;
};

const STEPS = ["Course Metadata", "Grading Policy", "Preview & Create"];

export default function CreateCoursePage() {
  const [step, setStep] = useState(0);
  const [created, setCreated] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    code: "",
    description: "",
    credits: "3",
    language: "English",
    difficultyLevel: "intermediate",
    learningOutcomes: [""],
    prerequisites: [""],
    assignmentsWeight: 30,
    midtermWeight: 25,
    finalWeight: 35,
    attendanceWeight: 10,
    lateSubmissionPolicy: "Accepted within 48 hours with 20% penalty",
  });

  const totalWeight =
    form.assignmentsWeight + form.midtermWeight + form.finalWeight + form.attendanceWeight;

  const updateOutcome = (idx: number, value: string) => {
    const next = [...form.learningOutcomes];
    next[idx] = value;
    setForm({ ...form, learningOutcomes: next });
  };

  const updatePrereq = (idx: number, value: string) => {
    const next = [...form.prerequisites];
    next[idx] = value;
    setForm({ ...form, prerequisites: next });
  };

  const isStep1Valid =
    form.name.trim() &&
    form.code.trim() &&
    form.description.trim() &&
    form.learningOutcomes.some((o) => o.trim());

  const isStep2Valid = totalWeight === 100;

  const handleCreate = () => {
    setCreated(true);
  };

  if (created) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7]">
          <svg className="h-8 w-8 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Course Created!</h2>
        <p className="mt-2 text-sm text-secondary-foreground">
          <span className="font-medium">{form.name}</span> has been created with status{" "}
          <CourseStatusBadge status="Draft" className="ml-1" />
        </p>
        <p className="mt-1 text-xs text-secondary-foreground">
          Add modules and lectures, then submit for AQAD review.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/teacher/courses"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            My Courses
          </Link>
          <Link
            href="/teacher/courses"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Open Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/teacher/courses"
          className="mb-2 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Courses
        </Link>
        <PageHeader title="Create New Course" description="Fill in details to create a draft course" />
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  i < step
                    ? "bg-foreground text-background"
                    : i === step
                      ? "border-2 border-foreground bg-background text-foreground"
                      : "border border-border bg-background text-secondary-foreground"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm font-medium ${
                  i === step ? "text-foreground" : "text-secondary-foreground"
                }`}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-4 h-px w-12 ${i < step ? "bg-foreground" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl">
        {/* Step 1: Metadata */}
        {step === 0 && (
          <div className="space-y-5 rounded-lg border border-border bg-background p-6">
            <h2 className="font-semibold">Course Metadata</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Course Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Introduction to Python"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Course Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. CS101"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe the course content and objectives..."
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Credits</label>
                <select
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Language</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                >
                  <option>English</option>
                  <option>Russian</option>
                  <option>Uzbek</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Level</label>
                <select
                  value={form.difficultyLevel}
                  onChange={(e) => setForm({ ...form, difficultyLevel: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Learning Outcomes *</label>
              <div className="space-y-2">
                {form.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => updateOutcome(idx, e.target.value)}
                      placeholder={`Outcome ${idx + 1}`}
                      className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                    />
                    {form.learningOutcomes.length > 1 && (
                      <button
                        onClick={() =>
                          setForm({
                            ...form,
                            learningOutcomes: form.learningOutcomes.filter((_, i) => i !== idx),
                          })
                        }
                        className="rounded-md p-2 text-secondary-foreground hover:text-[#ef4444]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setForm({ ...form, learningOutcomes: [...form.learningOutcomes, ""] })
                }
                className="mt-2 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" /> Add outcome
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Prerequisites</label>
              <div className="space-y-2">
                {form.prerequisites.map((prereq, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={prereq}
                      onChange={(e) => updatePrereq(idx, e.target.value)}
                      placeholder="e.g. CS101 — Introduction to Programming"
                      className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                    />
                    {form.prerequisites.length > 1 && (
                      <button
                        onClick={() =>
                          setForm({
                            ...form,
                            prerequisites: form.prerequisites.filter((_, i) => i !== idx),
                          })
                        }
                        className="rounded-md p-2 text-secondary-foreground hover:text-[#ef4444]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setForm({ ...form, prerequisites: [...form.prerequisites, ""] })}
                className="mt-2 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" /> Add prerequisite
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Grading Policy */}
        {step === 1 && (
          <div className="space-y-5 rounded-lg border border-border bg-background p-6">
            <h2 className="font-semibold">Grading Policy</h2>

            <div className="space-y-4">
              {(
                [
                  ["Assignments", "assignmentsWeight"],
                  ["Midterm Exam", "midtermWeight"],
                  ["Final Exam", "finalWeight"],
                  ["Attendance", "attendanceWeight"],
                ] as [string, keyof FormData][]
              ).map(([label, key]) => (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium">{label}</label>
                    <span className="text-sm font-bold">{form[key as keyof FormData]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={form[key as keyof FormData] as number}
                    onChange={(e) =>
                      setForm({ ...form, [key]: parseInt(e.target.value) })
                    }
                    className="w-full accent-foreground"
                  />
                </div>
              ))}

              <div
                className={`rounded-md p-3 text-sm font-medium ${
                  totalWeight === 100
                    ? "bg-[#dcfce7] text-[#166534]"
                    : "bg-[#fee2e2] text-[#991b1b]"
                }`}
              >
                Total weight: {totalWeight}%{totalWeight !== 100 ? " — must equal 100%" : " ✓"}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Late Submission Policy</label>
              <textarea
                value={form.lateSubmissionPolicy}
                onChange={(e) => setForm({ ...form, lateSubmissionPolicy: e.target.value })}
                rows={2}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium">Grade Scale</h3>
              <div className="overflow-hidden rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="p-2 text-left font-medium">Grade</th>
                      <th className="p-2 text-left font-medium">Min Score</th>
                      <th className="p-2 text-left font-medium">Max Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["A", 90, 100],
                      ["B", 75, 89],
                      ["C", 60, 74],
                      ["D", 50, 59],
                      ["F", 0, 49],
                    ].map(([letter, min, max]) => (
                      <tr key={letter} className="border-t border-border">
                        <td className="p-2 font-semibold">{letter}</td>
                        <td className="p-2 text-secondary-foreground">{min}</td>
                        <td className="p-2 text-secondary-foreground">{max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 2 && (
          <div className="space-y-4 rounded-lg border border-border bg-background p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Course Preview</h2>
              <CourseStatusBadge status="Draft" />
            </div>

            <div className="space-y-3 divide-y divide-border">
              <div className="pb-3">
                <h3 className="text-lg font-bold">{form.name}</h3>
                <p className="text-sm text-secondary-foreground">{form.code}</p>
              </div>
              <div className="py-3">
                <p className="text-sm text-secondary-foreground">{form.description}</p>
              </div>
              <div className="py-3">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-secondary-foreground">Credits</p>
                    <p className="font-medium">{form.credits}</p>
                  </div>
                  <div>
                    <p className="text-secondary-foreground">Language</p>
                    <p className="font-medium">{form.language}</p>
                  </div>
                  <div>
                    <p className="text-secondary-foreground">Level</p>
                    <p className="font-medium capitalize">{form.difficultyLevel}</p>
                  </div>
                </div>
              </div>
              <div className="py-3">
                <p className="mb-2 text-sm font-medium">Learning Outcomes</p>
                <ul className="space-y-1">
                  {form.learningOutcomes.filter(Boolean).map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground">
                      <span className="mt-0.5 text-foreground">•</span> {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="py-3">
                <p className="mb-2 text-sm font-medium">Grading Policy</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md bg-secondary p-2">
                    <p className="text-secondary-foreground">Assignments</p>
                    <p className="font-semibold">{form.assignmentsWeight}%</p>
                  </div>
                  <div className="rounded-md bg-secondary p-2">
                    <p className="text-secondary-foreground">Midterm</p>
                    <p className="font-semibold">{form.midtermWeight}%</p>
                  </div>
                  <div className="rounded-md bg-secondary p-2">
                    <p className="text-secondary-foreground">Final</p>
                    <p className="font-semibold">{form.finalWeight}%</p>
                  </div>
                  <div className="rounded-md bg-secondary p-2">
                    <p className="text-secondary-foreground">Attendance</p>
                    <p className="font-semibold">{form.attendanceWeight}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-[#fecaca] bg-[#fef2f2] p-3 text-xs text-[#991b1b]">
              After creation, add modules and lectures. The course must pass AQAD review before it can be published.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 ? !isStep1Valid : !isStep2Valid}
              className="flex items-center gap-1 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Create Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
