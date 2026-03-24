"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SectionCard } from "@/components/academic/section-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockDepartmentSettings } from "@/constants/academic-mock-data";

export default function AcademicSettingsPage() {
  const [settings, setSettings] = useState({ ...mockDepartmentSettings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <PageHeader title="Department Settings" description="Configure Academic Department rules, policies, and notifications" />

      <div className="max-w-2xl space-y-6">
        {/* Semester Configuration */}
        <SectionCard title="Semester Configuration">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Current Semester</label>
              <input
                value={settings.currentSemester}
                onChange={(e) => setSettings({ ...settings, currentSemester: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Semester Start</label>
                <input
                  type="date"
                  value={settings.semesterStart}
                  onChange={(e) => setSettings({ ...settings, semesterStart: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Semester End</label>
                <input
                  type="date"
                  value={settings.semesterEnd}
                  onChange={(e) => setSettings({ ...settings, semesterEnd: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Eligibility Defaults */}
        <SectionCard title="Eligibility Defaults">
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <label className="font-medium">Default Min Attendance</label>
                <span className="font-bold">{settings.defaultMinAttendance}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={settings.defaultMinAttendance}
                onChange={(e) => setSettings({ ...settings, defaultMinAttendance: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  onClick={() => setSettings({ ...settings, debtBlockingEnabled: !settings.debtBlockingEnabled })}
                  className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${settings.debtBlockingEnabled ? "bg-foreground" : "bg-secondary"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform ${settings.debtBlockingEnabled ? "translate-x-4" : ""}`} />
                </div>
                <span className="text-sm">Enable debt blocking (restrict access for students with debt)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  onClick={() => setSettings({ ...settings, sanctionBlockingEnabled: !settings.sanctionBlockingEnabled })}
                  className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${settings.sanctionBlockingEnabled ? "bg-foreground" : "bg-secondary"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform ${settings.sanctionBlockingEnabled ? "translate-x-4" : ""}`} />
                </div>
                <span className="text-sm">Enable sanction blocking (restrict access for disciplinary cases)</span>
              </label>
            </div>
          </div>
        </SectionCard>

        {/* Schedule Sync */}
        <SectionCard title="Schedule Sync (aSc Timetable)">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Sync Frequency (hours)</label>
              <select
                value={settings.syncFrequencyHours}
                onChange={(e) => setSettings({ ...settings, syncFrequencyHours: Number(e.target.value) })}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              >
                <option value={24}>Daily (24h)</option>
                <option value={48}>Every 2 days</option>
                <option value={168}>Weekly (168h)</option>
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => setSettings({ ...settings, autoResolveConflicts: !settings.autoResolveConflicts })}
                className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${settings.autoResolveConflicts ? "bg-foreground" : "bg-secondary"}`}
              >
                <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform ${settings.autoResolveConflicts ? "translate-x-4" : ""}`} />
              </div>
              <div>
                <span className="text-sm">Auto-resolve sync conflicts</span>
                <p className="text-xs text-secondary-foreground">When enabled, conflicts are automatically resolved using the most recent aSc data</p>
              </div>
            </label>
          </div>
        </SectionCard>

        {/* Notification Preferences */}
        <SectionCard title="Notification Preferences">
          <div className="space-y-3">
            {[
              { key: "notifyOnAdmission" as const, label: "Admission decision required", desc: "When a new application enters the queue" },
              { key: "notifyOnEligibilityChange" as const, label: "Eligibility status change", desc: "When a student's exam eligibility changes" },
              { key: "notifyOnAtRisk" as const, label: "At-risk student alert", desc: "Daily summary of students flagged as at-risk" },
              { key: "notifyOnExceptionExpiry" as const, label: "Exception expiring soon", desc: "48 hours before an exception expires" },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex cursor-pointer items-start gap-3">
                <div
                  onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
                  className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer ${settings[key] ? "bg-foreground" : "bg-secondary"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform ${settings[key] ? "translate-x-4" : ""}`} />
                </div>
                <div>
                  <span className="text-sm font-medium">{label}</span>
                  <p className="text-xs text-secondary-foreground">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* Audit Policy */}
        <SectionCard title="Audit Policy">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Audit Log Retention (days)</label>
              <select
                value={settings.auditRetentionDays}
                onChange={(e) => setSettings({ ...settings, auditRetentionDays: Number(e.target.value) })}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              >
                <option value={365}>1 year (365 days)</option>
                <option value={730}>2 years (730 days)</option>
                <option value={1825}>5 years (1825 days)</option>
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => setSettings({ ...settings, autoArchiveExpiredExceptions: !settings.autoArchiveExpiredExceptions })}
                className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${settings.autoArchiveExpiredExceptions ? "bg-foreground" : "bg-secondary"}`}
              >
                <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform ${settings.autoArchiveExpiredExceptions ? "translate-x-4" : ""}`} />
              </div>
              <span className="text-sm">Auto-archive expired exceptions</span>
            </label>
          </div>
        </SectionCard>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            Save Settings
          </button>
          {saved && (
            <div className="flex items-center gap-1.5 text-sm text-[#16a34a]">
              <Check className="h-4 w-4" />
              Settings saved
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
