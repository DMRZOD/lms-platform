"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockDeputySettings } from "@/constants/deputy-mock-data";
import type { ReportFormat } from "@/types/deputy";

function SaveButton({
  section,
  savedSections,
  onSave,
}: {
  section: string;
  savedSections: Set<string>;
  onSave: (section: string) => void;
}) {
  return (
    <button
      onClick={() => onSave(section)}
      className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
    >
      {savedSections.has(section) ? (
        <>
          <Check className="h-4 w-4" />
          Saved
        </>
      ) : (
        "Save Changes"
      )}
    </button>
  );
}

export default function DeputySettingsPage() {
  const [settings, setSettings] = useState(mockDeputySettings);
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set());

  const markSaved = (section: string) => {
    setSavedSections((prev) => new Set(prev).add(section));
    setTimeout(() => {
      setSavedSections((prev) => {
        const next = new Set(prev);
        next.delete(section);
        return next;
      });
    }, 2500);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your Deputy Director dashboard preferences and notifications"
      />

      <div className="space-y-6">
        <SectionCard title="Dashboard Preferences">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Refresh Interval
                </label>
                <select
                  value={settings.dashboardRefreshInterval}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      dashboardRefreshInterval: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  <option value={5}>Every 5 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Every hour</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Default Department View
                </label>
                <select
                  value={settings.defaultDepartment}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      defaultDepartment: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {[
                    "All",
                    "Engineering",
                    "Economics",
                    "Health Sciences",
                    "Humanities",
                    "Design",
                    "Natural Sciences",
                  ].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Preferred Chart Style
                </label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20">
                  <option>Bar Charts</option>
                  <option>Line Charts</option>
                  <option>Area Charts</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <SaveButton section="dashboard" savedSections={savedSections} onSave={markSaved} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="KPI Alert Thresholds">
          <div className="space-y-4">
            <p className="text-sm text-secondary-foreground">
              Configure when KPIs are flagged as at-risk or critical.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  At-Risk Threshold (%)
                </label>
                <input
                  type="number"
                  min={50}
                  max={99}
                  value={settings.kpiAlertThreshold}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      kpiAlertThreshold: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
                <p className="mt-1 text-xs text-secondary-foreground">
                  KPIs below this % of target are flagged at-risk
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Critical Threshold (%)
                </label>
                <input
                  type="number"
                  min={30}
                  max={85}
                  defaultValue={65}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
                <p className="mt-1 text-xs text-secondary-foreground">
                  KPIs below this % of target are flagged critical
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Alert Frequency
                </label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20">
                  <option>Real-time</option>
                  <option>Daily digest</option>
                  <option>Weekly digest</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <SaveButton section="kpi" savedSections={savedSections} onSave={markSaved} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notification Settings">
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  key: "emailNotifications",
                  label: "Email Notifications",
                  description: "Receive alerts and updates via email",
                },
                {
                  key: "weeklyDigest",
                  label: "Weekly Digest",
                  description:
                    "Receive a summary of university performance every Monday",
                },
              ].map(({ key, label, description }) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-secondary-foreground">
                      {description}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        [key]: !s[key as keyof typeof s],
                      }))
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      settings[key as keyof typeof settings]
                        ? "bg-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
                        settings[key as keyof typeof settings]
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Notification Email
              </label>
              <input
                type="email"
                value={settings.notificationEmail}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    notificationEmail: e.target.value,
                  }))
                }
                className="w-full max-w-sm rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Notify me when:</p>
              {[
                "KPI threshold is breached",
                "New incident is reported",
                "Report generation is complete",
                "Department drops below retention target",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-border"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end">
              <SaveButton section="notifications" savedSections={savedSections} onSave={markSaved} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Report Defaults">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Default Format
                </label>
                <div className="flex flex-col gap-2">
                  {(["PDF", "Excel", "PowerPoint"] as ReportFormat[]).map((f) => (
                    <label key={f} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="reportFormat"
                        checked={settings.preferredReportFormat === f}
                        onChange={() =>
                          setSettings((s) => ({
                            ...s,
                            preferredReportFormat: f,
                          }))
                        }
                        className="h-4 w-4"
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Default Period
                </label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20">
                  <option>Current Quarter</option>
                  <option>Current Semester</option>
                  <option>Current Year</option>
                </select>

                <div className="mt-4 flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm font-medium">Auto-generate Weekly Report</p>
                    <p className="text-xs text-secondary-foreground">
                      Generates an Executive Summary every Monday at 07:00
                    </p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-foreground transition-colors">
                    <span className="absolute top-0.5 h-5 w-5 translate-x-5 rounded-full bg-background shadow transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <SaveButton section="reports" savedSections={savedSections} onSave={markSaved} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
