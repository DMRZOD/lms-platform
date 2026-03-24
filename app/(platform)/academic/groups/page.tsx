"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { EmptyState } from "@/components/academic/empty-state";
import { FilterBar } from "@/components/academic/filter-bar";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockGroups } from "@/constants/academic-mock-data";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Graduated", value: "Graduated" },
  { label: "On Hold", value: "OnHold" },
  { label: "Dissolved", value: "Dissolved" },
];

export default function GroupsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockGroups.filter((g) => {
    const matchesFilter = activeFilter === "all" || g.status === activeFilter;
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.code.toLowerCase().includes(search.toLowerCase()) ||
      g.programName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const active = mockGroups.filter((g) => g.status === "Active").length;
  const graduated = mockGroups.filter((g) => g.status === "Graduated").length;
  const totalStudents = mockGroups.reduce((sum, g) => sum + g.studentCount, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <PageHeader title="Groups" description="Manage all student groups and cohorts" />
        <Link
          href="/academic/groups/create"
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Group
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Groups" value={mockGroups.length} icon={Users} />
        <StatCard label="Active" value={active} accent="success" />
        <StatCard label="Graduated" value={graduated} />
        <StatCard label="Total Students" value={totalStudents.toLocaleString()} />
      </div>

      <FilterBar
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search groups..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No groups found"
          description="Try adjusting your filters or create a new group."
          action={
            <Link
              href="/academic/groups/create"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Create Group
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((group) => (
            <Link
              key={group.id}
              href={`/academic/groups/${group.id}`}
              className="block rounded-lg border border-border bg-background p-5 transition-colors hover:bg-secondary/50"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-secondary-foreground">{group.code}</p>
                  <h3 className="mt-0.5 font-semibold leading-tight">{group.name}</h3>
                </div>
                <StatusBadge status={group.status} />
              </div>
              <p className="mb-3 text-sm text-secondary-foreground">{group.programName}</p>
              <div className="grid grid-cols-3 gap-3 border-t border-border pt-3 text-center">
                <div>
                  <p className="text-lg font-bold">{group.studentCount}</p>
                  <p className="text-xs text-secondary-foreground">Students</p>
                </div>
                <div>
                  <p className="text-lg font-bold">Y{group.year}</p>
                  <p className="text-xs text-secondary-foreground">Year</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{group.intake}</p>
                  <p className="text-xs text-secondary-foreground">Intake</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3">
                <div className="h-5 w-5 rounded-full bg-secondary" />
                <p className="text-xs text-secondary-foreground">{group.advisorName}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
