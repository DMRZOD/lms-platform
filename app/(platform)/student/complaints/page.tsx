"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquareWarning, Plus, X } from "lucide-react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { FilterBar } from "@/components/student/filter-bar";
import { EmptyState } from "@/components/student/empty-state";
import { studentApi } from "@/lib/student-api";

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface ApiCourse {
    id: number;
    title: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = [
    { label: "All",        value: "all" },
    { label: "Submitted",  value: "SUBMITTED" },
    { label: "In Review",  value: "IN_REVIEW" },
    { label: "Resolved",   value: "RESOLVED" },
];

const CATEGORY_OPTIONS = [
    { label: "Course Quality",    value: "COURSE_QUALITY" },
    { label: "Teacher Behavior",  value: "TEACHER_BEHAVIOR" },
    { label: "Technical",         value: "TECHNICAL" },
    { label: "Exam",              value: "EXAM" },
    { label: "Other",             value: "OTHER" },
];

const CATEGORY_LABELS: Record<string, string> = {
    COURSE_QUALITY:   "Course Quality",
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentComplaintsPage() {
    const [complaints, setComplaints]     = useState<ApiComplaint[]>([]);
    const [courses, setCourses]           = useState<ApiCourse[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch]             = useState("");
    const [selectedId, setSelectedId]     = useState<number | null>(null);
    const [showCreate, setShowCreate]     = useState(false);

    // ── Create form state ──
    const [newCourseId, setNewCourseId]       = useState("");
    const [newCategory, setNewCategory]       = useState("COURSE_QUALITY");
    const [newDescription, setNewDescription] = useState("");
    const [newAnonymous, setNewAnonymous]     = useState(false);
    const [submitting, setSubmitting]         = useState(false);
    const [submitError, setSubmitError]       = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess]   = useState(false);

    // ── Fetch complaints ──
    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await studentApi.getMyComplaints() as
                | ApiComplaint[]
                | { content: ApiComplaint[] };
            const arr = Array.isArray(data)
                ? data
                : (data as { content: ApiComplaint[] }).content ?? [];
            setComplaints(arr);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load complaints");
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Fetch courses for dropdown ──
    const fetchCourses = useCallback(async () => {
        try {
            const data = await studentApi.getCourses() as
                | ApiCourse[]
                | { content: ApiCourse[] };
            const arr = Array.isArray(data)
                ? data
                : (data as { content: ApiCourse[] }).content ?? [];
            setCourses(arr);
        } catch {
            // non-critical
        }
    }, []);

    useEffect(() => {
        fetchComplaints();
        fetchCourses();
    }, [fetchComplaints, fetchCourses]);

    // ── Submit new complaint ──
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseId || !newDescription.trim()) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            await studentApi.submitComplaint({
                courseId:    Number(newCourseId),
                category:    newCategory,
                description: newDescription,
                anonymous:   newAnonymous,
            });
            setSubmitSuccess(true);
            setNewCourseId("");
            setNewCategory("COURSE_QUALITY");
            setNewDescription("");
            setNewAnonymous(false);
            await fetchComplaints();
            setTimeout(() => {
                setSubmitSuccess(false);
                setShowCreate(false);
            }, 1500);
        } catch (err: unknown) {
            setSubmitError(err instanceof Error ? err.message : "Failed to submit complaint");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Filtering ──
    const filtered = complaints.filter((c) => {
        const matchesFilter = activeFilter === "all" || c.status === activeFilter;
        const matchesSearch =
            search === "" ||
            c.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase()) ||
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
                <button
                    onClick={fetchComplaints}
                    className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-start justify-between">
                <PageHeader
                    title="My Complaints"
                    description="Submit and track your academic complaints"
                />
                <button
                    onClick={() => { setShowCreate(true); setSubmitError(null); setSubmitSuccess(false); }}
                    className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
                >
                    <Plus className="h-4 w-4" /> New Complaint
                </button>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                <StatCard
                    label="Submitted"
                    value={loading ? "—" : String(submitted)}
                    icon={MessageSquareWarning}
                    subtitle="Awaiting triage"
                />
                <StatCard
                    label="In Review"
                    value={loading ? "—" : String(inReview)}
                    icon={MessageSquareWarning}
                    subtitle="Under investigation"
                />
                <StatCard
                    label="Resolved"
                    value={loading ? "—" : String(resolved)}
                    icon={MessageSquareWarning}
                    subtitle="Closed"
                    // accent="success"
                />
            </div>

            <FilterBar
                filters={STATUS_FILTERS}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                searchValue={search}
                onSearchChange={setSearch}
                placeholder="Search by course or description…"
            />

            {/* List */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={MessageSquareWarning}
                    title="No complaints found"
                    description={activeFilter === "all"
                        ? "You haven't submitted any complaints yet."
                        : "No complaints match the selected filter."
                    }
                />
            ) : (
                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                                <th className="px-4 py-2.5 text-left font-medium">ID</th>
                                <th className="px-4 py-2.5 text-left font-medium">Course</th>
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
                                    className={`border-b last:border-b-0 hover:bg-secondary/30 transition-colors ${
                                        selectedId === c.id ? "bg-secondary/50" : ""
                                    }`}
                                >
                                    <td className="px-4 py-3 font-mono text-xs">#{c.id}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{c.courseTitle}</p>
                                        {c.anonymous && (
                                            <p className="text-xs text-secondary-foreground">Anonymous</p>
                                        )}
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
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[c.status] ?? "bg-secondary text-foreground"
                      }`}>
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

            {/* Detail panel */}
            {selected && (
                <div className="mt-6">
                    <SectionCard
                        title={`Complaint #${selected.id}`}
                        action={
                            <button onClick={() => setSelectedId(null)}>
                                <X className="h-4 w-4" />
                            </button>
                        }
                    >
                        <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-secondary/30 p-3 md:grid-cols-4">
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
                            <div>
                                <p className="text-xs text-secondary-foreground">Submitted</p>
                                <p className="text-sm font-medium">{formatDate(selected.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-secondary-foreground">Status</p>
                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    STATUS_COLORS[selected.status] ?? "bg-secondary"
                                }`}>
                  {selected.status.replace("_", " ")}
                </span>
                            </div>
                        </div>

                        <p className="mb-1 text-xs font-medium text-secondary-foreground">Description</p>
                        <p className="mb-4 text-sm">{selected.description}</p>

                        {selected.resolutionNotes && (
                            <div className="rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] p-3">
                                <p className="mb-1 text-xs font-medium text-[#166534]">Resolution Notes</p>
                                <p className="text-sm text-[#166534]">{selected.resolutionNotes}</p>
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

                        <div className="mt-3 flex items-center gap-2 text-xs text-secondary-foreground">
                            <span>Anonymous: {selected.anonymous ? "Yes" : "No"}</span>
                            <span>·</span>
                            <span>Updated: {formatDate(selected.updatedAt)}</span>
                        </div>
                    </SectionCard>
                </div>
            )}

            {/* Create complaint modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold">Submit New Complaint</h3>
                            <button onClick={() => setShowCreate(false)}>
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {submitSuccess ? (
                            <div className="py-6 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#dcfce7]">
                                    <MessageSquareWarning className="h-6 w-6 text-[#166534]" />
                                </div>
                                <p className="font-semibold text-[#166534]">Complaint submitted!</p>
                                <p className="mt-1 text-sm text-secondary-foreground">
                                    Your complaint has been recorded.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {submitError && (
                                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                        {submitError}
                                    </p>
                                )}

                                <div>
                                    <label className="mb-1 block text-xs font-medium">Course *</label>
                                    <select
                                        value={newCourseId}
                                        onChange={(e) => setNewCourseId(e.target.value)}
                                        required
                                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                                    >
                                        <option value="">Select course…</option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium">Category *</label>
                                    <select
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                                    >
                                        {CATEGORY_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium">Description *</label>
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        required
                                        rows={4}
                                        placeholder="Describe your complaint in detail…"
                                        className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none"
                                    />
                                </div>

                                <label className="flex cursor-pointer items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={newAnonymous}
                                        onChange={(e) => setNewAnonymous(e.target.checked)}
                                        className="rounded"
                                    />
                                    Submit anonymously
                                </label>

                                <p className="text-xs text-secondary-foreground">
                                    Rate limited to 5 complaints per day. Requires course enrollment.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreate(false)}
                                        className="rounded-md border px-4 py-2 text-sm hover:bg-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || !newCourseId || !newDescription.trim()}
                                        className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 disabled:opacity-50"
                                    >
                                        {submitting ? "Submitting…" : "Submit Complaint"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}