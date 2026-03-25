"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Download,
  Star,
  Upload,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/resource/empty-state";
import { FilterBar } from "@/components/resource/filter-bar";
import { StatusBadge } from "@/components/resource/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockTeachers,
  type TeacherStatus,
  type ResourceTeacher,
} from "@/constants/resource-mock-data";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Verified", value: "Verified" },
  { label: "Active", value: "Active" },
  { label: "Suspended", value: "Suspended" },
];

const DEPARTMENTS = [
  { label: "All Departments", value: "all" },
  { label: "Computer Science", value: "Computer Science" },
  { label: "Mathematics", value: "Mathematics" },
  { label: "English", value: "English" },
  { label: "Business", value: "Business" },
  { label: "Physics", value: "Physics" },
  { label: "Psychology", value: "Psychology" },
];

const WORKLOAD_FILTERS = [
  { label: "All", value: "all" },
  { label: "Overloaded", value: "Overloaded" },
  { label: "Normal", value: "Normal" },
  { label: "Underloaded", value: "Underloaded" },
];

type SortKey = "name" | "lectureHoursWeek" | "kpiScore" | "registeredAt";

function getWorkloadStatus(t: ResourceTeacher) {
  if (t.lectureHoursWeek === 0) return "Underloaded";
  if (t.lectureHoursWeek > t.maxWorkloadHours) return "Overloaded";
  if (t.lectureHoursWeek >= t.maxWorkloadHours * 0.85) return "High";
  return "Normal";
}

function SortBtn({ col, onSort }: { col: SortKey; onSort: (col: SortKey) => void }) {
  return (
    <button
      onClick={() => onSort(col)}
      className="inline-flex items-center gap-0.5 hover:text-foreground"
    >
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

export default function TeachersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [workloadFilter, setWorkloadFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = mockTeachers
    .filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (deptFilter !== "all" && t.department !== deptFilter) return false;
      if (workloadFilter !== "all" && getWorkloadStatus(t) !== workloadFilter) return false;
      if (
        search &&
        !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.email.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "lectureHoursWeek") cmp = a.lectureHoursWeek - b.lectureHoursWeek;
      else if (sortKey === "kpiScore") cmp = a.kpiScore - b.kpiScore;
      else if (sortKey === "registeredAt")
        cmp = new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
      return sortAsc ? cmp : -cmp;
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div>
      <PageHeader
        title="Teachers"
        description="Registry of all teachers in the Resource Department"
      />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <select
            value={workloadFilter}
            onChange={(e) => setWorkloadFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
          >
            {WORKLOAD_FILTERS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label === "All" ? "All Workloads" : w.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary">
            <Download className="h-4 w-4" />
            Export
          </button>
          <Link
            href="/resource/teachers/import"
            className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary"
          >
            <Upload className="h-4 w-4" />
            Import
          </Link>
          <Link
            href="/resource/teachers/register"
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" />
            Register Teacher
          </Link>
        </div>
      </div>

      <FilterBar
        filters={STATUS_FILTERS}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by name or email..."
      />

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No teachers found"
          description="Try adjusting your filters or register a new teacher."
          action={
            <Link
              href="/resource/teachers/register"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
            >
              Register Teacher
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="px-4 py-2.5 text-left font-medium">
                  <span className="flex items-center gap-1">
                    Name <SortBtn col="name" onSort={toggleSort} />
                  </span>
                </th>
                <th className="px-4 py-2.5 text-left font-medium">Department</th>
                <th className="px-4 py-2.5 text-left font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Courses</th>
                <th className="px-4 py-2.5 text-right font-medium">Students</th>
                <th className="px-4 py-2.5 text-right font-medium">
                  <span className="flex items-center justify-end gap-1">
                    Hrs/wk <SortBtn col="lectureHoursWeek" onSort={toggleSort} />
                  </span>
                </th>
                <th className="px-4 py-2.5 text-right font-medium">
                  <span className="flex items-center justify-end gap-1">
                    KPI <SortBtn col="kpiScore" onSort={toggleSort} />
                  </span>
                </th>
                <th className="px-4 py-2.5 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-secondary-foreground">{t.email}</p>
                  </td>
                  <td className="px-4 py-3 text-secondary-foreground">{t.department}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status as TeacherStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">{t.coursesCount}</td>
                  <td className="px-4 py-3 text-right">{t.studentsCount}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={
                        t.lectureHoursWeek > t.maxWorkloadHours
                          ? "font-medium text-[#dc2626]"
                          : ""
                      }
                    >
                      {t.lectureHoursWeek}h
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {t.kpiScore > 0 ? (
                      <span className="flex items-center justify-end gap-1">
                        <Star className="h-3.5 w-3.5 text-[#f59e0b]" />
                        {t.kpiScore}
                      </span>
                    ) : (
                      <span className="text-secondary-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/resource/teachers/${t.id}`}
                        className="text-xs text-secondary-foreground underline hover:text-foreground"
                      >
                        View
                      </Link>
                      {t.status === "Pending" && (
                        <Link
                          href={`/resource/teachers/${t.id}/verify`}
                          className="text-xs font-medium text-[#1e40af] underline hover:opacity-80"
                        >
                          Verify
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-secondary-foreground">
        Showing {filtered.length} of {mockTeachers.length} teachers
      </p>
    </div>
  );
}
