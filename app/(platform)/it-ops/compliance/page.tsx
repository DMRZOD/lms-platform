"use client";

import { useState } from "react";
import { ClipboardCheck, ShieldCheck } from "lucide-react";

import { FilterBar } from "@/components/it-ops/filter-bar";
import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAuditLog,
  mockComplianceFrameworks,
  mockComplianceStats,
  mockPolicyViolations,
} from "@/constants/it-ops-mock-data";

const complianceColors: Record<string, { bg: string; text: string }> = {
  Compliant: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  PartiallyCompliant: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  NonCompliant: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  InReview: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
};

const violationSeverityColors: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  high: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  medium: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  low: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
  info: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
};

const violationStatusColors: Record<string, { bg: string; text: string }> = {
  Open: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Resolved: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Accepted: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
};

const auditFilters = [
  { label: "All", value: "all" },
  { label: "Network", value: "Network" },
  { label: "Access", value: "Access" },
  { label: "Backup", value: "Backup" },
  { label: "Operations", value: "Operations" },
  { label: "Security", value: "Security" },
];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ItOpsCompliancePage() {
  const [auditFilter, setAuditFilter] = useState("all");
  const [auditSearch, setAuditSearch] = useState("");

  const stats = mockComplianceStats;

  const filteredAudit = mockAuditLog.filter((entry) => {
    const matchesCategory = auditFilter === "all" || entry.category === auditFilter;
    const matchesSearch =
      entry.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      entry.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
      entry.target.toLowerCase().includes(auditSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const overallPct = Math.round((stats.controlsPassed / stats.controlsTotal) * 100);

  return (
    <div>
      <PageHeader
        title="Compliance & Auditing"
        description="Framework compliance status, audit logs, and policy violations"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Frameworks"
          value={stats.frameworksTotal}
          icon={ShieldCheck}
        />
        <StatCard
          label="Compliant"
          value={stats.compliant}
          accent="success"
          subtitle={`of ${stats.frameworksTotal} frameworks`}
        />
        <StatCard
          label="Policy Violations"
          value={stats.violations}
          accent={stats.violations > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Pending Audits"
          value={stats.pendingAudits}
          icon={ClipboardCheck}
          accent={stats.pendingAudits > 0 ? "info" : "default"}
        />
        <StatCard
          label="Controls Passed"
          value={stats.controlsPassed}
          subtitle={`of ${stats.controlsTotal} total`}
          accent="success"
        />
        <StatCard
          label="Overall Compliance"
          value={`${overallPct}%`}
          accent={overallPct >= 90 ? "success" : overallPct >= 75 ? "warning" : "danger"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Compliance Frameworks */}
          <SectionCard title="Compliance Frameworks">
            <div className="space-y-4">
              {mockComplianceFrameworks.map((fw) => {
                const colors = complianceColors[fw.status] ?? complianceColors.InReview;
                const pct = Math.round((fw.controlsPassed / fw.controlsTotal) * 100);
                return (
                  <div key={fw.id} className="rounded-md border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{fw.name}</p>
                        <p className="text-xs text-secondary-foreground">
                          Next audit: {fw.nextAudit} · Last audit: {fw.lastAudit}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {fw.status === "PartiallyCompliant" ? "Partial" : fw.status}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-foreground">Controls</span>
                        <span className="font-medium">{fw.controlsPassed}/{fw.controlsTotal} ({pct}%)</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full ${pct >= 95 ? "bg-[#22c55e]" : pct >= 75 ? "bg-[#f59e0b]" : "bg-[#ef4444]"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {fw.controlsFailed > 0 && (
                        <p className="mt-0.5 text-xs text-[#dc2626]">{fw.controlsFailed} controls failed</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Audit Log */}
          <SectionCard title="Audit Log">
            <FilterBar
              filters={auditFilters}
              activeFilter={auditFilter}
              onFilterChange={setAuditFilter}
              searchValue={auditSearch}
              onSearchChange={setAuditSearch}
              placeholder="Search audit log..."
            />
            <div className="divide-y divide-border">
              {filteredAudit.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 shrink-0 rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {entry.category}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{entry.action}</p>
                    <p className="text-xs text-secondary-foreground">{entry.details}</p>
                    <p className="mt-0.5 text-xs text-secondary-foreground">
                      {entry.actor} → {entry.target} · {formatDateTime(entry.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Policy Violations */}
          <SectionCard title="Policy Violations">
            <div className="divide-y divide-border">
              {mockPolicyViolations.map((viol) => {
                const sevColors = violationSeverityColors[viol.severity] ?? violationSeverityColors.info;
                const stColors = violationStatusColors[viol.status] ?? violationStatusColors.Open;
                return (
                  <div key={viol.id} className="py-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sevColors.bg} ${sevColors.text}`}>
                        {viol.severity.toUpperCase()}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stColors.bg} ${stColors.text}`}>
                        {viol.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{viol.policy}</p>
                    <p className="text-xs text-secondary-foreground">
                      Violated by: {viol.violatedBy}
                    </p>
                    <p className="text-xs text-secondary-foreground">
                      Detected: {formatDateTime(viol.detectedAt)}
                    </p>
                    {viol.resolution && (
                      <p className="mt-0.5 text-xs text-[#166534]">{viol.resolution}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Upcoming Audits */}
          <SectionCard title="Scheduled Audits">
            <div className="space-y-3">
              {mockComplianceFrameworks
                .filter((fw) => fw.status !== "Compliant")
                .map((fw) => (
                  <div key={fw.id} className="rounded-md border border-border p-3">
                    <p className="text-sm font-medium">{fw.name} Audit</p>
                    <p className="text-xs text-secondary-foreground">Scheduled: {fw.nextAudit}</p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-foreground"
                        style={{ width: `${Math.round((fw.controlsPassed / fw.controlsTotal) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </SectionCard>

          {/* Evidence Collection */}
          <SectionCard title="Evidence Collection">
            <div className="space-y-2.5 text-sm">
              {[
                { label: "Access logs exported", status: "Done" },
                { label: "Encryption audit report", status: "Done" },
                { label: "Vulnerability scan results", status: "Done" },
                { label: "Penetration test report", status: "Pending" },
                { label: "DPIA documentation", status: "In Progress" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <span className="text-secondary-foreground">{item.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.status === "Done" ? "bg-[#dcfce7] text-[#166534]" :
                    item.status === "In Progress" ? "bg-[#eff6ff] text-[#1e40af]" :
                    "bg-[#f1f5f9] text-[#475569]"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
