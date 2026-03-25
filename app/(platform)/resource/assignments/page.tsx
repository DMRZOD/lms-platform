"use client";

import { useState } from "react";
import { AlertTriangle, Plus, X } from "lucide-react";
import { FilterBar } from "@/components/resource/filter-bar";
import { StatusBadge } from "@/components/resource/status-badge";
import { EmptyState } from "@/components/resource/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAssignments,
  mockTeachers,
  mockWorkload,
  type AssignmentStatus,
  type AssignmentType,
} from "@/constants/resource-mock-data";
import { Briefcase } from "lucide-react";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
];

const TYPE_FILTERS = [
  { label: "All Types", value: "all" },
  { label: "Primary", value: "Primary" },
  { label: "Co-Teaching", value: "CoTeaching" },
  { label: "TA", value: "TA" },
];

const PROGRAMS = ["CS Bachelor's", "Business Bachelor's", "Physics Bachelor's"];
const COURSES = [
  { code: "CS101", name: "Introduction to Programming" },
  { code: "CS301", name: "Algorithms & Data Structures" },
  { code: "CS402", name: "Machine Learning Fundamentals" },
  { code: "MATH101", name: "Calculus I" },
  { code: "MATH201", name: "Linear Algebra" },
  { code: "BUS201", name: "Business Statistics" },
  { code: "BUS301", name: "Marketing Principles" },
  { code: "BUS401", name: "Corporate Finance" },
];
const GROUPS = ["CS-2025-A", "CS-2025-B", "CS-2024-A", "CS-2023-A", "BUS-2024-A", "BUS-2024-B", "BUS-2023-A", "BUS-2022-A"];

export default function AssignmentsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Modal form state
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [assignType, setAssignType] = useState<AssignmentType>("Primary");
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-06-30");

  const filtered = mockAssignments.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (
      search &&
      !a.teacherName.toLowerCase().includes(search.toLowerCase()) &&
      !a.course.toLowerCase().includes(search.toLowerCase()) &&
      !a.courseCode.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const teacherWorkload = mockWorkload.find((w) => w.teacherId === selectedTeacher);
  const isOverloaded = teacherWorkload?.status === "Overloaded";

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setShowModal(false);
    // In production: call API
  }

  return (
    <div>
      <PageHeader
        title="Assignments"
        description="Manage teacher assignments to programs, courses, and groups."
      />

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Assignment
        </button>
      </div>

      {/* Type filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              typeFilter === f.value
                ? "bg-foreground text-background"
                : "border border-border bg-background text-foreground hover:bg-secondary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <FilterBar
        filters={STATUS_FILTERS}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by teacher or course..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No assignments found"
          description="Try adjusting your filters or create a new assignment."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="px-4 py-2.5 text-left font-medium">Teacher</th>
                <th className="px-4 py-2.5 text-left font-medium">Course</th>
                <th className="px-4 py-2.5 text-left font-medium">Program</th>
                <th className="px-4 py-2.5 text-left font-medium">Group</th>
                <th className="px-4 py-2.5 text-left font-medium">Type</th>
                <th className="px-4 py-2.5 text-left font-medium">Period</th>
                <th className="px-4 py-2.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{a.teacherName}</td>
                  <td className="px-4 py-3">
                    <p>{a.course}</p>
                    <p className="text-xs text-secondary-foreground">{a.courseCode}</p>
                  </td>
                  <td className="px-4 py-3 text-secondary-foreground">{a.program}</td>
                  <td className="px-4 py-3 text-secondary-foreground">{a.group}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.type as AssignmentType} />
                  </td>
                  <td className="px-4 py-3 text-xs text-secondary-foreground">
                    {a.startDate} — {a.endDate}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status as AssignmentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-secondary-foreground">
        Showing {filtered.length} of {mockAssignments.length} assignments
      </p>

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Create Assignment</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Teacher picker */}
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Teacher <span className="text-[#ef4444]">*</span>
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select teacher…</option>
                  {mockTeachers
                    .filter((t) => t.status === "Verified" || t.status === "Active")
                    .map((t) => {
                      const wl = mockWorkload.find((w) => w.teacherId === t.id);
                      return (
                        <option key={t.id} value={t.id}>
                          {t.name} — {t.department}
                          {wl ? ` (${wl.lectureHoursWeek}h/wk)` : ""}
                        </option>
                      );
                    })}
                </select>
                {selectedTeacher && teacherWorkload && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${isOverloaded ? "bg-[#ef4444]" : "bg-[#22c55e]"}`}
                        style={{
                          width: `${Math.min((teacherWorkload.lectureHoursWeek / teacherWorkload.maxWorkloadHours) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-secondary-foreground">
                      {teacherWorkload.lectureHoursWeek}/{teacherWorkload.maxWorkloadHours}h
                    </span>
                    <StatusBadge status={teacherWorkload.status} />
                  </div>
                )}
              </div>

              {/* Overload warning */}
              {isOverloaded && (
                <div className="flex items-start gap-2 rounded-md border border-[#fef3c7] bg-[#fffbeb] px-3 py-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#d97706]" />
                  <p className="text-xs text-[#92400e]">
                    This teacher is currently overloaded. Adding more courses may affect
                    teaching quality. Proceed with caution.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Program</label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">Select program…</option>
                    {PROGRAMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Course <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">Select course…</option>
                    {COURSES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Group <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">Select group…</option>
                    {GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Type</label>
                  <select
                    value={assignType}
                    onChange={(e) => setAssignType(e.target.value as AssignmentType)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="Primary">Primary</option>
                    <option value="CoTeaching">Co-Teaching</option>
                    <option value="TA">Teaching Assistant (TA)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <p className="text-xs text-secondary-foreground">
                Access to the selected course/group will be granted automatically upon
                creation.
              </p>

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
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
