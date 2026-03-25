"use client";

import { use, useState } from "react";
import {
  CheckCircle,
  ChevronLeft,
  Eye,
  FileText,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/resource/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockTeachers, mockDocuments } from "@/constants/resource-mock-data";

type CheckItem = {
  id: string;
  label: string;
  verified: boolean;
  comment: string;
};

type Decision = "Verified" | "Rejected" | null;

export default function VerifyTeacherPage({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) {
  const { teacherId } = use(params);
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  const documents = mockDocuments.filter((d) => d.teacherId === teacherId);

  const [checklist, setChecklist] = useState<CheckItem[]>([
    { id: "cert", label: "Certificates / Diplomas reviewed", verified: false, comment: "" },
    { id: "contract", label: "Employment contract reviewed", verified: false, comment: "" },
    { id: "bg", label: "Background check passed", verified: false, comment: "" },
    { id: "cv", label: "CV matches claimed qualifications", verified: false, comment: "" },
  ]);

  const [decision, setDecision] = useState<Decision>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [missingDocs, setMissingDocs] = useState<string[]>([]);
  const [verifierComment, setVerifierComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  function toggleCheck(id: string) {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, verified: !item.verified } : item,
      ),
    );
  }

  function setItemComment(id: string, comment: string) {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, comment } : item)),
    );
  }

  function toggleMissingDoc(label: string) {
    setMissingDocs((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (!teacher) {
    return (
      <div className="py-16 text-center">
        <p className="font-semibold">Teacher not found</p>
        <Link
          href="/resource/teachers"
          className="mt-2 block text-sm text-secondary-foreground underline"
        >
          Back to Teachers
        </Link>
      </div>
    );
  }

  if (submitted) {
    const isVerified = decision === "Verified";
    return (
      <div className="mx-auto mt-16 max-w-md text-center">
        <div className="mb-4 flex justify-center">
          {isVerified ? (
            <CheckCircle className="h-16 w-16 text-[#22c55e]" />
          ) : (
            <XCircle className="h-16 w-16 text-[#ef4444]" />
          )}
        </div>
        <h2 className="mb-2 text-xl font-semibold">
          Verification {isVerified ? "Approved" : "Rejected"}
        </h2>
        <p className="mb-6 text-sm text-secondary-foreground">
          {isVerified ? (
            <>
              <strong>{teacher.name}</strong> has been verified. Status changed{" "}
              <strong>Pending → Verified</strong>. The teacher can now be assigned to
              courses.
            </>
          ) : (
            <>
              <strong>{teacher.name}</strong> has been rejected. The teacher has been
              notified with the reason and a list of required documents.
            </>
          )}
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/resource/teachers"
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Back to Teachers
          </Link>
          <Link
            href={`/resource/teachers/${teacherId}`}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            View Profile
          </Link>
        </div>
      </div>
    );
  }

  const allChecked = checklist.every((c) => c.verified);

  return (
    <div>
      <div className="mb-4">
        <Link
          href={`/resource/teachers/${teacherId}`}
          className="flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Profile
        </Link>
      </div>

      <PageHeader
        title={`Verify — ${teacher.name}`}
        description="Review all submitted documents and make a verification decision."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Documents */}
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Uploaded Documents</h2>
          {documents.length === 0 ? (
            <p className="text-sm text-secondary-foreground">
              No documents uploaded by this teacher.
            </p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-md border border-border px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-secondary-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-secondary-foreground">
                        {doc.type} · {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={doc.status} />
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewDoc(previewDoc === doc.id ? null : doc.id)
                      }
                      className="flex items-center gap-1 text-xs text-secondary-foreground underline hover:text-foreground"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {previewDoc === doc.id ? "Hide" : "Preview"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preview panel */}
          {previewDoc && (
            <div className="mt-4 rounded-md border border-border bg-secondary p-8 text-center">
              <FileText className="mx-auto mb-2 h-12 w-12 text-secondary-foreground" />
              <p className="text-sm text-secondary-foreground">
                Document preview — in production this renders the actual file.
              </p>
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Verification Checklist</h2>
          <div className="space-y-4">
            {checklist.map((item) => (
              <div key={item.id} className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-3">
                    <div
                      onClick={() => toggleCheck(item.id)}
                      className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
                        item.verified
                          ? "border-[#22c55e] bg-[#22c55e]"
                          : "border-border bg-background"
                      }`}
                    >
                      {item.verified && (
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${item.verified ? "font-medium" : "text-secondary-foreground"}`}
                    >
                      {item.label}
                    </span>
                  </label>
                  <span className="text-sm">
                    {item.verified ? (
                      <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                    ) : (
                      <XCircle className="h-5 w-5 text-secondary-foreground" />
                    )}
                  </span>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={item.comment}
                    onChange={(e) => setItemComment(item.id, e.target.value)}
                    placeholder="Add a note (optional)…"
                    className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  />
                </div>
              </div>
            ))}
          </div>
          {!allChecked && (
            <p className="mt-3 text-xs text-secondary-foreground">
              Tip: You can still make a decision without checking all items — but it is
              recommended to review everything before approving.
            </p>
          )}
        </div>

        {/* Decision */}
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Decision</h2>
          <div className="flex gap-4">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                decision === "Verified"
                  ? "border-[#22c55e] bg-[#f0fdf4]"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <input
                type="radio"
                name="decision"
                value="Verified"
                checked={decision === "Verified"}
                onChange={() => setDecision("Verified")}
                className="sr-only"
              />
              <CheckCircle
                className={`h-5 w-5 ${decision === "Verified" ? "text-[#22c55e]" : "text-secondary-foreground"}`}
              />
              <div>
                <p className="text-sm font-medium">Verified</p>
                <p className="text-xs text-secondary-foreground">
                  All documents valid. Status: Pending → Verified
                </p>
              </div>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                decision === "Rejected"
                  ? "border-[#ef4444] bg-[#fff5f5]"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <input
                type="radio"
                name="decision"
                value="Rejected"
                checked={decision === "Rejected"}
                onChange={() => setDecision("Rejected")}
                className="sr-only"
              />
              <XCircle
                className={`h-5 w-5 ${decision === "Rejected" ? "text-[#ef4444]" : "text-secondary-foreground"}`}
              />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-xs text-secondary-foreground">
                  Missing or invalid documents. Teacher notified.
                </p>
              </div>
            </label>
          </div>

          {/* Rejection details */}
          {decision === "Rejected" && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Rejection Reason <span className="text-[#ef4444]">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  rows={2}
                  placeholder="Explain why verification is rejected…"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium">
                  Missing / Invalid Documents
                </label>
                <div className="space-y-1.5">
                  {["Certificate/Diploma", "Employment Contract", "CV/Résumé", "Background Check", "Additional Documents"].map((doc) => (
                    <label key={doc} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={missingDocs.includes(doc)}
                        onChange={() => toggleMissingDoc(doc)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm">{doc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Verifier comments */}
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-3 font-semibold">Verifier Comments</h2>
          <textarea
            value={verifierComment}
            onChange={(e) => setVerifierComment(e.target.value)}
            rows={3}
            placeholder="Internal notes for the Resource Dept team (optional)…"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Link
            href={`/resource/teachers/${teacherId}`}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!decision}
            className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit Verification
          </button>
        </div>
      </form>
    </div>
  );
}
