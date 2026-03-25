"use client";

import { useState } from "react";
import { SectionCard } from "@/components/aqad/section-card";
import { PageHeader } from "@/components/platform/page-header";

const TABS = [
  { id: "sla" as const, label: "SLA Configuration" },
  { id: "audit" as const, label: "Audit Schedule" },
  { id: "notifications" as const, label: "Notifications" },
  { id: "escalation" as const, label: "Escalation Rules" },
];

type NotificationKey =
  | "courseSubmitted" | "reviewAssigned" | "complaintFiled"
  | "correctiveCompleted" | "correctiveOverdue" | "auditReminder"
  | "slaWarning" | "reportGenerated";

const DEFAULT_NOTIFICATIONS: Record<NotificationKey, boolean> = {
  courseSubmitted: true,
  reviewAssigned: true,
  complaintFiled: true,
  correctiveCompleted: true,
  correctiveOverdue: true,
  auditReminder: true,
  slaWarning: true,
  reportGenerated: false,
};

const NOTIFICATION_LABELS: Record<NotificationKey, string> = {
  courseSubmitted: "Course submitted for review",
  reviewAssigned: "Review assigned to you",
  complaintFiled: "New complaint filed",
  correctiveCompleted: "Corrective action marked complete",
  correctiveOverdue: "Corrective action overdue",
  auditReminder: "Upcoming audit reminder (7 days before)",
  slaWarning: "SLA approaching violation",
  reportGenerated: "Quality report generated",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"sla" | "audit" | "notifications" | "escalation">("sla");
  const [sla, setSLA] = useState({ reviewDays: 7, complaintDays: 5, correctiveDays: 14 });
  const [auditFreq, setAuditFreq] = useState({ bachelor: 6, master: 6, phd: 12, lab: 6 });
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleNotification(key: NotificationKey) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <PageHeader title="AQAD Settings" description="Configure SLA policies, audit schedules, and notifications" />

      <div className="mb-6 flex gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-b-2 border-foreground text-foreground" : "text-secondary-foreground hover:text-foreground"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SLA Configuration */}
      {activeTab === "sla" && (
        <SectionCard title="SLA Configuration">
          <p className="mb-6 text-sm text-secondary-foreground">
            Define the maximum number of working days for each process type. Violations trigger alerts and escalation.
          </p>
          <div className="space-y-6">
            {[
              { label: "Course Review SLA", description: "Maximum days from submission to review decision", key: "reviewDays" as const },
              { label: "Complaint Resolution SLA", description: "Maximum days from complaint filing to resolution", key: "complaintDays" as const },
              { label: "Corrective Action Deadline", description: "Default days given to teacher for corrective actions", key: "correctiveDays" as const },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-6 rounded-lg border p-4">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="mt-0.5 text-xs text-secondary-foreground">{item.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={sla[item.key]}
                    onChange={(e) => setSLA((prev) => ({ ...prev, [item.key]: Number(e.target.value) }))}
                    className="w-20 rounded-md border border-border bg-background px-3 py-2 text-center text-sm focus:outline-none"
                  />
                  <span className="text-sm text-secondary-foreground">days</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </SectionCard>
      )}

      {/* Audit Schedule */}
      {activeTab === "audit" && (
        <SectionCard title="Periodic Audit Schedule">
          <p className="mb-6 text-sm text-secondary-foreground">
            Configure how often each program type undergoes a periodic quality audit.
          </p>
          <div className="space-y-4">
            {[
              { label: "Bachelor programs", key: "bachelor" as const },
              { label: "Master programs", key: "master" as const },
              { label: "PhD programs", key: "phd" as const },
              { label: "Lab-based courses", key: "lab" as const },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-lg border p-4">
                <p className="font-medium">{item.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-foreground">Every</span>
                  <select
                    value={auditFreq[item.key]}
                    onChange={(e) => setAuditFreq((prev) => ({ ...prev, [item.key]: Number(e.target.value) }))}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                  </select>
                  <span className="text-sm text-secondary-foreground">months</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </SectionCard>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <SectionCard title="Notification Settings">
          <p className="mb-6 text-sm text-secondary-foreground">
            Choose which events trigger notifications for AQAD staff.
          </p>
          <div className="space-y-3">
            {(Object.keys(notifications) as NotificationKey[]).map((key) => (
              <div key={key} className="flex items-center justify-between rounded-lg border px-4 py-3">
                <p className="text-sm">{NOTIFICATION_LABELS[key]}</p>
                <button
                  onClick={() => toggleNotification(key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${notifications[key] ? "bg-foreground" : "bg-secondary"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${notifications[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </SectionCard>
      )}

      {/* Escalation Rules */}
      {activeTab === "escalation" && (
        <SectionCard title="Escalation Rules">
          <p className="mb-6 text-sm text-secondary-foreground">
            Define who receives notifications when SLA is violated or critical issues arise.
          </p>
          <div className="space-y-4">
            {[
              { trigger: "Review SLA exceeded", description: "A course review has exceeded the configured SLA days", recipient: "AQAD Head of Department" },
              { trigger: "Complaint SLA exceeded", description: "A student complaint has not been resolved within SLA", recipient: "AQAD Head + Deputy Director" },
              { trigger: "Corrective action overdue (3+ days)", description: "A teacher has missed their corrective action deadline by 3+ days", recipient: "Academic Department Head" },
              { trigger: "Course suspended", description: "A published course has been suspended due to quality issues", recipient: "Deputy Director + Academic Department" },
            ].map((rule, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{rule.trigger}</p>
                    <p className="mt-0.5 text-xs text-secondary-foreground">{rule.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-secondary-foreground">Notify:</span>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{rule.recipient}</span>
                    </div>
                  </div>
                  <button className="shrink-0 rounded-md border px-2.5 py-1 text-xs hover:bg-secondary">Edit</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
