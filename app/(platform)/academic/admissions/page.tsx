"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, ChevronDown, ChevronUp, FileText, X } from "lucide-react";
import { FilterBar } from "@/components/academic/filter-bar";
import { StatCard } from "@/components/academic/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { academicApi } from "@/lib/academic-api";
import type { ApiAdmissionDocument } from "@/lib/academic-api";

// ─── Constants ────────────────────────────────────────────────────────────────

// Точные значения которые принимает API
type QueueStatus = "PENDING_REVIEW" | "VERIFIED" | "REJECTED_DOCS";

const STATUS_FILTERS: { label: string; value: QueueStatus }[] = [
    { label: "Pending Review", value: "PENDING_REVIEW" },
    { label: "Approved",       value: "VERIFIED" },
    { label: "Rejected",       value: "REJECTED_DOCS" },
];

const DOC_TYPE_LABELS: Record<string, string> = {
    PASSPORT:       "Passport",
    DIPLOMA:        "Diploma",
    TRANSCRIPT:     "Transcript",
    PHOTO:          "Photo",
    MEDICAL_CERT:   "Medical Certificate",
    RECOMMENDATION: "Recommendation Letter",
    CERTIFICATE:    "Certificate",
};

const STATUS_COLORS: Record<string, string> = {
    PENDING_REVIEW: "bg-[#fef9c3] text-[#854d0e]",
    REJECTED_DOCS:  "bg-[#fee2e2] text-[#991b1b]",
    VERIFIED:       "bg-[#dcfce7] text-[#166534]",
};

