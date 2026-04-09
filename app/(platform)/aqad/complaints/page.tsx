"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquareWarning, X } from "lucide-react";
import { EmptyState } from "@/components/aqad/empty-state";
import { FilterBar } from "@/components/aqad/filter-bar";
import { SectionCard } from "@/components/aqad/section-card";
import { SLAIndicator } from "@/components/aqad/sla-indicator";
import { StatCard } from "@/components/aqad/stat-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { apiClient } from "@/lib/api-client";


interface ApiComplaint {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  lectureId: number | null;
  category: string;
  description: string;
  status: string;
  attachments: string[];
  resolutionNotes: string | null;
  createdAt: string;
  updatedAt: string;
  anonymous: boolean;
}

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
  last: boolean;
}


const STATUS_FILTERS = [
  { label: "All",        value: "all" },
  { label: "Submitted",  value: "SUBMITTED" },
  { label: "In Review",  value: "IN_REVIEW" },
  { label: "Resolved",   value: "RESOLVED" },
];

const CATEGORY_LABELS: Record<string, string> = {
  COURSE_QUALITY:   "Content Quality",
  TEACHER_BEHAVIOR: "Teacher Behavior",
  TECHNICAL:        "Technical",
  EXAM:             "Exam",
  OTHER:            "Other",
};

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-[#fef9c3] text-[#854d0e]",
  IN_REVIEW: "bg-[#eff6ff] text-[#1d4ed8]",
  RESOLVED:  "bg-[#dcfce7] text-[#166534]",
};

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}


