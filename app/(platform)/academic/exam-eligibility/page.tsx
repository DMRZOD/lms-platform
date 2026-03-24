"use client";

import { useState } from "react";
import { Check, Settings, X } from "lucide-react";
import { FilterBar } from "@/components/academic/filter-bar";
import { SectionCard } from "@/components/academic/section-card";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockEligibilityRecords,
  mockEligibilityRules,
} from "@/constants/academic-mock-data";
import type { EligibilityRecord } from "@/types/academic";

const TABS = ["Rules", "Monitoring", "Exceptions", "Re-Exam Windows"];

export default function ExamEligibilityPage() {
  const [activeTab, setActiveTab] = useState("Monitoring");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [grantModal, setGrantModal] = useState<EligibilityRecord | null>(null);
  const [exceptionForm, setExceptionForm] = useState({ reason: "", scope: "FullAccess", days: "30" });

  const filters = [
    { label: "All", value: "all" },
    { label: "Eligible", value: "Eligible" },
    { label: "Ineligible", value: "Ineligible" },
    { label: "Override", value: "Override" },
  ];

  const filtered = mockEligibilityRecords.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.courseName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const eligible = mockEligibilityRecords.filter((r) => r.status === "Eligible").length;
  const ineligible = mockEligibilityRecords.filter((r) => r.status === "Ineligible").length;
  const overrides = mockEligibilityRecords.filter((r) => r.status === "Override").length;

  return (
    <div>
      <PageHeader title="Exam Eligibility" description="Monitor and manage student exam access conditions" />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Records" value={mockEligibilityRecords.length} />
        <StatCard label="Eligible" value={eligible} accent="success" />
        <StatCard label="Ineligible" value={ineligible} accent={ineligible > 0 ? "danger" : "default"} />
        <StatCard label="With Override" value={overrides} accent={overrides > 0 ? "warning" : "default"} />
      </div>

      <div className="mb-6 flex gap-0 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-foreground text-foreground"
                : "text-secondary-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Rules */}
      {activeTab === "Rules" && (
        <div className="space-y-3">
          {mockEligibilityRules.map((rule) => (
            <div key={rule.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-5">
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full ${rule.isActive ? "bg-[#22c55e]" : "bg-[#d1d5db]"}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{rule.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      rule.type === "attendance" ? "bg-[#dbeafe] text-[#2563eb]" :
                      rule.type === "finance" ? "bg-[#fee2e2] text-[#dc2626]" :
                      rule.type === "prerequisite" ? "bg-[#ede9fe] text-[#7c3aed]" :
                      "bg-[#fef3c7] text-[#d97706]"
                    }`}>{rule.type}</span>
                  </div>
                  <p className="mt-1 text-sm text-secondary-foreground">{rule.description}</p>
                  {rule.threshold !== undefined && (
                    <p className="mt-1 text-xs text-secondary-foreground">Threshold: <strong>{rule.threshold}%</strong></p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`text-sm ${rule.isActive ? "text-[#16a34a]" : "text-secondary-foreground"}`}>
                  {rule.isActive ? "Active" : "Inactive"}
                </span>
                <button className="rounded-md border border-border p-1.5 hover:bg-secondary">
                  <Settings className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring */}
      {activeTab === "Monitoring" && (
        <>
          <FilterBar
            filters={filters}
            activeFilter={filter}
            onFilterChange={setFilter}
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search student or course..."
          />
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Student</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Course</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Attendance</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Finance</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Prerequisites</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Sanctions</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-secondary-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className={r.status === "Ineligible" ? "bg-[#fff8f8]" : ""}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.studentName}</p>
                      <p className="text-xs text-secondary-foreground">{r.groupName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{r.courseName}</p>
                      <p className="text-xs text-secondary-foreground">{r.examType}</p>
                    </td>
                    {(["attendance", "finance", "prerequisite", "sanction"] as const).map((key) => {
                      const check = r.checks[key];
                      return (
                        <td key={key} className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {check.passed ? (
                              <Check className="h-4 w-4 text-[#16a34a]" />
                            ) : (
                              <X className="h-4 w-4 text-[#dc2626]" />
                            )}
                            <span className={`text-xs ${!check.passed ? "text-[#dc2626]" : "text-secondary-foreground"}`}>
                              {check.value ?? (check.passed ? "OK" : "Fail")}
                            </span>
                          </div>
                          {check.note && <p className="text-xs text-[#dc2626]">{check.note}</p>}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      {r.status === "Ineligible" && (
                        <button
                          onClick={() => setGrantModal(r)}
                          className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-secondary"
                        >
                          Grant Override
                        </button>
                      )}
                      {r.status === "Override" && (
                        <span className="text-xs text-[#d97706]">Override active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Exceptions (active overrides) */}
      {activeTab === "Exceptions" && (
        <SectionCard title="Active Eligibility Overrides">
          <div className="space-y-3">
            {mockEligibilityRecords.filter((r) => r.status === "Override").map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3">
                <div>
                  <p className="font-medium">{r.studentName}</p>
                  <p className="text-sm text-secondary-foreground">{r.courseName} · {r.examType}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status="Override" />
                  <button className="text-xs text-[#dc2626] hover:underline">Revoke</button>
                </div>
              </div>
            ))}
            {mockEligibilityRecords.filter((r) => r.status === "Override").length === 0 && (
              <p className="text-sm text-secondary-foreground">No active overrides.</p>
            )}
          </div>
        </SectionCard>
      )}

      {/* Re-Exam Windows */}
      {activeTab === "Re-Exam Windows" && (
        <div className="space-y-4">
          <SectionCard title="Current Re-Exam Windows">
            <div className="space-y-3">
              {["Database Systems", "Machine Learning", "Operating Systems"].map((course, i) => (
                <div key={course} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">{course}</p>
                    <p className="text-sm text-secondary-foreground">
                      Apr {10 + i * 5}–Apr {14 + i * 5}, 2026 · Max {i < 2 ? 2 : 1} attempt{i < 2 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-medium text-[#16a34a]">Active</span>
                    <button className="text-xs text-secondary-foreground hover:text-foreground">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <button className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">
            + Add Re-Exam Window
          </button>
        </div>
      )}

      {/* Grant Override Modal */}
      {grantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-1 font-semibold">Grant Eligibility Override</h2>
            <p className="mb-4 text-sm text-secondary-foreground">
              Overriding exam eligibility for <strong>{grantModal.studentName}</strong> — {grantModal.courseName}.
              All fields are required and this action will be audited.
            </p>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Reason <span className="text-[#dc2626]">*</span></label>
                <textarea
                  value={exceptionForm.reason}
                  onChange={(e) => setExceptionForm({ ...exceptionForm, reason: e.target.value })}
                  rows={2}
                  placeholder="Reason for granting eligibility override..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Scope</label>
                <select
                  value={exceptionForm.scope}
                  onChange={(e) => setExceptionForm({ ...exceptionForm, scope: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="ExamOnly">Exam Only</option>
                  <option value="LecturesOnly">Lectures Only</option>
                  <option value="FullAccess">Full Access</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Duration (days)</label>
                <input
                  type="number"
                  value={exceptionForm.days}
                  onChange={(e) => setExceptionForm({ ...exceptionForm, days: e.target.value })}
                  min={1}
                  max={180}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setGrantModal(null)} className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary">Cancel</button>
              <button
                disabled={!exceptionForm.reason.trim()}
                onClick={() => setGrantModal(null)}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
              >
                Grant Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
