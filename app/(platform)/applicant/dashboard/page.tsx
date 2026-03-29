"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/applicant/section-card";
import { StatusBadge } from "@/components/applicant/status-badge";
import { StatusTimeline } from "@/components/applicant/status-timeline";
import { Button } from "@/components/ui/button";
import { applicantApi } from "@/lib/applicant-api";
import type { ApiApplicantStatus, ApiAdmissionDocument } from "@/lib/applicant-api";
import { Calendar, FileCheck, Info, Loader2 } from "lucide-react";
import Link from "next/link";

// ─── Status → next action map ──────────────────────────────────────────────

const STATUS_ACTIONS: Record<string, { text: string; href: string; description: string }> = {
  APPLIED: {
    text: "Upload Documents",
    href: "/applicant/documents",
    description: "Upload the required documents to continue the admission process.",
  },
  DOCS_PENDING: {
    text: "Upload Documents",
    href: "/applicant/documents",
    description: "Upload the remaining required documents.",
  },
  DOCS_IN_REVIEW: {
    text: "View Documents",
    href: "/applicant/documents",
    description: "Your documents are under review. Average processing time is 3–5 business days.",
  },
  VERIFIED: {
    text: "Schedule Exam",
    href: "/applicant/schedule",
    description: "Documents verified! Schedule your entrance exam.",
  },
  EXAM_SCHEDULED: {
    text: "Exam Preparation",
    href: "/applicant/schedule",
    description: "Exam scheduled. Check the preparation checklist.",
  },
  EXAM_IN_PROGRESS: {
    text: "Go to Exam",
    href: "/applicant/exams",
    description: "Exam is in progress.",
  },
  EXAM_COMPLETED: {
    text: "Await Results",
    href: "/applicant/dashboard",
    description: "Exam completed. Results will be available within 5 business days.",
  },
  PASSED: {
    text: "Go to Student Portal",
    href: "/student/dashboard",
    description: "Congratulations! You have passed the exam and are enrolled.",
  },
  FAILED: {
    text: "File an Appeal",
    href: "/applicant/appeal",
    description: "Unfortunately, the exam was not passed. You can file an appeal.",
  },
  ENROLLED: {
    text: "Go to Student Portal",
    href: "/student/dashboard",
    description: "You are enrolled! Welcome to the university.",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ApplicantDashboardPage() {
  const [status, setStatus]   = useState<ApiApplicantStatus | null>(null);
  const [docs, setDocs]       = useState<ApiAdmissionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statusData, docsData] = await Promise.all([
          applicantApi.getMyStatus(),
          applicantApi.getMyDocuments(),
        ]);
        setStatus(statusData);
        setDocs(Array.isArray(docsData) ? docsData : []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-secondary-foreground" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button
              onClick={() => window.location.reload()}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Retry
          </button>
        </div>
    );
  }

  const currentState = status?.currentState ?? "APPLIED";
  const action       = STATUS_ACTIONS[currentState];

  const docsUploaded = docs.filter((d) => d.status !== "PENDING_REVIEW").length;
  const docsTotal    = docs.length;

  return (
      <div>
        <PageHeader
            title="Welcome, Applicant"
            description="Track your admission progress"
        />

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-5">
            <p className="text-sm text-secondary-foreground">Current Status</p>
            <div className="mt-2">
              <StatusBadge status={currentState} />
            </div>
            {status?.updatedAt && (
                <p className="mt-1 text-xs text-secondary-foreground">
                  Updated {new Date(status.updatedAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
                </p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-secondary-foreground" />
              <p className="text-sm text-secondary-foreground">Documents</p>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {docsUploaded}
              <span className="text-base font-normal text-secondary-foreground">
              {" "}/ {docsTotal}
            </span>
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-secondary-foreground" />
              <p className="text-sm text-secondary-foreground">Applicant ID</p>
            </div>
            <p className="mt-1 text-sm font-semibold">#{status?.userId ?? "—"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Next action card */}
          {action && (
              <SectionCard title="Next Step">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Info className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-foreground">
                      {action.description}
                    </p>
                    <Link href={action.href}>
                      <Button variant="outline" size="sm" className="mt-3">
                        {action.text}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SectionCard>
          )}

          {/* Documents overview */}
          <SectionCard title="My Documents">
            {docs.length === 0 ? (
                <p className="text-sm text-secondary-foreground">No documents uploaded yet.</p>
            ) : (
                <div className="space-y-2">
                  {docs.map((doc) => (
                      <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">{doc.type}</p>
                          <p className="text-xs text-secondary-foreground">
                            {new Date(doc.uploadedAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric",
                            })}
                          </p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            doc.status === "APPROVED"
                                ? "bg-[#dcfce7] text-[#166534]"
                                : doc.status === "REJECTED"
                                    ? "bg-[#fee2e2] text-[#991b1b]"
                                    : "bg-[#fef9c3] text-[#854d0e]"
                        }`}>
                    {doc.status.replace(/_/g, " ")}
                  </span>
                      </div>
                  ))}
                </div>
            )}
            <Link href="/applicant/documents">
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Manage Documents
              </Button>
            </Link>
          </SectionCard>

          {/* Status info */}
          <SectionCard title="Status Info" className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
              {[
                { label: "Applied",        state: "APPLIED" },
                { label: "Docs Review",    state: "DOCS_IN_REVIEW" },
                { label: "Verified",       state: "VERIFIED" },
                { label: "Exam Scheduled", state: "EXAM_SCHEDULED" },
                { label: "Exam Done",      state: "EXAM_COMPLETED" },
                { label: "Passed",         state: "PASSED" },
                { label: "Enrolled",       state: "ENROLLED" },
              ].map(({ label, state }) => {
                const states = [
                  "APPLIED", "DOCS_PENDING", "DOCS_IN_REVIEW",
                  "VERIFIED", "EXAM_SCHEDULED", "EXAM_IN_PROGRESS",
                  "EXAM_COMPLETED", "PASSED", "ENROLLED",
                ];
                const currentIdx = states.indexOf(currentState);
                const thisIdx    = states.indexOf(state);
                const isDone     = thisIdx < currentIdx;
                const isCurrent  = state === currentState;

                return (
                    <div
                        key={state}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 ${
                            isCurrent
                                ? "bg-foreground text-background"
                                : isDone
                                    ? "bg-[#dcfce7] text-[#166534]"
                                    : "bg-secondary text-secondary-foreground"
                        }`}
                    >
                      <div className={`h-2 w-2 rounded-full ${
                          isCurrent ? "bg-background"
                              : isDone ? "bg-[#16a34a]"
                                  : "bg-secondary-foreground/30"
                      }`} />
                      <span className="text-xs font-medium">{label}</span>
                    </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
  );
}