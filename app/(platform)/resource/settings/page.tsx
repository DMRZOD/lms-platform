"use client";

import { useState } from "react";
import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/resource/section-card";
import { PageHeader } from "@/components/platform/page-header";

type ReasonCode = { id: string; label: string; description: string };

const INITIAL_REASONS: ReasonCode[] = [
  { id: "rc-01", label: "Resignation", description: "Teacher voluntarily leaving" },
  { id: "rc-02", label: "Medical Leave", description: "Health-related absence" },
  { id: "rc-03", label: "Vacation", description: "Scheduled time off" },
  { id: "rc-04", label: "Overload", description: "Workload redistribution needed" },
  { id: "rc-05", label: "Low Quality", description: "KPI below acceptable threshold" },
  { id: "rc-06", label: "Disciplinary", description: "Policy violation or misconduct" },
];

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        saved
          ? "bg-[#dcfce7] text-[#166534]"
          : "bg-foreground text-background hover:opacity-90"
      }`}
    >
      {saved ? (
        <>
          <CheckCircle className="h-4 w-4" />
          Saved
        </>
      ) : (
        "Save Changes"
      )}
    </button>
  );
}

export default function SettingsPage() {
  // Workload thresholds
  const [maxHours, setMaxHours] = useState(20);
  const [maxCourses, setMaxCourses] = useState(5);
  const [maxStudents, setMaxStudents] = useState(150);
  const [workloadSaved, setWorkloadSaved] = useState(false);

  // KPI thresholds
  const [minAttendance, setMinAttendance] = useState(75);
  const [minFeedback, setMinFeedback] = useState(3.5);
  const [maxResponseTime, setMaxResponseTime] = useState(24);
  const [kpiSaved, setKpiSaved] = useState(false);

  // Reason codes
  const [reasons, setReasons] = useState<ReasonCode[]>(INITIAL_REASONS);
  const [newReasonLabel, setNewReasonLabel] = useState("");
  const [newReasonDesc, setNewReasonDesc] = useState("");

  // Notifications
  const [notifications, setNotifications] = useState({
    overloadAlert: true,
    performanceAlert: true,
    contractExpiry: true,
    pendingVerification: true,
    replacementInitiated: true,
    assignmentCreated: false,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // CSV import settings
  const [csvMapping, setCsvMapping] = useState({
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    department: "Department",
    specialization: "Specialization",
  });

  function saveWorkload() {
    setWorkloadSaved(true);
    setTimeout(() => setWorkloadSaved(false), 2000);
  }

  function saveKpi() {
    setKpiSaved(true);
    setTimeout(() => setKpiSaved(false), 2000);
  }

  function saveNotif() {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  }

  function addReason() {
    if (!newReasonLabel) return;
    setReasons((prev) => [
      ...prev,
      {
        id: `rc-${Date.now()}`,
        label: newReasonLabel,
        description: newReasonDesc,
      },
    ]);
    setNewReasonLabel("");
    setNewReasonDesc("");
  }

  function removeReason(id: string) {
    setReasons((prev) => prev.filter((r) => r.id !== id));
  }

  const notificationLabels: Record<keyof typeof notifications, string> = {
    overloadAlert: "Workload overload alert",
    performanceAlert: "KPI below threshold alert",
    contractExpiry: "Contract expiry reminder (30 days)",
    pendingVerification: "New teacher pending verification",
    replacementInitiated: "Replacement process initiated",
    assignmentCreated: "Assignment created",
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure thresholds, notification rules, and import settings for the Resource Department."
      />

      <div className="space-y-6">
        {/* Workload Thresholds */}
        <SectionCard
          title="Workload Thresholds"
          action={<SaveButton onClick={saveWorkload} saved={workloadSaved} />}
        >
          <p className="mb-4 text-sm text-secondary-foreground">
            Defines the limits used to classify teachers as Overloaded. A warning is
            shown when creating assignments that exceed these values.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Max Hours per Week
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={4}
                  max={40}
                  step={1}
                  value={maxHours}
                  onChange={(e) => setMaxHours(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-16 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm">
                  {maxHours}h
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Max Active Courses</label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxCourses}
                onChange={(e) => setMaxCourses(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Max Students</label>
              <input
                type="number"
                min={10}
                max={500}
                step={10}
                value={maxStudents}
                onChange={(e) => setMaxStudents(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </SectionCard>

        {/* KPI Thresholds */}
        <SectionCard
          title="KPI Thresholds"
          action={<SaveButton onClick={saveKpi} saved={kpiSaved} />}
        >
          <p className="mb-4 text-sm text-secondary-foreground">
            Values below these thresholds trigger performance alerts and are highlighted
            in the Performance page.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Min Attendance (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={5}
                  value={minAttendance}
                  onChange={(e) => setMinAttendance(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-16 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm">
                  {minAttendance}%
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
                Min Feedback Score (0–5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                step={0.1}
                value={minFeedback}
                onChange={(e) => setMinFeedback(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
                Max Q&A Response Time (hours)
              </label>
              <input
                type="number"
                min={1}
                max={72}
                value={maxResponseTime}
                onChange={(e) => setMaxResponseTime(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              />
              <p className="mt-1 text-xs text-secondary-foreground">
                SLA threshold for Q&A response time
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Reason Codes */}
        <SectionCard title="Replacement Reason Codes">
          <p className="mb-4 text-sm text-secondary-foreground">
            Predefined reasons used when initiating a teacher replacement.
          </p>
          <div className="mb-4 space-y-2">
            {reasons.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-md border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  {r.description && (
                    <p className="text-xs text-secondary-foreground">{r.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeReason(r.id)}
                  className="ml-3 text-secondary-foreground hover:text-[#dc2626]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newReasonLabel}
              onChange={(e) => setNewReasonLabel(e.target.value)}
              placeholder="Reason label"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
            <input
              type="text"
              value={newReasonDesc}
              onChange={(e) => setNewReasonDesc(e.target.value)}
              placeholder="Description (optional)"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={addReason}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </SectionCard>

        {/* Notification Settings */}
        <SectionCard
          title="Notification Settings"
          action={<SaveButton onClick={saveNotif} saved={notifSaved} />}
        >
          <p className="mb-4 text-sm text-secondary-foreground">
            Choose which events trigger notifications for the Resource Department team.
          </p>
          <div className="space-y-3">
            {(Object.keys(notifications) as (keyof typeof notifications)[]).map(
              (key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between rounded-md border border-border px-4 py-3"
                >
                  <span className="text-sm">{notificationLabels[key]}</span>
                  <div
                    onClick={() =>
                      setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                    className={`h-6 w-11 cursor-pointer rounded-full transition-colors ${
                      notifications[key] ? "bg-foreground" : "bg-secondary"
                    } relative`}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
                        notifications[key] ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>
              ),
            )}
          </div>
        </SectionCard>

        {/* Import Settings */}
        <SectionCard title="CSV Import Field Mapping">
          <p className="mb-4 text-sm text-secondary-foreground">
            Map CSV column headers to teacher profile fields. These settings are used
            when importing teachers from CSV/Excel files.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(Object.keys(csvMapping) as (keyof typeof csvMapping)[]).map((field) => (
              <div key={field}>
                <label className="mb-1 block text-xs font-medium capitalize">
                  {field} field
                </label>
                <input
                  type="text"
                  value={csvMapping[field]}
                  onChange={(e) =>
                    setCsvMapping((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
            ))}
          </div>
          <button className="mt-4 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
            Save Mapping
          </button>
        </SectionCard>
      </div>
    </div>
  );
}
