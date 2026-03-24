"use client";

import { useState } from "react";
import { ExternalLink, Plus, Send } from "lucide-react";
import { CountdownBadge } from "@/components/academic/countdown-badge";
import { SectionCard } from "@/components/academic/section-card";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockCoordinationRequests,
  mockFinanceOverrides,
} from "@/constants/academic-mock-data";
import type { CoordinationDepartment } from "@/types/academic";

const TABS: Array<{ label: string; dept: CoordinationDepartment | "all" }> = [
  { label: "Finance", dept: "Finance" },
  { label: "AQAD", dept: "AQAD" },
  { label: "Resource", dept: "Resource" },
  { label: "Admin", dept: "Admin" },
];

export default function CoordinationPage() {
  const [activeTab, setActiveTab] = useState<CoordinationDepartment>("Finance");
  const [financeModal, setFinanceModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [financeForm, setFinanceForm] = useState({ student: "", debtAmount: "", reason: "", reasonCode: "", scope: "FullAccess", expiresAt: "" });
  const [requestForm, setRequestForm] = useState({ subject: "", description: "", priority: "Medium" });

  const deptRequests = mockCoordinationRequests.filter(
    (r) => r.toDepartment === activeTab || r.fromDepartment === activeTab
  );

  const pending = mockCoordinationRequests.filter((r) => r.status === "Pending").length;

  return (
    <div>
      <PageHeader title="Inter-Department Coordination" description="Manage requests and coordination with Finance, AQAD, Resource, and Admin" />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Requests" value={mockCoordinationRequests.length} />
        <StatCard label="Pending" value={pending} accent={pending > 0 ? "warning" : "default"} />
        <StatCard label="Finance Overrides" value={mockFinanceOverrides.filter((f) => f.isActive).length} accent="warning" subtitle="Active" />
        <StatCard label="Approved" value={mockCoordinationRequests.filter((r) => r.status === "Approved").length} accent="success" />
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex gap-0 border-b border-border">
        {TABS.map(({ label, dept }) => (
          <button
            key={dept}
            onClick={() => setActiveTab(dept as CoordinationDepartment)}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === dept
                ? "border-b-2 border-foreground text-foreground"
                : "text-secondary-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Finance Tab */}
      {activeTab === "Finance" && (
        <div className="space-y-6">
          <SectionCard
            title="Active Finance Overrides"
            action={
              <button
                onClick={() => setFinanceModal(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Grant Override
              </button>
            }
          >
            {mockFinanceOverrides.filter((f) => f.isActive).length === 0 ? (
              <p className="text-sm text-secondary-foreground">No active finance overrides.</p>
            ) : (
              <div className="space-y-3">
                {mockFinanceOverrides.filter((f) => f.isActive).map((fo) => (
                  <div key={fo.id} className="flex items-center justify-between rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3">
                    <div>
                      <p className="font-medium">{fo.studentName}</p>
                      <p className="text-sm text-secondary-foreground">
                        Debt: ${fo.debtAmount} · {fo.reasonCode.replace(/_/g, " ")} · {fo.scope.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-xs text-secondary-foreground">Granted by {fo.grantedBy}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CountdownBadge expiresAt={fo.expiresAt} />
                      <button className="text-xs text-[#dc2626] hover:underline">Revoke</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {mockFinanceOverrides.filter((f) => !f.isActive).length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-secondary-foreground uppercase tracking-wide">Expired Overrides</p>
                {mockFinanceOverrides.filter((f) => !f.isActive).map((fo) => (
                  <div key={fo.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2 opacity-60">
                    <p className="text-sm">{fo.studentName} — ${fo.debtAmount}</p>
                    <span className="rounded-full bg-[#f4f4f4] px-2.5 py-0.5 text-xs text-secondary-foreground">Expired</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Finance Coordination Requests"
            action={
              <button onClick={() => setRequestModal(true)} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline">
                <Send className="h-3.5 w-3.5" />
                New Request
              </button>
            }
          >
            <RequestTable requests={deptRequests} />
          </SectionCard>
        </div>
      )}

      {/* AQAD Tab */}
      {activeTab === "AQAD" && (
        <div className="space-y-6">
          <SectionCard
            title="AQAD Escalations"
            action={
              <button onClick={() => setRequestModal(true)} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline">
                <ExternalLink className="h-3.5 w-3.5" />
                Escalate Case
              </button>
            }
          >
            <p className="mb-4 text-sm text-secondary-foreground">
              Escalate quality issues to AQAD with full context: course, lecture, materials, exam, complaints.
            </p>
            <RequestTable requests={deptRequests} />
          </SectionCard>
        </div>
      )}

      {/* Resource Tab */}
      {activeTab === "Resource" && (
        <div className="space-y-6">
          <SectionCard
            title="Resource Department Requests"
            action={
              <button onClick={() => setRequestModal(true)} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline">
                <Plus className="h-3.5 w-3.5" />
                New Request
              </button>
            }
          >
            <p className="mb-4 text-sm text-secondary-foreground">
              Request teacher assignments, replacements, or room allocations from the Resource Department.
            </p>
            <RequestTable requests={deptRequests} />
          </SectionCard>
        </div>
      )}

      {/* Admin Tab */}
      {activeTab === "Admin" && (
        <div className="space-y-6">
          <SectionCard
            title="Admin Requests"
            action={
              <button onClick={() => setRequestModal(true)} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline">
                <Plus className="h-3.5 w-3.5" />
                New Request
              </button>
            }
          >
            <p className="mb-4 text-sm text-secondary-foreground">
              Request user deactivations, role changes, or system access from the Admin department.
            </p>
            <RequestTable requests={deptRequests} />
          </SectionCard>
        </div>
      )}

      {/* Finance Override Modal */}
      {financeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-4 font-semibold">Grant Finance Override</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Student <span className="text-[#dc2626]">*</span></label>
                <input value={financeForm.student} onChange={(e) => setFinanceForm({ ...financeForm, student: e.target.value })} placeholder="Student name or ID..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Debt Amount ($)</label>
                <input type="number" value={financeForm.debtAmount} onChange={(e) => setFinanceForm({ ...financeForm, debtAmount: e.target.value })} placeholder="0" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Reason Code <span className="text-[#dc2626]">*</span></label>
                <select value={financeForm.reasonCode} onChange={(e) => setFinanceForm({ ...financeForm, reasonCode: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="">Select…</option>
                  <option value="PAYMENT_PLAN">Payment Plan</option>
                  <option value="SCHOLARSHIP_PROCESSING">Scholarship Processing</option>
                  <option value="ADMINISTRATIVE_ERROR">Administrative Error</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Scope</label>
                  <select value={financeForm.scope} onChange={(e) => setFinanceForm({ ...financeForm, scope: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                    <option value="FullAccess">Full Access</option>
                    <option value="LecturesOnly">Lectures Only</option>
                    <option value="ExamOnly">Exam Only</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Expiry Date <span className="text-[#dc2626]">*</span></label>
                  <input type="date" value={financeForm.expiresAt} onChange={(e) => setFinanceForm({ ...financeForm, expiresAt: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setFinanceModal(false)} className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary">Cancel</button>
              <button
                disabled={!financeForm.student.trim() || !financeForm.reasonCode || !financeForm.expiresAt}
                onClick={() => setFinanceModal(false)}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
              >
                Grant Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {requestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-4 font-semibold">New Coordination Request → {activeTab}</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Subject <span className="text-[#dc2626]">*</span></label>
                <input value={requestForm.subject} onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })} placeholder="Brief subject..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Description</label>
                <textarea value={requestForm.description} onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })} rows={3} placeholder="Describe the request in detail..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Priority</label>
                <select value={requestForm.priority} onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setRequestModal(false)} className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary">Cancel</button>
              <button
                disabled={!requestForm.subject.trim()}
                onClick={() => setRequestModal(false)}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RequestTable({ requests }: { requests: typeof mockCoordinationRequests }) {
  if (requests.length === 0) {
    return <p className="text-sm text-secondary-foreground">No coordination requests yet.</p>;
  }
  return (
    <div className="space-y-2">
      {requests.map((r) => (
        <div key={r.id} className="flex items-start justify-between rounded-lg border border-border px-4 py-3">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{r.subject}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                r.priority === "High" ? "bg-[#fee2e2] text-[#dc2626]" :
                r.priority === "Medium" ? "bg-[#fef3c7] text-[#d97706]" :
                "bg-[#f4f4f4] text-[#6b7280]"
              }`}>
                {r.priority}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-secondary-foreground line-clamp-1">{r.description}</p>
            <p className="mt-1 text-xs text-secondary-foreground">
              {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {r.resolvedBy && ` · Resolved by ${r.resolvedBy}`}
            </p>
          </div>
          <StatusBadge status={r.status} />
        </div>
      ))}
    </div>
  );
}
