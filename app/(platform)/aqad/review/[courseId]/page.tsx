"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  Video,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { SectionCard } from "@/components/aqad/section-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { PriorityBadge } from "@/components/aqad/priority-badge";
import { Timeline } from "@/components/aqad/timeline";
import { PageHeader } from "@/components/platform/page-header";
import { mockCourseDetails, mockCoursesForReview, mockQualityChecklists } from "@/constants/aqad-mock-data";
import type { ChecklistItemStatus, QualityChecklistItem, ReviewDecision } from "@/types/aqad";

const MATERIAL_ICONS = {
  PDF: FileText,
  PPT: FileText,
  Video: Video,
  Link: LinkIcon,
  Other: FileText,
};

const CHECKLIST_STATUS_STYLES: Record<ChecklistItemStatus, string> = {
  passed: "bg-[#dcfce7] text-[#16a34a]",
  failed: "bg-[#fee2e2] text-[#dc2626]",
  needs_improvement: "bg-[#fef3c7] text-[#d97706]",
  pending: "bg-[#f4f4f4] text-[#6b7280]",
};

const CHECKLIST_STATUS_LABELS: Record<ChecklistItemStatus, string> = {
  passed: "Passed",
  failed: "Failed",
  needs_improvement: "Needs Improvement",
  pending: "Pending",
};

type Props = { params: Promise<{ courseId: string }> };

