"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PageHeader } from "@/components/platform/page-header";
import { mockPrograms } from "@/constants/academic-mock-data";

const STEPS = ["Group Info", "Assign Students", "Assign Teachers"];

// Mock available students (not yet in a group)
const availableStudents = [
  { id: "s-new-1", name: "Thomas Baker", email: "t.baker@uni.edu", gpa: 3.2 },
  { id: "s-new-2", name: "Nina Kozlov", email: "n.kozlov@uni.edu", gpa: 3.8 },
  { id: "s-new-3", name: "Alex Müller", email: "a.muller@uni.edu", gpa: 2.9 },
  { id: "s-new-4", name: "Fatima Al-Rashid", email: "f.alrashid@uni.edu", gpa: 3.5 },
  { id: "s-new-5", name: "Ivan Petrov", email: "i.petrov@uni.edu", gpa: 2.6 },
  { id: "s-new-6", name: "Ana Lima", email: "a.lima@uni.edu", gpa: 3.1 },
];

const availableTeachers = [
  { id: "t-new-1", name: "Dr. A. Smith", department: "CS" },
  { id: "t-new-2", name: "Prof. B. Jones", department: "CS" },
  { id: "t-new-3", name: "Dr. C. Lee", department: "CS" },
  { id: "t-new-4", name: "Prof. D. Brown", department: "CS" },
];

export default function CreateGroupPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Step 1 state
  const [form, setForm] = useState({
    code: "",
    name: "",
    programId: "",
    year: "1",
    semester: "1",
    intake: "2026",
    advisorId: "",
  });

  // Step 2 state
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState("");

  // Step 3 state
  const [teacherAssignments, setTeacherAssignments] = useState<Record<string, string>>({});

  const filteredStudents = availableStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()),
  );

  const toggleStudent = (id: string) =>
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const step1Valid = form.code && form.name && form.programId;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7]">
          <Check className="h-8 w-8 text-[#16a34a]" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Group Created!</h2>
        <p className="mb-6 text-sm text-secondary-foreground">
          {form.name} has been successfully created with {selectedStudents.length} students.
        </p>
        <div className="flex gap-3">
          <Link
            href="/academic/groups"
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Back to Groups
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
      <Link
        href="/academic/groups"
        className="mb-4 flex items-center gap-1.5 text-sm text-secondary-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Groups
      </Link>
      <PageHeader title="Create Group" description="Set up a new student group for a program" />

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-0">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  i < step
                    ? "bg-foreground text-background"
                    : i === step
                      ? "bg-foreground text-background"
                      : "border border-border text-secondary-foreground"
                }`}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "font-semibold" : "text-secondary-foreground"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="mx-4 h-px w-12 bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1 – Group Info */}
      {step === 0 && (
        <div className="max-w-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Group Code <span className="text-[#dc2626]">*</span></label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. CS-2026-A"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Intake Year</label>
              <input
                value={form.intake}
                onChange={(e) => setForm({ ...form, intake: e.target.value })}
                placeholder="2026"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Group Name <span className="text-[#dc2626]">*</span></label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Computer Science 2026 Group A"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Program <span className="text-[#dc2626]">*</span></label>
            <select
              value={form.programId}
              onChange={(e) => setForm({ ...form, programId: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            >
              <option value="">Select program…</option>
              {mockPrograms.filter((p) => p.status === "Active").map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Year</label>
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              >
                {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Semester</label>
              <select
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Academic Advisor</label>
            <select
              value={form.advisorId}
              onChange={(e) => setForm({ ...form, advisorId: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            >
              <option value="">Select advisor…</option>
              {availableTeachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <button
            disabled={!step1Valid}
            onClick={() => setStep(1)}
            className="mt-2 rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2 – Assign Students */}
      {step === 1 && (
        <div className="max-w-lg">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-secondary-foreground">
              {selectedStudents.length} student{selectedStudents.length !== 1 ? "s" : ""} selected
            </p>
            <input
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search students…"
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <div className="space-y-2">
            {filteredStudents.map((s) => (
              <label
                key={s.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s.id)}
                  onChange={() => toggleStudent(s.id)}
                  className="h-4 w-4 rounded border-border"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-secondary-foreground">{s.email}</p>
                </div>
                <span className="text-sm text-secondary-foreground">GPA {s.gpa.toFixed(1)}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="rounded-lg border border-border px-5 py-2.5 text-sm hover:bg-secondary"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 – Assign Teachers */}
      {step === 2 && (
        <div className="max-w-lg">
          <p className="mb-4 text-sm text-secondary-foreground">
            Assign teachers to courses for this group. You can update assignments later.
          </p>
          <div className="space-y-3">
            {availableTeachers.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-secondary-foreground">{t.department} Dept</p>
                </div>
                <select
                  value={teacherAssignments[t.id] ?? ""}
                  onChange={(e) =>
                    setTeacherAssignments((prev) => ({ ...prev, [t.id]: e.target.value }))
                  }
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none"
                >
                  <option value="">No course</option>
                  <option value="cs101">Introduction to Programming</option>
                  <option value="cs201">Data Structures & Algorithms</option>
                  <option value="cs301">Database Systems</option>
                  <option value="cs401">Machine Learning</option>
                </select>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-lg border border-border px-5 py-2.5 text-sm hover:bg-secondary"
            >
              ← Back
            </button>
            <button
              onClick={() => setDone(true)}
              className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              Create Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
