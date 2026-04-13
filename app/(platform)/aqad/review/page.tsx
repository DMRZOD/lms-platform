"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Clock, CheckCircle2, XCircle, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/platform/page-header";
import { StatCard } from "@/components/aqad/stat-card";
import { EmptyState } from "@/components/aqad/empty-state";
import { FilterBar } from "@/components/aqad/filter-bar";
import { apiClient } from "@/lib/api-client";


interface ApiCourse {
    id: number;
    title: string;
    description: string | null;
    status: string;
    language: string | null;
    level: string | null;
    version: number;
    teacherName: string | null;
    teacherId: number | null;
    createdAt: string;
    updatedAt: string;
    category: string | null;
    thumbnailUrl: string | null;
}

interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

const STATUS_FILTERS = [
    { label: "All",       value: "all" },
    { label: "In Review", value: "IN_REVIEW" },
    { label: "Approved",  value: "APPROVED" },
    { label: "Rejected",  value: "REJECTED" },
    { label: "Published", value: "PUBLISHED" },
];

const STATUS_STYLES: Record<string, string> = {
    IN_REVIEW:  "bg-[#fef9c3] text-[#854d0e]",
    APPROVED:   "bg-[#dbeafe] text-[#1d4ed8]",
    PUBLISHED:  "bg-[#dcfce7] text-[#166534]",
    REJECTED:   "bg-[#fee2e2] text-[#991b1b]",
    DRAFT:      "bg-[#f0f0f0] text-[#666]",
    ARCHIVED:   "bg-[#f3f4f6] text-[#6b7280]",
};

const VISIBLE_STATUSES = ["IN_REVIEW", "APPROVED", "REJECTED", "PUBLISHED"];

function formatDate(ts: string) {
    return new Date(ts).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function getLevelIcon(level: string | null) {
    if (!level) return null;
    const map: Record<string, string> = {
        BEGINNER:     "🟢",
        INTERMEDIATE: "🟡",
        ADVANCED:     "🔴",
    };
    return map[level] ?? "📊";
}

export default function AqadReviewPage() {
    const [courses, setCourses]           = useState<ApiCourse[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [search, setSearch]             = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiClient.get<PagedResponse<ApiCourse> | ApiCourse[]>(
                "/api/courses?page=0&size=200"
            );
            const all = Array.isArray(data)
                ? data
                : (data as PagedResponse<ApiCourse>).content ?? [];

            setCourses(all.filter((c) => VISIBLE_STATUSES.includes(c.status)));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load courses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    const filtered = courses.filter((c) => {
        const matchesFilter = activeFilter === "all" || c.status === activeFilter;
        const matchesSearch =
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            (c.teacherName ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (c.category ?? "").toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const inReview  = courses.filter((c) => c.status === "IN_REVIEW").length;
    const approved  = courses.filter((c) => c.status === "APPROVED").length;
    const rejected  = courses.filter((c) => c.status === "REJECTED").length;
    const published = courses.filter((c) => c.status === "PUBLISHED").length;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm text-red-500">{error}</p>
                <button
                    onClick={fetchCourses}
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
                    title="Course Review"
                    description={
                        loading
                            ? "Loading courses..."
                            : `${inReview} course${inReview !== 1 ? "s" : ""} awaiting review`
                    }
                />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                    label="In Review"
                    value={loading ? "—" : String(inReview)}
                    icon={Clock}
                    subtitle="Awaiting decision"
                    accent={inReview > 0 ? "warning" : "default"}
                />
                <StatCard
                    label="Approved"
                    value={loading ? "—" : String(approved)}
                    icon={CheckCircle2}
                    subtitle="Ready to publish"
                    accent="success"
                />
                <StatCard
                    label="Rejected"
                    value={loading ? "—" : String(rejected)}
                    icon={XCircle}
                    subtitle="Needs revision"
                    accent={rejected > 0 ? "danger" : "default"}
                />
                <StatCard
                    label="Published"
                    value={loading ? "—" : String(published)}
                    icon={BookOpen}
                    subtitle="Live courses"
                />
            </div>

            <FilterBar
                filters={STATUS_FILTERS}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                searchValue={search}
                onSearchChange={setSearch}
                placeholder="Search by course title or teacher…"
            />

            {loading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-44 animate-pulse rounded-lg bg-secondary" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={BookOpen}
                    title={
                        activeFilter === "IN_REVIEW"
                            ? "No courses awaiting review"
                            : "No courses found"
                    }
                    description={
                        activeFilter === "IN_REVIEW"
                            ? "There are currently no courses submitted for review."
                            : "Try adjusting your filters or search term."
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((course) => {
                        const isActionable = course.status === "IN_REVIEW";
                        return (
                            <Link
                                key={course.id}
                                href={`/aqad/review/${course.id}`}
                                className={`group rounded-lg border bg-background p-5 transition-all duration-200 ${
                                    isActionable
                                        ? "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50/30"
                                        : "border-border hover:bg-secondary/40 hover:border-foreground/20 opacity-75"
                                }`}
                            >
                                <div className="mb-3 flex items-start justify-between gap-2">
                                    <h3 className="font-semibold leading-tight line-clamp-2">
                                        {course.title}
                                    </h3>
                                    <span
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                            STATUS_STYLES[course.status] ?? "bg-secondary text-foreground"
                                        }`}
                                    >
                                        {course.status.replace("_", " ")}
                                    </span>
                                </div>

                                {course.description && (
                                    <p className="mb-3 text-sm text-secondary-foreground line-clamp-2">
                                        {course.description}
                                    </p>
                                )}

                                {course.teacherName && (
                                    <div className="mb-3 flex items-center gap-1.5 text-xs text-secondary-foreground">
                                        <GraduationCap className="h-3.5 w-3.5" />
                                        <span>{course.teacherName}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-secondary-foreground">
                                        {course.level && (
                                            <span>{getLevelIcon(course.level)} {course.level}</span>
                                        )}
                                        {course.language && <span>🌐 {course.language}</span>}
                                        <span className="text-secondary-foreground/60">v{course.version}</span>
                                    </div>

                                    <div className={`flex items-center gap-1 text-xs transition-colors ${
                                        isActionable
                                            ? "text-yellow-700 font-semibold"
                                            : "text-secondary-foreground group-hover:text-foreground"
                                    }`}>
                                        <span>{isActionable ? "Start Review" : "View"}</span>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </div>
                                </div>

                                <div className="mt-3 border-t border-border pt-3">
                                    <p className="text-xs text-secondary-foreground">
                                        Submitted {formatDate(course.createdAt)}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
