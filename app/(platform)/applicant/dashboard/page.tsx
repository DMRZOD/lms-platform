"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/applicant/section-card";
import { StatusBadge } from "@/components/applicant/status-badge";
import { StatusTimeline } from "@/components/applicant/status-timeline";
import { mockApplicant, mockDocuments } from "@/constants/applicant-mock-data";
import { Calendar, FileCheck, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statusActions: Record<string, { text: string; href: string; description: string }> = {
  Applied: {
    text: "Upload Documents",
    href: "/applicant/documents",
    description: "Upload the required documents to continue the admission process.",
  },
  DocsPending: {
    text: "Upload Documents",
    href: "/applicant/documents",
    description: "Upload the remaining required documents.",
  },
  DocsInReview: {
    text: "View Documents",
    href: "/applicant/documents",
    description: "Your documents are under review. Average processing time is 3–5 business days.",
  },
  Verified: {
    text: "Schedule Exam",
    href: "/applicant/schedule",
    description: "Documents verified! Schedule your entrance exam.",
  },
  ExamScheduled: {
    text: "Exam Preparation",
    href: "/applicant/schedule",
    description: "Exam scheduled. Check the preparation checklist.",
  },
  ExamInProgress: {
    text: "Go to Exam",
    href: "/applicant/exams",
    description: "Exam is in progress.",
  },
  ExamCompleted: {
    text: "Await Results",
    href: "/applicant/dashboard",
    description: "Exam completed. Results will be available within 5 business days.",
  },
  Passed: {
    text: "Go to Student Portal",
    href: "/student/dashboard",
    description: "Congratulations! You have passed the exam and are enrolled.",
  },
  Failed: {
    text: "File an Appeal",
    href: "/applicant/appeal",
    description: "Unfortunately, the exam was not passed. You can file an appeal.",
  },
  Enrolled: {
    text: "Go to Student Portal",
    href: "/student/dashboard",
    description: "You are enrolled! Welcome to the university.",
  },
};

export default function ApplicantDashboardPage() {
  const applicant = mockApplicant;
  const documents = mockDocuments;
  const action = statusActions[applicant.currentStatus];

  const docsUploaded = documents.filter((d) => d.status !== "pending").length;
  const docsTotal = documents.filter((d) => d.required).length;

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
            <StatusBadge status={applicant.currentStatus} />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-secondary-foreground" />
            <p className="text-sm text-secondary-foreground">Documents</p>
          </div>
          <p className="mt-1 text-2xl font-bold">
            {docsUploaded}
            <span className="text-base font-normal text-secondary-foreground">
              {" "}
              / {docsTotal}
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-secondary-foreground" />
            <p className="text-sm text-secondary-foreground">Program</p>
          </div>
          <p className="mt-1 text-sm font-semibold">{applicant.program}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Action card */}
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

        {/* Timeline */}
        <SectionCard title="Admission Progress">
          <StatusTimeline
            currentStatus={applicant.currentStatus}
            history={applicant.statusHistory}
          />
        </SectionCard>

        {/* Status history */}
        <SectionCard title="Status History" className="lg:col-span-2">
          <div className="space-y-2">
            {[...applicant.statusHistory].reverse().map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-md border border-border px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={entry.status} />
                  {entry.note && (
                    <span className="text-sm text-secondary-foreground">
                      {entry.note}
                    </span>
                  )}
                </div>
                <span className="text-xs text-secondary-foreground">
                  {new Date(entry.timestamp).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
