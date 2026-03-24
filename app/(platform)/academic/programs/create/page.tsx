"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/platform/page-header";

const STEPS = ["Program Info", "Curriculum Structure", "Rules & Review"];

type CourseEntry = {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  isElective: boolean;
};

export default function CreateProgramPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Step 1
  const [form, setForm] = useState({
    code: "",
    name: "",
    faculty: "",
    degree: "Bachelor",
    language: "English",
    durationSemesters: "8",
    totalCredits: "240",
    description: "",
    accredited: false,
  });

  // Step 2
  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: "c1", code: "", name: "", credits: 6, semester: 1, isElective: false },
  ]);

  const addCourse = () =>
    setCourses((prev) => [
      ...prev,
      { id: `c${Date.now()}`, code: "", name: "", credits: 6, semester: 1, isElective: false },
    ]);

  const removeCourse = (id: string) =>
    setCourses((prev) => prev.filter((c) => c.id !== id));

  const updateCourse = (id: string, field: keyof CourseEntry, value: unknown) =>
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  // Step 3
  const [rules, setRules] = useState({
    minAttendance: 75,
    minGrade: 50,
    enableProgression: true,
    progressionThreshold: 80,
    enablePrerequisites: true,
  });

  const step1Valid = form.code && form.name && form.faculty;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7]">
          <Check className="h-8 w-8 text-[#16a34a]" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Program Created!</h2>
        <p className="mb-6 text-sm text-secondary-foreground">
          {form.name} has been successfully created with {courses.length} course{courses.length !== 1 ? "s" : ""}.
        </p>
        <div className="flex gap-3">
          <Link href="/academic/programs" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">
            Back to Programs
          </Link>
          <button
            onClick={() => { setDone(false); setStep(0); }}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/academic/programs" className="mb-4 flex items-center gap-1.5 text-sm text-secondary-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Programs
      </Link>
      <PageHeader title="Create Program" description="Define a new academic program with curriculum and rules" />

      {/* Stepper */}
      <div className="mb-8 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                i <= step ? "bg-foreground text-background" : "border border-border text-secondary-foreground"
              }`}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "font-semibold" : "text-secondary-foreground"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="mx-4 h-px w-10 bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1 – Program Info */}
      {step === 0 && (
        <div className="max-w-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Program Code <span className="text-[#dc2626]">*</span></label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. CS-BSC" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Degree</label>
              <select value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                <option>Bachelor</option>
                <option>Master</option>
                <option>PhD</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Program Name <span className="text-[#dc2626]">*</span></label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bachelor of Science in Computer Science" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Faculty <span className="text-[#dc2626]">*</span></label>
            <input value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} placeholder="e.g. Faculty of Engineering & Technology" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Language</label>
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                <option>English</option>
                <option>Russian</option>
                <option>Kazakh</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Semesters</label>
              <input type="number" value={form.durationSemesters} onChange={(e) => setForm({ ...form, durationSemesters: e.target.value })} min={2} max={12} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Total Credits</label>
              <input type="number" value={form.totalCredits} onChange={(e) => setForm({ ...form, totalCredits: e.target.value })} min={60} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief program description..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20" />
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={form.accredited} onChange={(e) => setForm({ ...form, accredited: e.target.checked })} className="h-4 w-4 rounded border-border" />
            <span className="text-sm">This program is accredited</span>
          </label>
          <button disabled={!step1Valid} onClick={() => setStep(1)} className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90">
            Continue →
          </button>
        </div>
      )}

      {/* Step 2 – Curriculum */}
      {step === 1 && (
        <div className="max-w-3xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-secondary-foreground">{courses.length} course{courses.length !== 1 ? "s" : ""} added</p>
            <button onClick={addCourse} className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary">
              <Plus className="h-4 w-4" />
              Add Course
            </button>
          </div>
          <div className="space-y-2">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center gap-2 rounded-lg border border-border p-3">
                <input value={c.code} onChange={(e) => updateCourse(c.id, "code", e.target.value)} placeholder="Code" className="w-20 rounded border border-border bg-background px-2 py-1.5 text-sm focus:outline-none" />
                <input value={c.name} onChange={(e) => updateCourse(c.id, "name", e.target.value)} placeholder="Course name" className="flex-1 rounded border border-border bg-background px-2 py-1.5 text-sm focus:outline-none" />
                <select value={c.semester} onChange={(e) => updateCourse(c.id, "semester", Number(e.target.value))} className="w-24 rounded border border-border bg-background px-2 py-1.5 text-sm focus:outline-none">
                  {Array.from({ length: Number(form.durationSemesters) }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s}>Sem {s}</option>
                  ))}
                </select>
                <input type="number" value={c.credits} onChange={(e) => updateCourse(c.id, "credits", Number(e.target.value))} min={1} max={12} className="w-16 rounded border border-border bg-background px-2 py-1.5 text-sm focus:outline-none" />
                <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                  <input type="checkbox" checked={c.isElective} onChange={(e) => updateCourse(c.id, "isElective", e.target.checked)} className="h-3.5 w-3.5" />
                  Elective
                </label>
                <button onClick={() => removeCourse(c.id)} className="text-secondary-foreground hover:text-[#dc2626]">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(0)} className="rounded-lg border border-border px-5 py-2.5 text-sm hover:bg-secondary">← Back</button>
            <button onClick={() => setStep(2)} className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90">Continue →</button>
          </div>
        </div>
      )}

      {/* Step 3 – Rules & Review */}
      {step === 2 && (
        <div className="max-w-lg space-y-6">
          <div className="rounded-lg border border-border p-5 space-y-4">
            <h3 className="font-semibold">Attendance & Grades</h3>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <label className="font-medium">Minimum Attendance</label>
                <span className="font-bold">{rules.minAttendance}%</span>
              </div>
              <input type="range" min={50} max={100} value={rules.minAttendance} onChange={(e) => setRules({ ...rules, minAttendance: Number(e.target.value) })} className="w-full" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <label className="font-medium">Minimum Grade to Pass</label>
                <span className="font-bold">{rules.minGrade}%</span>
              </div>
              <input type="range" min={30} max={80} value={rules.minGrade} onChange={(e) => setRules({ ...rules, minGrade: Number(e.target.value) })} className="w-full" />
            </div>
          </div>
          <div className="rounded-lg border border-border p-5 space-y-3">
            <h3 className="font-semibold">Progression Rules</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rules.enableProgression} onChange={(e) => setRules({ ...rules, enableProgression: e.target.checked })} className="h-4 w-4 rounded border-border" />
              <span className="text-sm">Enable semester progression requirement</span>
            </label>
            {rules.enableProgression && (
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-secondary-foreground">Must pass % of credits to advance</span>
                  <span className="font-bold">{rules.progressionThreshold}%</span>
                </div>
                <input type="range" min={60} max={100} value={rules.progressionThreshold} onChange={(e) => setRules({ ...rules, progressionThreshold: Number(e.target.value) })} className="w-full" />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rules.enablePrerequisites} onChange={(e) => setRules({ ...rules, enablePrerequisites: e.target.checked })} className="h-4 w-4 rounded border-border" />
              <span className="text-sm">Enforce course prerequisites</span>
            </label>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border bg-secondary/50 p-5">
            <h3 className="mb-3 font-semibold">Review Summary</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-secondary-foreground">Program</span><span className="font-medium">{form.name || "—"}</span></div>
              <div className="flex justify-between"><span className="text-secondary-foreground">Code</span><span className="font-medium">{form.code || "—"}</span></div>
              <div className="flex justify-between"><span className="text-secondary-foreground">Degree</span><span className="font-medium">{form.degree}</span></div>
              <div className="flex justify-between"><span className="text-secondary-foreground">Duration</span><span className="font-medium">{form.durationSemesters} semesters</span></div>
              <div className="flex justify-between"><span className="text-secondary-foreground">Courses</span><span className="font-medium">{courses.length}</span></div>
              <div className="flex justify-between"><span className="text-secondary-foreground">Min Attendance</span><span className="font-medium">{rules.minAttendance}%</span></div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="rounded-lg border border-border px-5 py-2.5 text-sm hover:bg-secondary">← Back</button>
            <button onClick={() => setDone(true)} className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90">Create Program</button>
          </div>
        </div>
      )}
    </div>
  );
}
