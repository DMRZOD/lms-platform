"use client";

import { Fragment, useState } from "react";
import { ArrowRight, CheckCircle, Clock, Plus, X } from "lucide-react";
import { StatusBadge } from "@/components/resource/status-badge";
import { FilterBar } from "@/components/resource/filter-bar";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockReplacements,
  mockTeachers,
  mockWorkload,
  type ReplacementReason,
  type Replacement,
} from "@/constants/resource-mock-data";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Initiated", value: "Initiated" },
  { label: "In Progress", value: "InProgress" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const REASONS: ReplacementReason[] = [
  "Resignation",
  "Medical Leave",
  "Vacation",
  "Overload",
  "Low Quality",
  "Disciplinary",
];

const COURSES_LIST = [
  "CS101 — Introduction to Programming",
  "CS201 — Cybersecurity Basics",
  "CS301 — Algorithms & Data Structures",
  "CS402 — Machine Learning Fundamentals",
  "MATH101 — Calculus I",
  "MATH201 — Linear Algebra",
  "BUS201 — Business Statistics",
  "BUS301 — Marketing Principles",
  "BUS401 — Corporate Finance",
];

function StepTimeline({ steps }: { steps: Replacement["steps"] }) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              step.status === "Completed"
                ? "bg-[#22c55e]"
                : step.status === "InProgress"
                  ? "bg-[#f59e0b]"
                  : "bg-secondary"
            }`}
          >
            {step.status === "Completed" ? (
              <CheckCircle className="h-3.5 w-3.5 text-white" />
            ) : step.status === "InProgress" ? (
              <Clock className="h-3 w-3 text-white" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-secondary-foreground/30" />
            )}
          </div>
          <div>
            <p
              className={`text-sm ${
                step.status === "Completed"
                  ? "font-medium"
                  : step.status === "InProgress"
                    ? "font-medium text-[#92400e]"
                    : "text-secondary-foreground"
              }`}
            >
              {step.label}
            </p>
            {step.completedAt && (
              <p className="text-xs text-secondary-foreground">{step.completedAt}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReplacementsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal state
  const [currentTeacher, setCurrentTeacher] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [reason, setReason] = useState<ReplacementReason>("Resignation");
  const [effectiveDate, setEffectiveDate] = useState("2026-04-01");
  const [scope, setScope] = useState<"All" | "Specific">("All");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isTemporary, setIsTemporary] = useState(false);
  const [endDate, setEndDate] = useState("2026-05-01");
  const [autoRevert, setAutoRevert] = useState(true);

  const filtered = mockReplacements.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (
      search &&
      !r.currentTeacherName.toLowerCase().includes(search.toLowerCase()) &&
      !r.newTeacherName.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  function toggleCourse(c: string) {
    setSelectedCourses((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setShowModal(false);
  }

  const newTeacherWorkload = mockWorkload.find((w) => w.teacherId === newTeacher);

  return (
    <div>
      <PageHeader
        title="Replacements"
        description="Manage teacher replacement processes — temporary and permanent."
      />

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Initiate Replacement
        </button>
      </div>

      <FilterBar
        filters={STATUS_FILTERS}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by teacher name..."
      />

      {/* Replacements Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary">
              <th className="px-4 py-2.5 text-left font-medium">ID</th>
              <th className="px-4 py-2.5 text-left font-medium">Current Teacher</th>
              <th className="px-4 py-2.5 text-left font-medium">New Teacher</th>
              <th className="px-4 py-2.5 text-left font-medium">Reason</th>
              <th className="px-4 py-2.5 text-left font-medium">Effective Date</th>
              <th className="px-4 py-2.5 text-left font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Courses</th>
              <th className="px-4 py-2.5 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <Fragment key={r.id}>
                <tr
                  className="border-b last:border-b-0 hover:bg-secondary/30"
                >
                  <td className="px-4 py-3 font-mono text-xs text-secondary-foreground">
                    {r.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{r.currentTeacherName}</p>
                    {r.isTemporary && (
                      <span className="text-xs text-secondary-foreground">Temporary</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5 text-secondary-foreground" />
                      {r.newTeacherName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-secondary-foreground">{r.reason}</td>
                  <td className="px-4 py-3 text-secondary-foreground">{r.effectiveDate}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right">{r.courses.length}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === r.id ? null : r.id)
                      }
                      className="text-xs text-secondary-foreground underline hover:text-foreground"
                    >
                      {expandedId === r.id ? "Hide" : "Details"}
                    </button>
                  </td>
                </tr>
                {expandedId === r.id && (
                  <tr key={`${r.id}-detail`} className="border-b bg-secondary/20">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <p className="mb-3 text-xs font-medium uppercase text-secondary-foreground">
                            Replacement Timeline
                          </p>
                          <StepTimeline steps={r.steps} />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="mb-1 text-xs font-medium uppercase text-secondary-foreground">
                              Affected Courses
                            </p>
                            {r.courses.map((c) => (
                              <p key={c} className="text-sm">
                                {c}
                              </p>
                            ))}
                          </div>
                          {r.isTemporary && r.endDate && (
                            <div>
                              <p className="mb-1 text-xs font-medium uppercase text-secondary-foreground">
                                Temporary Period
                              </p>
                              <p className="text-sm">
                                {r.effectiveDate} → {r.endDate}
                                {r.autoRevert && (
                                  <span className="ml-2 text-xs text-[#22c55e]">
                                    Auto-revert enabled
                                  </span>
                                )}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="mb-1 text-xs font-medium uppercase text-secondary-foreground">
                              Initiated
                            </p>
                            <p className="text-sm">
                              {r.initiatedAt} by {r.initiatedBy}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-secondary-foreground">
        Showing {filtered.length} of {mockReplacements.length} replacements
      </p>

      {/* Initiate Replacement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-8">
          <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Initiate Replacement</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Current Teacher <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={currentTeacher}
                    onChange={(e) => setCurrentTeacher(e.target.value)}
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">Select teacher…</option>
                    {mockTeachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Replacement Teacher <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">Select teacher…</option>
                    {mockTeachers
                      .filter(
                        (t) =>
                          t.id !== currentTeacher &&
                          (t.status === "Verified" || t.status === "Active"),
                      )
                      .map((t) => {
                        const wl = mockWorkload.find((w) => w.teacherId === t.id);
                        return (
                          <option key={t.id} value={t.id}>
                            {t.name} — {t.specialization[0]}
                            {wl ? ` (${wl.lectureHoursWeek}h/wk)` : ""}
                          </option>
                        );
                      })}
                  </select>
                  {newTeacherWorkload && (
                    <p className="mt-1 text-xs text-secondary-foreground">
                      Current workload: {newTeacherWorkload.lectureHoursWeek}/
                      {newTeacherWorkload.maxWorkloadHours}h ·{" "}
                      <StatusBadge
                        status={newTeacherWorkload.status}
                        className="text-[10px]!"
                      />
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Reason <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as ReplacementReason)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    {REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Effective Date <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Scope */}
              <div>
                <label className="mb-2 block text-xs font-medium">Scope</label>
                <div className="flex gap-3">
                  {(["All", "Specific"] as const).map((s) => (
                    <label
                      key={s}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 ${
                        scope === s ? "border-foreground bg-secondary" : "border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="scope"
                        value={s}
                        checked={scope === s}
                        onChange={() => setScope(s)}
                        className="sr-only"
                      />
                      <span className="text-sm">{s === "All" ? "All courses" : "Specific courses"}</span>
                    </label>
                  ))}
                </div>
              </div>

              {scope === "Specific" && (
                <div>
                  <label className="mb-2 block text-xs font-medium">Select Courses</label>
                  <div className="max-h-36 space-y-1.5 overflow-y-auto">
                    {COURSES_LIST.map((c) => (
                      <label key={c} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(c)}
                          onChange={() => toggleCourse(c)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <span className="text-sm">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Temporary toggle */}
              <div className="rounded-md border border-border p-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Temporary Replacement</p>
                    <p className="text-xs text-secondary-foreground">
                      For medical leave, vacation, etc. Access is time-limited.
                    </p>
                  </div>
                  <div
                    onClick={() => setIsTemporary((v) => !v)}
                    className={`h-6 w-11 cursor-pointer rounded-full transition-colors ${
                      isTemporary ? "bg-foreground" : "bg-secondary"
                    } relative`}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
                        isTemporary ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>

                {isTemporary && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={autoRevert}
                          onChange={(e) => setAutoRevert(e.target.checked)}
                          className="h-4 w-4 rounded"
                        />
                        <span className="text-sm">Auto-revert on end date</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                >
                  Initiate Replacement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
