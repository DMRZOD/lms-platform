"use client";

import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import {
  ChevronRight, BookOpen, GraduationCap,
  Globe, BarChart2, Tag, Hash,
  Clock, CheckCircle2, XCircle, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/aqad/section-card";
import { StatusBadge } from "@/components/aqad/status-badge";
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

interface ApiReview {
  id: number;
  courseId: number;
  courseTitle: string;
  reviewerId: number | null;
  reviewerName: string | null;
  status: string;
  checklist: {
    learningOutcomesDefined: boolean;
    assessmentAlignedWithOutcomes: boolean;
    materialsUploaded: boolean;
    gradingWeightsDefined: boolean;
    attendancePolicyDefined: boolean;
    academicIntegrityStatementPresent: boolean;
  } | null;
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

type Props = { params: Promise<{ courseId: string }> };

const STATUS_STYLES: Record<string, string> = {
  DRAFT:      "bg-[#f0f0f0] text-[#666]",
  IN_REVIEW:  "bg-[#fef9c3] text-[#854d0e]",
  APPROVED:   "bg-[#dbeafe] text-[#1d4ed8]",
  PUBLISHED:  "bg-[#dcfce7] text-[#166534]",
  REJECTED:   "bg-[#fee2e2] text-[#991b1b]",
  ARCHIVED:   "bg-[#f3f4f6] text-[#6b7280]",
};

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function AqadReviewCourseDetailPage({ params }: Props) {
  const { courseId } = use(params);

  const [course, setCourse]           = useState<ApiCourse | null>(null);
  const [review, setReview]           = useState<ApiReview | null>(null);
  const [starting, setStarting]       = useState(false);
  const [startError, setStartError]   = useState<string | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<ApiCourse>(`/api/courses/${courseId}`);
      setCourse(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load course");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchCourse(); }, [fetchCourse]);

  const handleStartReview = async () => {
    setStarting(true);
    setStartError(null);
    try {
      const data = await apiClient.post<ApiReview>(
          `/api/v1/aqad/courses/${courseId}/start-review`
      );
      setReview(data);
      window.location.href = `/aqad/review-queue`;
    } catch (err: unknown) {
      setStartError(err instanceof Error ? err.message : "Failed to start review");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  if (error || !course) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error ?? "Course not found"}</p>
          <Link href="/aqad/review" className="text-sm underline">
            Back to Review
          </Link>
        </div>
    );
  }

  const canStartReview =
      course.status === "IN_REVIEW" || course.status === "DRAFT";

  const metaItems = [
    course.teacherName && { icon: GraduationCap, label: "Teacher",  value: course.teacherName },
    course.language    && { icon: Globe,          label: "Language", value: course.language },
    course.level       && { icon: BarChart2,      label: "Level",    value: course.level.charAt(0) + course.level.slice(1).toLowerCase() },
    course.category    && { icon: Tag,            label: "Category", value: course.category },
    { icon: Hash, label: "Version", value: `v${course.version}` },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  return (
      <div>
        <div className="mb-4 flex items-center gap-2 text-sm text-secondary-foreground">
          <Link href="/aqad/review" className="hover:text-foreground transition-colors">
            Course Review
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="line-clamp-1">{course.title}</span>
        </div>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <PageHeader
                title={course.title}
                description={`Course #${course.id}`}
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
          <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                  STATUS_STYLES[course.status] ?? "bg-secondary text-foreground"
              }`}
          >
            {course.status.replace("_", " ")}
          </span>

            {canStartReview && (
                <button
                    onClick={handleStartReview}
                    disabled={starting}
                    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {starting ? "Starting…" : "Start AQAD Review"}
                </button>
            )}
          </div>
        </div>

        {startError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {startError}
            </div>
        )}

        {course.status === "IN_REVIEW" && (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-yellow-800">
                <Clock className="h-4 w-4 shrink-0" />
                <span>This course is currently under AQAD review.</span>
              </div>
              <Link
                  href="/aqad/review-queue"
                  className="text-sm font-medium text-yellow-900 underline hover:no-underline"
              >
                View in Queue →
              </Link>
            </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">

            <SectionCard title="Course Information">
              {course.description ? (
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    {course.description}
                  </p>
              ) : (
                  <p className="text-sm italic text-secondary-foreground">
                    No description provided.
                  </p>
              )}

              {course.thumbnailUrl && (
                  <div className="mt-4 overflow-hidden rounded-lg border">
                    <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-48 w-full object-cover"
                    />
                  </div>
              )}
            </SectionCard>

            <SectionCard title="AQAD Actions">
              <div className="space-y-3">
                {course.status === "IN_REVIEW" ? (
                    <>
                      <p className="text-sm text-secondary-foreground">
                        This course is in the review queue. Go to the review queue to manage the full review process — checklist, decision, and comments.
                      </p>
                      <Link
                          href="/aqad/review-queue"
                          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
                      >
                        <BookOpen className="h-4 w-4" />
                        Open Review Queue
                      </Link>
                    </>
                ) : course.status === "APPROVED" || course.status === "PUBLISHED" ? (
                    <div className="flex items-center gap-2 text-sm text-[#166534]">
                      <CheckCircle2 className="h-4 w-4" />
                      This course has been approved and is ready to publish.
                    </div>
                ) : course.status === "REJECTED" ? (
                    <div className="flex items-center gap-2 text-sm text-[#991b1b]">
                      <XCircle className="h-4 w-4" />
                      This course was rejected. The teacher must resubmit after corrections.
                    </div>
                ) : (
                    <>
                      <p className="text-sm text-secondary-foreground">
                        Start the AQAD review process for this course. Once started, it will appear in the review queue where you can complete the checklist and submit a decision.
                      </p>
                      <button
                          onClick={handleStartReview}
                          disabled={starting}
                          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        <BookOpen className="h-4 w-4" />
                        {starting ? "Starting Review…" : "Start AQAD Review"}
                      </button>
                      {startError && (
                          <p className="text-sm text-red-500">{startError}</p>
                      )}
                    </>
                )}
              </div>
            </SectionCard>

          </div>

          <div className="space-y-6">
            <SectionCard title="Details">
              <div className="space-y-3">
                {metaItems.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-secondary-foreground">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </div>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                ))}
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Submitted</span>
                    <span>{formatDate(course.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Last updated</span>
                    <span>{formatDate(course.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Quick Links">
              <div className="space-y-2">
                <Link
                    href="/aqad/review-queue"
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary transition-colors"
                >
                  <span>Review Queue</span>
                  <ChevronRight className="h-4 w-4 text-secondary-foreground" />
                </Link>
                <Link
                    href="/aqad/complaints"
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary transition-colors"
                >
                  <span>Complaints</span>
                  <ChevronRight className="h-4 w-4 text-secondary-foreground" />
                </Link>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
  );
}
