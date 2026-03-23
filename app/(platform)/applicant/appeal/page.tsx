"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/applicant/section-card";
import { StatusBadge } from "@/components/applicant/status-badge";
import { FileDropzone } from "@/components/applicant/file-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockAppeal } from "@/constants/applicant-mock-data";
import type { Appeal } from "@/types/applicant";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";

const appealReasons = [
  { value: "technical", label: "Technical issues during the exam" },
  { value: "health", label: "Health issues" },
  { value: "grading", label: "Disagreement with the grade" },
  { value: "other", label: "Other" },
];

export default function ApplicantAppealPage() {
  const [appeal, setAppeal] = useState<Appeal>(mockAppeal);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!reason || !details) return;
    setAppeal({
      ...appeal,
      status: "submitted",
      reason,
      details,
      submittedAt: new Date().toISOString(),
    });
  };

  // Not submitted — show form
  if (appeal.status === "not_submitted") {
    return (
      <div>
        <PageHeader
          title="Appeal"
          description="File an appeal if you disagree with the result"
        />

        <SectionCard title="Appeal Form" className="max-w-2xl">
          <div className="space-y-5">
            <div className="space-y-3">
              <Label>Reason for Appeal</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {appealReasons.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Detailed Description</Label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the situation in detail..."
                rows={5}
              />
            </div>

            <div className="space-y-3">
              <Label>Attach Evidence (optional)</Label>
              {attachment ? (
                <div className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
                  <FileText className="h-4 w-4 text-secondary-foreground" />
                  <span>{attachment.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAttachment(null)}
                    className="ml-auto"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <FileDropzone onFileSelect={setAttachment} />
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!reason || !details}
              className="w-full"
            >
              Submit Appeal
            </Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  // Submitted / In Review
  if (appeal.status === "submitted" || appeal.status === "in_review") {
    return (
      <div>
        <PageHeader title="Appeal" description="Your appeal status" />

        <SectionCard className="max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Appeal Under Review</p>
              <p className="text-sm text-secondary-foreground">
                Submitted{" "}
                {appeal.submittedAt &&
                  new Date(appeal.submittedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </p>
            </div>
            <StatusBadge
              status={appeal.status}
              variant="appeal"
              className="ml-auto"
            />
          </div>

          <div className="mt-4 space-y-3 rounded-md bg-secondary p-4 text-sm">
            <p>
              <span className="font-medium">Reason:</span>{" "}
              {appealReasons.find((r) => r.value === appeal.reason)?.label ??
                appeal.reason}
            </p>
            <p>
              <span className="font-medium">Description:</span> {appeal.details}
            </p>
          </div>

          <p className="mt-4 text-sm text-secondary-foreground">
            Average review time is 5–7 business days. You will receive a
            notification once a decision is made.
          </p>
        </SectionCard>
      </div>
    );
  }

  // Resolved (approved / rejected)
  return (
    <div>
      <PageHeader title="Appeal" description="Decision on your appeal" />

      <SectionCard className="max-w-2xl">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              appeal.status === "approved" ? "bg-emerald-50" : "bg-red-50"
            }`}
          >
            {appeal.status === "approved" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {appeal.status === "approved"
                ? "Appeal Approved"
                : "Appeal Rejected"}
            </p>
            {appeal.decidedAt && (
              <p className="text-sm text-secondary-foreground">
                {new Date(appeal.decidedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <StatusBadge
            status={appeal.status}
            variant="appeal"
            className="ml-auto"
          />
        </div>

        {appeal.decisionNote && (
          <div className="mt-4 rounded-md bg-secondary p-4 text-sm">
            <p className="font-medium">Committee Comment:</p>
            <p className="mt-1 text-secondary-foreground">
              {appeal.decisionNote}
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
