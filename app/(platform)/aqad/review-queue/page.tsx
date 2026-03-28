"use client";

import { useState, useEffect, useCallback } from "react";
import { ClipboardList, Plus, UserCheck } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/aqad/empty-state";
import { FilterBar } from "@/components/aqad/filter-bar";
import { PriorityBadge } from "@/components/aqad/priority-badge";
import { StatCard } from "@/components/aqad/stat-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { apiClient } from "@/lib/api-client";
import type { Priority } from "@/types/aqad";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiReview {
  id: number;
  courseId: number;
  courseTitle: string;
  reviewerId: number;
  reviewerName: string;
  status: string;
  checklist: {
    learningoutcomesDefined: boolean;
    assessmentAlignedWithOutcomes: boolean;
    materialsUploaded: boolean;
    gradingWeightsDefined: boolean;
    attendancePolicyDefined: boolean;
    academicIntegrityStatementPresent: boolean;
  };
  createdAt: string;
  closedAt: string | null;
  decision: {
    id: number;
    decisionType: string;
    reasonCode: string;
    notes: string;
    conditions: string[];
    deadline: string;
    adminOverride: boolean;
  } | null;
}

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
}

const FILTERS = [
  { label: "All",          value: "all" },
  { label: "Open",         value: "OPEN" },
  { label: "In Progress",  value: "IN_PROGRESS" },
  { label: "Closed",       value: "CLOSED" },
];

const SLA_THRESHOLD = 7;

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function getDaysInQueue(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewQueuePage() {
  const [reviews, setReviews]         = useState<ApiReview[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch]           = useState("");

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<PagedResponse<ApiReview>>(
          "/api/v1/aqad/reviews/queue?page=0&size=100"
      );
      const arr = Array.isArray(data)
          ? data
          : (data as PagedResponse<ApiReview>).content ?? [];
      setReviews(arr);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load review queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const filtered = reviews.filter((r) => {
    const matchesFilter = activeFilter === "all" || r.status === activeFilter;
    const matchesSearch =
        r.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
        r.reviewerName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openCount       = reviews.filter((r) => r.status === "OPEN").length;
  const unassignedCount = reviews.filter((r) => !r.reviewerId).length;
  const overSLA         = reviews.filter((r) => getDaysInQueue(r.createdAt) >= SLA_THRESHOLD).length;

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={fetchQueue} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        <div className="mb-6 flex items-start justify-between">
          <PageHeader
              title="Review Queue"
              description={`${reviews.length} courses awaiting AQAD review`}
          />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total in Queue" value={loading ? "—" : String(reviews.length)} icon={ClipboardList} subtitle="Awaiting review" />
          <StatCard label="Open"           value={loading ? "—" : String(openCount)}       icon={ClipboardList} subtitle="Not yet started" accent={openCount > 3 ? "danger" : "warning"} />
          <StatCard label="Unassigned"     value={loading ? "—" : String(unassignedCount)} icon={UserCheck}     subtitle="No reviewer assigned" accent={unassignedCount > 0 ? "warning" : "default"} />
          <StatCard label="Over SLA"       value={loading ? "—" : String(overSLA)}         icon={ClipboardList} subtitle={`>${SLA_THRESHOLD} days in queue`} accent={overSLA > 0 ? "danger" : "default"} />
        </div>

        <FilterBar
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search by course or reviewer…"
        />

        {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
        ) : filtered.length === 0 ? (
            <EmptyState
                icon={ClipboardList}
                title="No courses found"
                description="Try adjusting your filters or search term."
            />
        ) : (
            <div className="overflow-hidden rounded-lg border">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 border-b bg-secondary px-4 py-2.5 text-xs font-medium text-secondary-foreground">
                <span>Course</span>
                <span>Submitted</span>
                <span>Status</span>
                <span>Reviewer</span>
                <span>Actions</span>
              </div>

              {/* Rows */}
              {filtered.map((review) => {
                const daysInQueue = getDaysInQueue(review.createdAt);
                return (
                    <div
                        key={review.id}
                        className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-secondary/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{review.courseTitle}</p>
                        <p className="text-xs text-secondary-foreground">
                          Review #{review.id}
                        </p>
                        {daysInQueue >= SLA_THRESHOLD && (
                            <span className="mt-0.5 inline-flex items-center rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs text-[#dc2626]">
                      SLA exceeded
                    </span>
                        )}
                      </div>

                      <span className="text-xs text-secondary-foreground whitespace-nowrap">
                  {formatDate(review.createdAt)}
                        <br />
                  <span className="text-secondary-foreground">{daysInQueue}d ago</span>
                </span>

                      <StatusBadge status={review.status} />

                      <span className="min-w-[100px] text-xs">
                  {review.reviewerName ?? (
                      <span className="italic text-secondary-foreground">Unassigned</span>
                  )}
                </span>

                      <Link
                          href={`/aqad/review/${review.id}`}
                          className="rounded-md bg-foreground px-3 py-1 text-xs text-background hover:opacity-90 whitespace-nowrap"
                      >
                        Start Review
                      </Link>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}