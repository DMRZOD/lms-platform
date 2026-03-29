"use client";

import { AlertCircle, AlertTriangle, Download, ScrollText, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { apiClient } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuditLog {
  id: number | string;
  timestamp: string;
  action: string;
  entityType?: string;
  entityId?: string | number;
  performedBy?: string;
  userId?: number;
  ipAddress?: string;
  details?: string;
  level?: string;
  source?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const levelFilters = [
  { label: "All",      value: "all" },
  { label: "Info",     value: "INFO" },
  { label: "Warning",  value: "WARNING" },
  { label: "Error",    value: "ERROR" },
  { label: "Critical", value: "CRITICAL" },
];

const levelColors: Record<string, { bg: string; text: string; label: string }> = {
  INFO:     { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]", label: "INFO"  },
  WARNING:  { bg: "bg-[#fffbeb]", text: "text-[#b45309]", label: "WARN"  },
  ERROR:    { bg: "bg-[#fef2f2]", text: "text-[#b91c1c]", label: "ERROR" },
  CRITICAL: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]", label: "CRIT"  },
  info:     { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]", label: "INFO"  },
  warning:  { bg: "bg-[#fffbeb]", text: "text-[#b45309]", label: "WARN"  },
  error:    { bg: "bg-[#fef2f2]", text: "text-[#b91c1c]", label: "ERROR" },
  critical: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]", label: "CRIT"  },
};

const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://online-university.onrender.com";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLogsPage() {
  const [logs, setLogs]               = useState<AuditLog[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState("all");
  const [search, setSearch]           = useState("");
  const [exporting, setExporting]     = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<AuditLog[] | { content: AuditLog[] }>(
          "/api/admin/audit"
      );
      const logsArray = Array.isArray(data)
          ? data
          : (data as { content: AuditLog[] }).content ?? [];
      setLogs(logsArray);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // ── Export — скачивает файл напрямую через fetch ──
  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const token =
          typeof window !== "undefined"
              ? localStorage.getItem("accessToken")
              : null;

      const res = await fetch(`${BASE_URL}/api/admin/audit/export`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            (err as { message?: string }).message || `HTTP ${res.status}`
        );
      }

      // Определяем имя файла из Content-Disposition или ставим дефолтное
      const disposition = res.headers.get("Content-Disposition");
      let fileName = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
      if (disposition) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match?.[1]) fileName = match[1].replace(/['"]/g, "");
      }

      // Определяем тип контента
      const contentType =
          res.headers.get("Content-Type") ?? "text/csv;charset=utf-8";

      const blob = await res.blob();
      const url  = URL.createObjectURL(
          new Blob([blob], { type: contentType })
      );

      // Программно кликаем ссылку для скачивания
      const link    = document.createElement("a");
      link.href     = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setExportError(
          err instanceof Error ? err.message : "Export failed"
      );
    } finally {
      setExporting(false);
    }
  };

  // ── Filtering ──
  const filtered = logs.filter((log) => {
    const level      = log.level?.toUpperCase() ?? "";
    const matchLevel = levelFilter === "all" || level === levelFilter;
    const matchSearch =
        search === "" ||
        log.action?.toLowerCase().includes(search.toLowerCase()) ||
        log.performedBy?.toLowerCase().includes(search.toLowerCase()) ||
        log.entityType?.toLowerCase().includes(search.toLowerCase()) ||
        log.ipAddress?.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  // ── Stats ──
  const errors   = logs.filter((l) => ["ERROR",    "error"   ].includes(l.level ?? "")).length;
  const warnings = logs.filter((l) => ["WARNING",  "warning" ].includes(l.level ?? "")).length;
  const critical = logs.filter((l) => ["CRITICAL", "critical"].includes(l.level ?? "")).length;

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button
              onClick={fetchLogs}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        <PageHeader
            title="Audit Logs"
            description="System audit trail — all admin actions and events"

        />

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatCard
              label="Total Logs"
              value={loading ? "—" : logs.length.toLocaleString()}
              icon={ScrollText}
          />
          <StatCard
              label="Errors"
              value={loading ? "—" : errors}
              icon={XCircle}
              accent={errors > 10 ? "danger" : "default"}
          />
          <StatCard
              label="Warnings"
              value={loading ? "—" : warnings}
              icon={AlertTriangle}
              accent={warnings > 50 ? "warning" : "default"}
          />
          <StatCard
              label="Critical Events"
              value={loading ? "—" : critical}
              icon={AlertCircle}
              accent={critical > 0 ? "danger" : "success"}
          />
        </div>

        <SectionCard>
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              {levelFilters.map((f) => (
                  <button
                      key={f.value}
                      onClick={() => setLevelFilter(f.value)}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                          levelFilter === f.value
                              ? "bg-foreground text-background"
                              : "border border-border bg-background text-foreground hover:bg-secondary"
                      }`}
                  >
                    {f.label}
                  </button>
              ))}
              <div className="flex flex-wrap  gap-1.5">
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  {exporting ? "Downloading..." : "Download CSV"}
                </button>

                {/* Export error */}
                {exportError && (
                    <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                      <span>{exportError}</span>
                      <button
                          onClick={() => setExportError(null)}
                          className="ml-3 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full rounded-md border border-border bg-background py-1.5 px-3 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 sm:w-64"
              />
              <span className="ml-4 text-sm text-secondary-foreground">
              {loading
                  ? "Loading..."
                  : `${filtered.length} entr${filtered.length !== 1 ? "ies" : "y"}`
              }
            </span>
            </div>
          </div>

          {/* Log entries */}
          {loading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-md bg-secondary" />
                ))}
              </div>
          ) : (
              <div className="space-y-2">
                {filtered.map((log) => {
                  const level = log.level?.toUpperCase() ?? "INFO";
                  const lc    = levelColors[level] ?? levelColors.INFO;
                  return (
                      <div
                          key={log.id}
                          className="flex items-start gap-3 rounded-md border border-border p-3 hover:bg-secondary/40 transition-colors"
                      >
                  <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-bold ${lc.bg} ${lc.text}`}>
                    {lc.label}
                  </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-secondary-foreground">
                            {log.timestamp  && <span>{formatDateTime(log.timestamp)}</span>}
                            {log.performedBy && <span>By: {log.performedBy}</span>}
                            {log.entityType  && <span>Entity: {log.entityType}</span>}
                            {log.entityId    && <span>ID: {log.entityId}</span>}
                            {log.ipAddress   && <span className="font-mono">{log.ipAddress}</span>}
                          </div>
                          {log.details && (
                              <p className="mt-1 text-xs text-secondary-foreground">
                                {log.details}
                              </p>
                          )}
                        </div>
                      </div>
                  );
                })}
                {filtered.length === 0 && (
                    <p className="py-8 text-center text-sm text-secondary-foreground">
                      No log entries match the selected filters.
                    </p>
                )}
              </div>
          )}
        </SectionCard>
      </div>
  );
}