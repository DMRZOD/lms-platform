"use client";

import { useState } from "react";
import { Ban, Lock, Shield, ShieldAlert } from "lucide-react";

import { FilterBar } from "@/components/it-ops/filter-bar";
import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockFirewallRules,
  mockSSLCertificates,
  mockVulnerabilityScans,
  mockSecurityEvents,
  mockSecurityStats,
  mockComplianceFrameworks,
} from "@/constants/it-ops-mock-data";

const certStatusColors: Record<string, { bg: string; text: string }> = {
  Valid: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  ExpiringSoon: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Expired: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

const eventSeverityColors: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  high: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  medium: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  low: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
  info: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
};

const complianceColors: Record<string, { bg: string; text: string }> = {
  Compliant: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  PartiallyCompliant: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  NonCompliant: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  InReview: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
};

const eventFilters = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
  { label: "Info", value: "info" },
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

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

export default function ItOpsSecurityPage() {
  const [eventFilter, setEventFilter] = useState("all");
  const [eventSearch, setEventSearch] = useState("");

  const stats = mockSecurityStats;

  const filteredEvents = mockSecurityEvents.filter((e) => {
    const matchesSeverity = eventFilter === "all" || e.severity === eventFilter;
    const matchesSearch =
      e.type.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.details.toLowerCase().includes(eventSearch.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const totalVulns = mockVulnerabilityScans.reduce(
    (acc, s) => acc + s.critical + s.high,
    0
  );

  return (
    <div>
      <PageHeader
        title="Infrastructure Security"
        description="SSL certificates, firewall rules, vulnerability scans, and security events"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Firewall Rules"
          value={stats.firewallRules}
          icon={Shield}
          subtitle={`${mockFirewallRules.filter((r) => r.enabled).length} active`}
        />
        <StatCard
          label="SSL Certificates"
          value={stats.sslCertificates}
          icon={Lock}
          subtitle={`${mockSSLCertificates.filter((c) => c.status === "ExpiringSoon").length} expiring soon`}
          accent={mockSSLCertificates.some((c) => c.status === "Expired") ? "danger" : mockSSLCertificates.some((c) => c.status === "ExpiringSoon") ? "warning" : "default"}
        />
        <StatCard
          label="Vulnerabilities"
          value={totalVulns}
          icon={ShieldAlert}
          subtitle="Critical + High"
          accent={totalVulns > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Failed Logins (24h)"
          value={stats.failedLogins24h}
          accent={stats.failedLogins24h > 20 ? "warning" : "default"}
        />
        <StatCard
          label="Blocked IPs"
          value={stats.blockedIPs}
          icon={Ban}
        />
        <StatCard
          label="Security Events (24h)"
          value={stats.securityEvents24h}
          accent="info"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* SSL Certificates */}
          <SectionCard title="SSL Certificates">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Domain</th>
                    <th className="pb-3 font-medium">Issuer</th>
                    <th className="pb-3 font-medium">Expires</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Auto-Renew</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockSSLCertificates.map((cert) => {
                    const colors = certStatusColors[cert.status] ?? certStatusColors.Valid;
                    const days = daysUntil(cert.expiresAt);
                    return (
                      <tr key={cert.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{cert.domain}</td>
                        <td className="py-2.5 text-secondary-foreground">{cert.issuer}</td>
                        <td className={`py-2.5 ${days < 30 && days > 0 ? "text-[#b45309] font-medium" : days <= 0 ? "text-[#dc2626] font-medium" : "text-secondary-foreground"}`}>
                          {cert.expiresAt}{days > 0 ? ` (${days}d)` : " (expired)"}
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cert.autoRenew ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f1f5f9] text-[#475569]"}`}>
                            {cert.autoRenew ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Vulnerability Scans */}
          <SectionCard title="Vulnerability Scan Results">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Target</th>
                    <th className="pb-3 font-medium">Critical</th>
                    <th className="pb-3 font-medium">High</th>
                    <th className="pb-3 font-medium">Medium</th>
                    <th className="pb-3 font-medium">Low</th>
                    <th className="pb-3 font-medium">Scan Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockVulnerabilityScans.map((scan) => (
                    <tr key={scan.id} className="transition-colors hover:bg-secondary/40">
                      <td className="py-2.5 font-medium">{scan.target}</td>
                      <td className={`py-2.5 font-medium ${scan.critical > 0 ? "text-[#dc2626]" : "text-secondary-foreground"}`}>
                        {scan.critical}
                      </td>
                      <td className={`py-2.5 font-medium ${scan.high > 0 ? "text-[#b45309]" : "text-secondary-foreground"}`}>
                        {scan.high}
                      </td>
                      <td className="py-2.5 text-secondary-foreground">{scan.medium}</td>
                      <td className="py-2.5 text-secondary-foreground">{scan.low}</td>
                      <td className="py-2.5 text-secondary-foreground">
                        {formatDateTime(scan.timestamp)}
                        {scan.status === "Running" && (
                          <span className="ml-2 rounded-full bg-[#eff6ff] px-2 py-0.5 text-xs text-[#1e40af]">Running</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Security Events Log */}
          <SectionCard title="Security Events Log">
            <FilterBar
              filters={eventFilters}
              activeFilter={eventFilter}
              onFilterChange={setEventFilter}
              searchValue={eventSearch}
              onSearchChange={setEventSearch}
              placeholder="Search events..."
            />
            <div className="divide-y divide-border">
              {filteredEvents.map((evt) => {
                const colors = eventSeverityColors[evt.severity] ?? eventSeverityColors.info;
                return (
                  <div key={evt.id} className="flex items-start gap-3 py-3">
                    <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {evt.severity.toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{evt.type}</p>
                      <p className="text-xs text-secondary-foreground">{evt.details}</p>
                      <p className="mt-0.5 text-xs text-secondary-foreground">
                        {evt.sourceIP} · {formatDateTime(evt.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Firewall Rules */}
          <SectionCard title="Firewall Rules">
            <div className="divide-y divide-border">
              {mockFirewallRules.map((rule) => (
                <div key={rule.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{rule.name}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      rule.action === "Allow" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"
                    }`}>
                      {rule.action}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-secondary-foreground">
                    {rule.source} → Port {rule.port} ({rule.protocol})
                  </p>
                  {!rule.enabled && (
                    <span className="mt-1 text-xs text-[#94a3b8]">Disabled</span>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Compliance Quick Status */}
          <SectionCard title="Compliance Quick Status">
            <div className="space-y-3">
              {mockComplianceFrameworks.map((fw) => {
                const colors = complianceColors[fw.status] ?? complianceColors.InReview;
                const pct = Math.round((fw.controlsPassed / fw.controlsTotal) * 100);
                return (
                  <div key={fw.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{fw.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {fw.status === "PartiallyCompliant" ? "Partial" : fw.status}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${pct >= 95 ? "bg-[#22c55e]" : pct >= 75 ? "bg-[#f59e0b]" : "bg-[#ef4444]"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-secondary-foreground">
                      {fw.controlsPassed}/{fw.controlsTotal} controls passed ({pct}%)
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
