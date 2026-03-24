"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Users } from "lucide-react";
import { EmptyState } from "@/components/academic/empty-state";
import { FilterBar } from "@/components/academic/filter-bar";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockPrograms } from "@/constants/academic-mock-data";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Draft", value: "Draft" },
  { label: "Archived", value: "Archived" },
  { label: "Suspended", value: "Suspended" },
];

const LANGUAGES = ["All", "English", "Russian", "Kazakh"];

export default function ProgramsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");

  const filtered = mockPrograms.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.status === activeFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.faculty.toLowerCase().includes(search.toLowerCase());
    const matchesLang = language === "All" || p.language === language;
    return matchesFilter && matchesSearch && matchesLang;
  });

  const active = mockPrograms.filter((p) => p.status === "Active").length;
  const totalStudents = mockPrograms.reduce((s, p) => s + p.studentCount, 0);
  const accredited = mockPrograms.filter((p) => p.accredited).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <PageHeader title="Programs" description="Manage all academic programs and their curricula" />
        <Link
          href="/academic/programs/create"
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Program
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Programs" value={mockPrograms.length} icon={BookOpen} />
        <StatCard label="Active" value={active} accent="success" />
        <StatCard label="Total Students" value={totalStudents.toLocaleString()} icon={Users} />
        <StatCard label="Accredited" value={`${accredited}/${mockPrograms.length}`} />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Search programs..."
          className="mb-0 flex-1"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
        >
          {LANGUAGES.map((l) => <option key={l} value={l}>{l === "All" ? "All Languages" : l}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No programs found"
          description="Adjust filters or create a new program."
          action={
            <Link
              href="/academic/programs/create"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Create Program
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((program) => (
            <Link
              key={program.id}
              href={`/academic/programs/${program.id}`}
              className="block rounded-lg border border-border bg-background p-5 transition-colors hover:bg-secondary/50"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <p className="font-mono text-xs text-secondary-foreground">{program.code}</p>
                    {program.accredited && (
                      <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs font-medium text-[#16a34a]">
                        Accredited
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold leading-tight line-clamp-2">{program.name}</h3>
                </div>
                <StatusBadge status={program.status} />
              </div>
              <p className="mb-3 text-xs text-secondary-foreground">{program.faculty}</p>
              <div className="grid grid-cols-4 gap-2 border-t border-border pt-3 text-center">
                <div>
                  <p className="font-bold">{program.groupCount}</p>
                  <p className="text-xs text-secondary-foreground">Groups</p>
                </div>
                <div>
                  <p className="font-bold">{program.studentCount}</p>
                  <p className="text-xs text-secondary-foreground">Students</p>
                </div>
                <div>
                  <p className="font-bold">{program.totalCredits}</p>
                  <p className="text-xs text-secondary-foreground">Credits</p>
                </div>
                <div>
                  <p className="font-bold">{program.durationSemesters / 2}y</p>
                  <p className="text-xs text-secondary-foreground">Duration</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-secondary-foreground">{program.degree} · {program.language}</span>
                <span className="text-xs text-secondary-foreground">Min attendance: {program.minAttendance}%</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