export default function ReviewCoursePage({ params }: Props) {
  const { courseId } = use(params);
  const [activeTab, setActiveTab] = useState<"structure" | "checklist" | "decision" | "history">(
    "checklist",
  );
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<QualityChecklistItem[]>(
    () => mockQualityChecklists[0]?.items ?? [],
  );
  const [decision, setDecision] = useState<ReviewDecision | "">("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReasons, setRejectionReasons] = useState([
    { id: "r1", description: "", requiredAction: "", deadline: "" },
  ]);

  const course = mockCourseDetails[courseId];
  const queueEntry = mockCoursesForReview.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="py-16 text-center">
        <p className="text-secondary-foreground">Course not found in review queue.</p>
        <Link
          href="/aqad/review-queue"
          className="mt-4 inline-block text-sm underline"
        >
          Back to Review Queue
        </Link>
      </div>
    );
  }

  function toggleModule(id: string) {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function updateChecklistItem(
    id: string,
    field: "status" | "reviewerComment",
    value: string,
  ) {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  const TABS = [
    { id: "checklist" as const, label: "Quality Checklist" },
    { id: "structure" as const, label: "Course Structure" },
    { id: "decision" as const, label: "Decision" },
    { id: "history" as const, label: "Review History" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-secondary-foreground">
        <Link href="/aqad/review-queue" className="hover:text-foreground">
          Review Queue
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>{course.code}</span>
      </div>

      <PageHeader title={course.title} description={`${course.code} · ${course.programName}`} />

      {/* Course Info Header */}
      <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg border bg-secondary/30 p-4 md:grid-cols-4">
        <div>
          <p className="text-xs text-secondary-foreground">Teacher</p>
          <p className="text-sm font-medium">{course.teacherName}</p>
        </div>
        <div>
          <p className="text-xs text-secondary-foreground">Credits</p>
          <p className="text-sm font-medium">{course.credits}</p>
        </div>
        <div>
          <p className="text-xs text-secondary-foreground">Language</p>
          <p className="text-sm font-medium">{course.language}</p>
        </div>
        <div>
          <p className="text-xs text-secondary-foreground">Level</p>
          <p className="text-sm font-medium">{course.level}</p>
        </div>
        {queueEntry && (
          <>
            <div>
              <p className="text-xs text-secondary-foreground">Review Type</p>
              <StatusBadge status={queueEntry.reviewType} />
            </div>
            <div>
              <p className="text-xs text-secondary-foreground">Priority</p>
              <PriorityBadge priority={queueEntry.priority} />
            </div>
            <div>
              <p className="text-xs text-secondary-foreground">Days in Queue</p>
              <p className="text-sm font-medium">{queueEntry.daysInQueue}d</p>
            </div>
            <div>
              <p className="text-xs text-secondary-foreground">Reviewer</p>
              <p className="text-sm font-medium">
                {queueEntry.assignedReviewerName ?? "Unassigned"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-foreground text-foreground"
                : "text-secondary-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Structure Tab */}
      {activeTab === "structure" && (
        <div className="space-y-2">
          <div className="mb-4">
            <h3 className="mb-2 font-medium">Learning Outcomes</h3>
            <ul className="space-y-1">
              {course.learningOutcomes.map((lo, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                  {lo}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="mb-2 font-medium">Prerequisites</h3>
            {course.prerequisites.length === 0 ? (
              <p className="text-sm text-secondary-foreground">None</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {course.prerequisites.map((p, i) => (
                  <li
                    key={i}
                    className="rounded-full border px-3 py-1 text-xs font-medium"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-6">
            <h3 className="mb-2 font-medium">Assessment Policy</h3>
            <p className="text-sm text-secondary-foreground">{course.assessmentPolicy}</p>
          </div>
          <h3 className="mb-3 font-medium">Course Modules</h3>
          {course.modules.map((mod) => (
            <div key={mod.id} className="overflow-hidden rounded-lg border">
              <button
                onClick={() => toggleModule(mod.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-secondary"
              >
                <span className="font-medium">{mod.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary-foreground">
                    {mod.lectures.length} lectures
                  </span>
                  {expandedModules.includes(mod.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </button>
              {expandedModules.includes(mod.id) && (
                <div className="border-t">
                  {mod.lectures.map((lecture) => {
                    return (
                      <div key={lecture.id} className="border-b px-4 py-3 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{lecture.title}</p>
                            <p className="mt-0.5 text-xs text-secondary-foreground">
                              {lecture.plan}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                lecture.hasActivities
                                  ? "bg-[#dcfce7] text-[#16a34a]"
                                  : "bg-[#fee2e2] text-[#dc2626]"
                              }`}
                            >
                              Activities
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                lecture.hasQA
                                  ? "bg-[#dcfce7] text-[#16a34a]"
                                  : "bg-[#fee2e2] text-[#dc2626]"
                              }`}
                            >
                              Q&A
                            </span>
                          </div>
                        </div>
                        {lecture.materials.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {lecture.materials.map((mat) => {
                              const Icon = MATERIAL_ICONS[mat.type];
                              return (
                                <span
                                  key={mat.id}
                                  className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs"
                                >
                                  <Icon className="h-3 w-3" />
                                  {mat.name}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === "checklist" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-secondary-foreground">
              Checklist: <span className="font-medium">Standard Course Checklist v3.2</span>
            </p>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-[#16a34a]" />
                {checklist.filter((i) => i.status === "passed").length} passed
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5 text-[#dc2626]" />
                {checklist.filter((i) => i.status === "failed").length} failed
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-[#d97706]" />
                {checklist.filter((i) => i.status === "needs_improvement").length} needs work
              </span>
            </div>
          </div>
          {checklist.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.required && (
                      <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs text-[#dc2626]">
                        Required
                      </span>
                    )}
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-secondary-foreground">{item.description}</p>
                </div>
                <div className="flex gap-1">
                  {(["passed", "needs_improvement", "failed"] as ChecklistItemStatus[]).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => updateChecklistItem(item.id, "status", s)}
                        className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                          item.status === s
                            ? CHECKLIST_STATUS_STYLES[s]
                            : "border hover:bg-secondary"
                        }`}
                      >
                        {CHECKLIST_STATUS_LABELS[s]}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <textarea
                value={item.reviewerComment ?? ""}
                onChange={(e) =>
                  updateChecklistItem(item.id, "reviewerComment", e.target.value)
                }
                placeholder="Add reviewer comment…"
                rows={2}
                className="mt-3 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
          ))}
        </div>
      )}

      {/* Decision Tab */}
      {activeTab === "decision" && (
        <div className="space-y-6">
          <SectionCard title="Review Decision">
            <div className="space-y-3">
              {(["Approved", "ConditionalApproval", "Rejected"] as ReviewDecision[]).map(
                (d) => (
                  <label
                    key={d}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                      decision === d ? "border-foreground bg-secondary" : "hover:bg-secondary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      value={d}
                      checked={decision === d}
                      onChange={() => setDecision(d)}
                      className="shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {d === "ConditionalApproval" ? "Conditional Approval" : d}
                      </p>
                      <p className="text-xs text-secondary-foreground">
                        {d === "Approved" &&
                          "Course passes quality review and is ready for publication."}
                        {d === "ConditionalApproval" &&
                          "Course may be published but must complete required changes by deadline."}
                        {d === "Rejected" &&
                          "Course does not meet standards. Must address all issues before resubmission."}
                      </p>
                    </div>
                  </label>
                ),
              )}
            </div>
          </SectionCard>

          {decision === "Rejected" && (
            <SectionCard title="Rejection Reasons">
              <div className="space-y-4">
                {rejectionReasons.map((reason, idx) => (
                  <div key={reason.id} className="rounded-lg border p-4">
                    <p className="mb-3 text-xs font-medium text-secondary-foreground">
                      Issue #{idx + 1}
                    </p>
                    <div className="space-y-2">
                      <textarea
                        value={reason.description}
                        onChange={(e) =>
                          setRejectionReasons((prev) =>
                            prev.map((r) =>
                              r.id === reason.id
                                ? { ...r, description: e.target.value }
                                : r,
                            ),
                          )
                        }
                        placeholder="Describe the issue…"
                        rows={2}
                        className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none"
                      />
                      <textarea
                        value={reason.requiredAction}
                        onChange={(e) =>
                          setRejectionReasons((prev) =>
                            prev.map((r) =>
                              r.id === reason.id
                                ? { ...r, requiredAction: e.target.value }
                                : r,
                            ),
                          )
                        }
                        placeholder="Required action to fix…"
                        rows={2}
                        className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none"
                      />
                      <input
                        type="date"
                        value={reason.deadline}
                        onChange={(e) =>
                          setRejectionReasons((prev) =>
                            prev.map((r) =>
                              r.id === reason.id ? { ...r, deadline: e.target.value } : r,
                            ),
                          )
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setRejectionReasons((prev) => [
                      ...prev,
                      { id: `r${Date.now()}`, description: "", requiredAction: "", deadline: "" },
                    ])
                  }
                  className="text-sm text-secondary-foreground hover:text-foreground"
                >
                  + Add another issue
                </button>
              </div>
            </SectionCard>
          )}

          {decision === "ConditionalApproval" && (
            <SectionCard title="Required Changes">
              <textarea
                placeholder="List all required changes the teacher must complete by the deadline…"
                rows={4}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none"
              />
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium">Deadline</label>
                <input
                  type="date"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </SectionCard>
          )}

          <SectionCard title="Review Notes">
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="General notes about this review (visible to teacher)…"
              rows={4}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </SectionCard>

          <div className="flex justify-end gap-3">
            <button className="rounded-md border px-4 py-2 text-sm hover:bg-secondary">
              Save Draft
            </button>
            <button
              disabled={!decision}
              className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <SectionCard title="Review History">
          {course.reviewHistory.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No previous reviews.</p>
          ) : (
            <Timeline
              items={course.reviewHistory.map((rev) => ({
                id: rev.id,
                timestamp: rev.submittedAt,
                title: rev.decision ? `Decision: ${rev.decision}` : "Review In Progress",
                description: rev.notes,
                actor: rev.reviewerName,
                type:
                  rev.decision === "Approved"
                    ? "success"
                    : rev.decision === "Rejected"
                      ? "danger"
                      : rev.decision === "ConditionalApproval"
                        ? "warning"
                        : "default",
              }))}
            />
          )}
        </SectionCard>
      )}
    </div>
  );
}
