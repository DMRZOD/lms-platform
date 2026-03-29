"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { FileText, Loader2, Upload, CheckCircle2, XCircle, Clock } from "lucide-react";
import { applicantApi } from "@/lib/applicant-api";
import type { ApiAdmissionDocument } from "@/lib/applicant-api";

// ─── Constants ────────────────────────────────────────────────────────────────

const DOC_TYPES = [
    { value: "PASSPORT",    label: "Passport",    description: "Scan of your valid passport" },
    { value: "DIPLOMA",     label: "Diploma",     description: "Degree certificate or high school diploma" },
    { value: "CERTIFICATE", label: "Certificate", description: "Language certificate (IELTS, TOEFL, etc.)" },
] as const;

type DocType = "PASSPORT" | "DIPLOMA" | "CERTIFICATE";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    PENDING_REVIEW: {
        label: "Pending Review",
        color: "bg-[#fef9c3] text-[#854d0e]",
        icon: <Clock className="h-4 w-4 text-[#854d0e]" />,
    },
    APPROVED: {
        label: "Approved",
        color: "bg-[#dcfce7] text-[#166534]",
        icon: <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />,
    },
    REJECTED: {
        label: "Rejected",
        color: "bg-[#fee2e2] text-[#991b1b]",
        icon: <XCircle className="h-4 w-4 text-[#dc2626]" />,
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ApplicantDocumentsPage() {
    const [docs, setDocs]           = useState<ApiAdmissionDocument[]>([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState<string | null>(null);
    const [uploading, setUploading] = useState<DocType | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef              = useRef<HTMLInputElement>(null);
    const [pendingType, setPendingType] = useState<DocType | null>(null);

    // ── Fetch documents ──
    const fetchDocs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await applicantApi.getMyDocuments();
            setDocs(Array.isArray(data) ? data : []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load documents");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDocs(); }, [fetchDocs]);

    // ── Trigger file input ──
    const handleUploadClick = (type: DocType) => {
        setPendingType(type);
        setUploadError(null);
        fileInputRef.current?.click();
    };

    // ── Handle file selected ──
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !pendingType) return;
        e.target.value = "";

        setUploading(pendingType);
        setUploadError(null);
        try {
            const uploaded = await applicantApi.uploadDocument(pendingType, file);
            setDocs((prev) => {
                const exists = prev.findIndex((d) => d.type === pendingType);
                if (exists >= 0) {
                    const next = [...prev];
                    next[exists] = uploaded;
                    return next;
                }
                return [...prev, uploaded];
            });
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(null);
            setPendingType(null);
        }
    };

    // ── Stats ──
    const approved = docs.filter((d) => d.status === "APPROVED").length;
    const pending  = docs.filter((d) => d.status === "PENDING_REVIEW").length;
    const rejected = docs.filter((d) => d.status === "REJECTED").length;

    return (
        <div>
            <PageHeader
                title="Documents"
                description="Upload the required documents for your admission"
            />

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs text-secondary-foreground">Uploaded</p>
                    <p className="mt-1 text-2xl font-bold">{docs.length}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs text-secondary-foreground">Approved</p>
                    <p className="mt-1 text-2xl font-bold text-[#16a34a]">{approved}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs text-secondary-foreground">Pending</p>
                    <p className="mt-1 text-2xl font-bold text-[#854d0e]">{pending}</p>
                </div>
            </div>

            {/* Rejection alert */}
            {rejected > 0 && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">
                        {rejected} document(s) rejected
                    </p>
                    <p className="mt-1 text-sm text-red-700">
                        Please re-upload the rejected documents.
                    </p>
                </div>
            )}

            {/* Upload error */}
            {uploadError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {uploadError}
                </div>
            )}

            {loading ? (
                <div className="flex h-32 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-secondary-foreground" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center gap-2 py-10">
                    <p className="text-sm text-red-500">{error}</p>
                    <button onClick={fetchDocs} className="text-sm underline">Retry</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {DOC_TYPES.map(({ value, label, description }) => {
                        const uploaded = docs.find((d) => d.type === value);
                        const isUploading = uploading === value;
                        const statusCfg = uploaded
                            ? STATUS_CONFIG[uploaded.status] ?? STATUS_CONFIG["PENDING_REVIEW"]
                            : null;

                        return (
                            <div
                                key={value}
                                className={`rounded-lg border bg-background p-5 ${
                                    uploaded?.status === "REJECTED"
                                        ? "border-red-200"
                                        : uploaded?.status === "APPROVED"
                                            ? "border-green-200"
                                            : "border-border"
                                }`}
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                        <FileText className="h-5 w-5 text-secondary-foreground" />
                                    </div>
                                    {statusCfg && (
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                                    )}
                                </div>

                                <h3 className="font-semibold">{label}</h3>
                                <p className="mt-0.5 text-sm text-secondary-foreground">{description}</p>

                                {uploaded && (
                                    <div className="mt-3 flex items-center gap-2 rounded-md bg-secondary/50 px-2.5 py-2 text-xs">
                                        {statusCfg?.icon}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium">{uploaded.type}</p>
                                            <p className="text-secondary-foreground">
                                                {new Date(uploaded.uploadedAt).toLocaleDateString("en-US", {
                                                    month: "short", day: "numeric", year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    disabled={isUploading}
                                    onClick={() => handleUploadClick(value)}
                                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                                        uploaded
                                            ? "border-border hover:bg-secondary"
                                            : "border-foreground bg-foreground text-background hover:opacity-90"
                                    }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            {uploaded ? "Re-upload" : "Upload"}
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}