function formatDate(ts: string) {
    return new Date(ts).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdmissionsPage() {
    const [docs, setDocs]                   = useState<ApiAdmissionDocument[]>([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState<string | null>(null);
    const [activeFilter, setActiveFilter]   = useState<QueueStatus>("PENDING_REVIEW");
    const [search, setSearch]               = useState("");
    const [expanded, setExpanded]           = useState<number | null>(null);
    const [history, setHistory]             = useState<Record<number, { oldState: string; newState: string; timestamp: string }[]>>({});
    const [totalElements, setTotalElements] = useState(0);

    const [decisionModal, setDecisionModal] = useState<{
        doc: ApiAdmissionDocument;
        type: "approve" | "reject";
    } | null>(null);
    const [rejectReason, setRejectReason]   = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // ── Fetch queue ──
    const fetchQueue = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await academicApi.getAdmissionQueue({
                status: activeFilter,
                page: 0,
                size: 100,
            });
            setDocs(data.content ?? []);
            setTotalElements(data.totalElements ?? 0);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load admission queue");
        } finally {
            setLoading(false);
        }
    }, [activeFilter]);

    useEffect(() => { fetchQueue(); }, [fetchQueue]);

    // ── Fetch history on expand ──
    const handleExpand = async (docId: number, userId: number) => {
        if (expanded === docId) {
            setExpanded(null);
            return;
        }
        setExpanded(docId);
        if (!history[docId]) {
            try {
                const h = await academicApi.getApplicantHistory(userId);
                setHistory((prev) => ({ ...prev, [docId]: h }));
            } catch {
                // non-critical
            }
        }
    };

    // ── Update status ──
    // Swagger: PATCH /api/applicants/{id}/status
    // {id} — это userId заявителя (не id документа)
    const handleStatusUpdate = async (userId: number, docId: number, newState: string) => {
        setActionLoading(true);
        try {
            await academicApi.updateApplicantStatus(userId, newState);
            setDocs((prev) => prev.filter((d) => d.id !== docId));
            setTotalElements((prev) => Math.max(0, prev - 1));
            setDecisionModal(null);
            setRejectReason("");
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = docs.filter((d) =>
        search === "" ||
        d.fullName.toLowerCase().includes(search.toLowerCase()) ||
        d.type.toLowerCase().includes(search.toLowerCase())
    );

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
            <PageHeader
                title="Admissions"
                description="Review and process applicant documents — document queue"
            />

            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                <StatCard
                    label="Pending Review"
                    value={loading ? "—" : String(activeFilter === "PENDING_REVIEW" ? totalElements : "—")}
                    accent="warning"
                />
                <StatCard
                    label="Approved"
                    value={loading ? "—" : String(activeFilter === "VERIFIED" ? totalElements : "—")}
                    accent="success"
                />
                <StatCard
                    label="Rejected"
                    value={loading ? "—" : String(activeFilter === "REJECTED_DOCS" ? totalElements : "—")}
                    accent="danger"
                />
            </div>

            {/* Status Filter Tabs */}
            <div className="mb-4 flex gap-0 border-b border-border">
                {STATUS_FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                            activeFilter === f.value
                                ? "border-b-2 border-foreground text-foreground"
                                : "text-secondary-foreground hover:text-foreground"
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or document type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-sm rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
            </div>

            {!loading && (
                <p className="mb-3 text-sm text-secondary-foreground">
                    {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
                </p>
            )}

            {/* List */}
            {loading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-secondary-foreground">
                        No {activeFilter.replace(/_/g, " ").toLowerCase()} documents found.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((doc) => {
                        const docHistory = history[doc.id] ?? [];
                        const isPending  = doc.status === "PENDING_REVIEW";

                        return (
                            <div key={doc.id} className="rounded-lg border border-border bg-background">
                                <div className="flex items-center gap-3 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                                        <FileText className="h-5 w-5 text-secondary-foreground" />
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 gap-1 sm:grid-cols-4 sm:gap-4">
                                        <div>
                                            <p className="font-medium">{doc.fullName}</p>
                                            <p className="text-xs text-secondary-foreground">User ID: {doc.userId}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                {DOC_TYPE_LABELS[doc.type] ?? doc.type}
                                            </p>
                                            <p className="text-xs text-secondary-foreground">
                                                Uploaded {formatDate(doc.uploadedAt)}
                                            </p>
                                        </div>

                                        <div className="flex items-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[doc.status] ?? "bg-secondary text-foreground"
                      }`}>
                        {doc.status.replace(/_/g, " ")}
                      </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isPending && (
                                                <>
                                                    <button
                                                        onClick={() => setDecisionModal({ doc, type: "approve" })}
                                                        className="flex items-center gap-1 rounded-md bg-[#dcfce7] px-3 py-1.5 text-xs font-medium text-[#16a34a] hover:bg-[#bbf7d0]"
                                                    >
                                                        <Check className="h-3 w-3" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setDecisionModal({ doc, type: "reject" })}
                                                        className="flex items-center gap-1 rounded-md bg-[#fee2e2] px-3 py-1.5 text-xs font-medium text-[#dc2626] hover:bg-[#fecaca]"
                                                    >
                                                        <X className="h-3 w-3" /> Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleExpand(doc.id, doc.userId)}
                                                className="ml-auto rounded-md p-1.5 text-secondary-foreground hover:bg-secondary"
                                            >
                                                {expanded === doc.id
                                                    ? <ChevronUp className="h-4 w-4" />
                                                    : <ChevronDown className="h-4 w-4" />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded — History */}
                                {expanded === doc.id && (
                                    <div className="border-t border-border p-4">
                                        <p className="mb-2 text-sm font-medium">Status History</p>
                                        {docHistory.length === 0 ? (
                                            <p className="text-sm text-secondary-foreground">No history available.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {docHistory.map((h, i) => (
                                                    <div key={i} className="flex items-center gap-2 rounded-md bg-secondary/30 px-3 py-2 text-xs">
                            <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">
                              {h.oldState.replace(/_/g, " ")}
                            </span>
                                                        <span className="text-secondary-foreground">→</span>
                                                        <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">
                              {h.newState.replace(/_/g, " ")}
                            </span>
                                                        <span className="ml-auto text-secondary-foreground">
                              {new Date(h.timestamp).toLocaleString("en-US", {
                                  month: "short", day: "numeric",
                                  hour: "2-digit", minute: "2-digit",
                              })}
                            </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Decision Modal */}
            {decisionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
                        <h2 className="mb-1 font-semibold">
                            {decisionModal.type === "approve" ? "Approve Document" : "Reject Document"}
                        </h2>
                        <p className="mb-4 text-sm text-secondary-foreground">
                            {decisionModal.type === "approve"
                                ? `Approving ${DOC_TYPE_LABELS[decisionModal.doc.type] ?? decisionModal.doc.type} for ${decisionModal.doc.fullName}.`
                                : `Rejecting ${DOC_TYPE_LABELS[decisionModal.doc.type] ?? decisionModal.doc.type} for ${decisionModal.doc.fullName}. A reason is required.`
                            }
                        </p>

                        {decisionModal.type === "reject" && (
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium">
                                    Rejection Reason <span className="text-[#dc2626]">*</span>
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={3}
                                    placeholder="Describe why this document is being rejected..."
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                                />
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => { setDecisionModal(null); setRejectReason(""); }}
                                className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={
                                    actionLoading ||
                                    (decisionModal.type === "reject" && !rejectReason.trim())
                                }
                                onClick={() => {
                                    // Allowed values: APPLIED, DOCS_PENDING, DOCS_IN_REVIEW,
                                    // VERIFIED, EXAM_SCHEDULED, EXAM_IN_PROGRESS, EXAM_COMPLETED,
                                    // PASSED, FAILED, UNDER_REVIEW, ENROLLED, REJECTED_DOCS
                                    const newState = decisionModal.type === "approve"
                                        ? "VERIFIED"
                                        : "REJECTED_DOCS";
                                    handleStatusUpdate(
                                        decisionModal.doc.userId,
                                        decisionModal.doc.id,
                                        newState
                                    );
                                }}
                                className={`flex-1 rounded-md py-2 text-sm font-medium text-white disabled:opacity-40 ${
                                    decisionModal.type === "approve"
                                        ? "bg-[#16a34a] hover:bg-[#15803d]"
                                        : "bg-[#dc2626] hover:bg-[#b91c1c]"
                                }`}
                            >
                                {actionLoading
                                    ? "Processing..."
                                    : decisionModal.type === "approve"
                                        ? "Confirm Approve"
                                        : "Confirm Rejection"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}