export default function ComplaintsPage() {
  const [complaints, setComplaints]   = useState<ApiComplaint[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch]           = useState("");
  const [selectedId, setSelectedId]   = useState<number | null>(null);

  const [updatingId, setUpdatingId]   = useState<number | null>(null);
  const [newStatus, setNewStatus]     = useState("");
  const [notes, setNotes]             = useState("");

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<PagedResponse<ApiComplaint>>(
          "/api/v1/aqad/complaints?page=0&size=100"
      );
      const arr = Array.isArray(data)
          ? data
          : (data as PagedResponse<ApiComplaint>).content ?? [];
      setComplaints(arr);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleUpdateStatus = async (id: number) => {
    if (!newStatus) return;
    setUpdatingId(id);
    try {
      await apiClient.patch(`/api/v1/aqad/complaints/${id}/status`, {
        status: newStatus,
        notes,
      });
      setComplaints((prev) =>
          prev.map((c) =>
              c.id === id ? { ...c, status: newStatus, resolutionNotes: notes } : c
          )
      );
      setSelectedId(null);
      setNewStatus("");
      setNotes("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchesFilter = activeFilter === "all" || c.status === activeFilter;
    const matchesSearch =
        c.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
        (!c.anonymous && c.studentName?.toLowerCase().includes(search.toLowerCase())) ||
        String(c.id).includes(search);
    return matchesFilter && matchesSearch;
  });

  const submitted = complaints.filter((c) => c.status === "SUBMITTED").length;
  const inReview  = complaints.filter((c) => c.status === "IN_REVIEW").length;
  const resolved  = complaints.filter((c) => c.status === "RESOLVED").length;

  const selected = complaints.find((c) => c.id === selectedId);

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={fetchComplaints} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        <PageHeader
            title="Complaints"
            description={`${complaints.length} total complaints`}
        />

        <div className="mb-6 grid grid-cols-3 gap-4">
          <StatCard label="Submitted" value={loading ? "—" : String(submitted)} icon={MessageSquareWarning} subtitle="Awaiting triage"    accent={submitted > 0 ? "warning" : "default"} />
          <StatCard label="In Review" value={loading ? "—" : String(inReview)}  icon={MessageSquareWarning} subtitle="Under investigation" />
          <StatCard label="Resolved"  value={loading ? "—" : String(resolved)}  icon={MessageSquareWarning} subtitle="This semester"       accent="success" />
        </div>

        <FilterBar
            filters={STATUS_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search by student, course, ID…"
        />

        {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
        ) : filtered.length === 0 ? (
            <EmptyState icon={MessageSquareWarning} title="No complaints found" description="Try adjusting your filters." />
        ) : (
            <div className="overflow-hidden rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                  <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                    <th className="px-4 py-2.5 text-left font-medium">ID</th>
                    <th className="px-4 py-2.5 text-left font-medium">Student / Course</th>
                    <th className="px-4 py-2.5 text-left font-medium">Category</th>
                    <th className="px-4 py-2.5 text-left font-medium">Submitted</th>
                    <th className="px-4 py-2.5 text-center font-medium">Status</th>
                    <th className="px-4 py-2.5 text-center font-medium" />
                  </tr>
                  </thead>
                  <tbody>
                  {filtered.map((c) => (
                      <tr
                          key={c.id}
                          className={`border-b last:border-b-0 hover:bg-secondary/30 ${selectedId === c.id ? "bg-secondary/50" : ""}`}
                      >
                        <td className="px-4 py-3 font-mono text-xs">#{c.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">
                            {c.anonymous ? "Anonymous" : c.studentName}
                          </p>
                          <p className="text-xs text-secondary-foreground">{c.courseTitle}</p>
                        </td>
                        <td className="px-4 py-3">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                        {CATEGORY_LABELS[c.category] ?? c.category}
                      </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-secondary-foreground">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status] ?? "bg-secondary text-foreground"}`}>
                        {c.status.replace("_", " ")}
                      </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                              onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
                              className="rounded-md border px-2.5 py-1 text-xs hover:bg-secondary"
                          >
                            {selectedId === c.id ? "Close" : "View"}
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}

        {/* Detail Panel */}
        {selected && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <SectionCard
                    title={`Complaint #${selected.id}`}
                    action={
                      <button onClick={() => setSelectedId(null)}>
                        <X className="h-4 w-4" />
                      </button>
                    }
                >
                  <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-secondary/30 p-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-secondary-foreground">Student</p>
                      <p className="text-sm font-medium">
                        {selected.anonymous ? "Anonymous" : selected.studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-foreground">Course</p>
                      <p className="text-sm font-medium">{selected.courseTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-foreground">Category</p>
                      <p className="text-sm font-medium">
                        {CATEGORY_LABELS[selected.category] ?? selected.category}
                      </p>
                    </div>
                  </div>

                  <p className="mb-1 text-xs font-medium text-secondary-foreground">Description</p>
                  <p className="mb-4 text-sm">{selected.description}</p>

                  {selected.resolutionNotes && (
                      <div className="rounded-lg bg-secondary/30 p-3">
                        <p className="mb-1 text-xs font-medium text-secondary-foreground">Resolution Notes</p>
                        <p className="text-sm">{selected.resolutionNotes}</p>
                      </div>
                  )}

                  {selected.attachments?.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-medium text-secondary-foreground">Attachments</p>
                        <div className="flex flex-wrap gap-2">
                          {selected.attachments.map((att, i) => (
                              <span key={i} className="rounded-md border bg-secondary px-3 py-1 text-xs">
                        {att}
                      </span>
                          ))}
                        </div>
                      </div>
                  )}
                </SectionCard>

                {/* Update Status */}
                {selected.status !== "RESOLVED" && (
                    <SectionCard title="Update Status">
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium">New Status</label>
                          <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                          >
                            <option value="">Select status…</option>
                            <option value="SUBMITTED">Submitted</option>
                            <option value="IN_REVIEW">In Review</option>
                            <option value="RESOLVED">Resolved</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium">Resolution Notes</label>
                          <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Add notes about the resolution…"
                              rows={3}
                              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                              disabled={!newStatus || updatingId === selected.id}
                              onClick={() => handleUpdateStatus(selected.id)}
                              className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 disabled:opacity-50"
                          >
                            {updatingId === selected.id ? "Updating…" : "Update Status"}
                          </button>
                        </div>
                      </div>
                    </SectionCard>
                )}
              </div>

              {/* Info sidebar */}
              <SectionCard title="Details">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Status</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[selected.status] ?? "bg-secondary"}`}>
                  {selected.status.replace("_", " ")}
                </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Submitted</span>
                    <span>{formatDate(selected.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Updated</span>
                    <span>{formatDate(selected.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Anonymous</span>
                    <span>{selected.anonymous ? "Yes" : "No"}</span>
                  </div>
                </div>
              </SectionCard>
            </div>
        )}
      </div>
  );
}