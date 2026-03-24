"use client";

import { useState } from "react";
import { AlertTriangle, Calendar, CheckCircle2, RefreshCw } from "lucide-react";
import { AlertBanner } from "@/components/academic/alert-banner";
import { CalendarGrid } from "@/components/academic/calendar-grid";
import { SectionCard } from "@/components/academic/section-card";
import { StatCard } from "@/components/academic/stat-card";
import { StatusBadge } from "@/components/academic/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockGroups,
  mockScheduleEntries,
  mockSyncLogs,
} from "@/constants/academic-mock-data";

const TABS = ["Calendar", "List", "Conflicts", "Archive"];

export default function SchedulesPage() {
  const [activeTab, setActiveTab] = useState("Calendar");
  const [groupFilter, setGroupFilter] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [overrideModal, setOverrideModal] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");

  const conflicts = mockScheduleEntries.filter((e) => e.syncStatus === "Conflict");
  const manualOverrides = mockScheduleEntries.filter((e) => e.syncStatus === "ManualOverride");

  const filtered =
    groupFilter === "all"
      ? mockScheduleEntries
      : mockScheduleEntries.filter((e) => e.groupId === groupFilter);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncDone(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncDone(true);
    }, 2000);
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <PageHeader title="Schedules" description="Manage timetable synced from aSc Timetable · Spring 2026" />
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60 hover:opacity-90"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing…" : "Sync with aSc"}
        </button>
      </div>

      {syncDone && (
        <AlertBanner
          type="info"
          title="Sync completed"
          message="Successfully synced 87 schedule entries. 3 conflicts detected."
          actionHref="#"
          actionLabel="View Conflicts"
          className="mb-4"
        />
      )}

      {conflicts.length > 0 && (
        <AlertBanner
          type="danger"
          title={`${conflicts.length} schedule conflicts require attention`}
          message="These entries could not be automatically resolved during the last aSc sync."
          actionHref="#"
          actionLabel="View Conflicts"
          className="mb-4"
        />
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Entries" value={mockScheduleEntries.length} icon={Calendar} />
        <StatCard label="Synced" value={mockScheduleEntries.filter((e) => e.syncStatus === "Synced").length} accent="success" />
        <StatCard label="Conflicts" value={conflicts.length} accent={conflicts.length > 0 ? "danger" : "default"} />
        <StatCard label="Manual Overrides" value={manualOverrides.length} accent={manualOverrides.length > 0 ? "warning" : "default"} />
      </div>

      {/* Sync History */}
      <SectionCard title="Sync History" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium text-secondary-foreground">Date</th>
                <th className="pb-2 pr-4 font-medium text-secondary-foreground">Status</th>
                <th className="pb-2 pr-4 font-medium text-secondary-foreground">Updated</th>
                <th className="pb-2 pr-4 font-medium text-secondary-foreground">Conflicts</th>
                <th className="pb-2 font-medium text-secondary-foreground">Resolved by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockSyncLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-2.5 pr-4">
                    {new Date(log.syncedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      log.status === "Success" ? "bg-[#dcfce7] text-[#16a34a]" :
                      log.status === "PartialSuccess" ? "bg-[#fef3c7] text-[#d97706]" :
                      "bg-[#fee2e2] text-[#dc2626]"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">{log.entriesUpdated}</td>
                  <td className="py-2.5 pr-4">
                    {log.conflicts > 0 ? (
                      <span className="text-[#dc2626] font-medium">{log.conflicts}</span>
                    ) : (
                      <span className="text-[#16a34a]">0</span>
                    )}
                  </td>
                  <td className="py-2.5 text-secondary-foreground">{log.resolvedBy ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Tabs */}
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
            {tab === "Conflicts" && conflicts.length > 0 && (
              <span className="ml-1.5 rounded-full bg-[#ef4444] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {conflicts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Calendar */}
      {activeTab === "Calendar" && (
        <SectionCard title="Weekly View — Spring 2026">
          <div className="mb-4 flex items-center gap-3">
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
            >
              <option value="all">All Groups</option>
              {mockGroups.filter((g) => g.status === "Active").map((g) => (
                <option key={g.id} value={g.id}>{g.code}</option>
              ))}
            </select>
            <div className="flex items-center gap-3 text-xs text-secondary-foreground">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[#93c5fd]" />Synced</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[#fca5a5]" />Conflict</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[#c4b5fd]" />Override</span>
            </div>
          </div>
          <CalendarGrid entries={filtered} />
        </SectionCard>
      )}

      {/* List */}
      {activeTab === "List" && (
        <SectionCard title="All Schedule Entries">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Course</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Group</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Teacher</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Room</th>
                  <th className="pb-3 pr-4 font-medium text-secondary-foreground">Time</th>
                  <th className="pb-3 font-medium text-secondary-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockScheduleEntries.map((entry) => {
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
                  return (
                    <tr key={entry.id}>
                      <td className="py-2.5 pr-4 font-medium">{entry.courseName}</td>
                      <td className="py-2.5 pr-4 text-secondary-foreground">{entry.groupName}</td>
                      <td className="py-2.5 pr-4 text-secondary-foreground">{entry.teacherName}</td>
                      <td className="py-2.5 pr-4">{entry.room}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">
                        {days[entry.dayOfWeek - 1]} {entry.startTime}–{entry.endTime}
                      </td>
                      <td className="py-2.5"><StatusBadge status={entry.syncStatus} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Conflicts */}
      {activeTab === "Conflicts" && (
        <SectionCard title={`Conflicts (${conflicts.length})`}>
          {conflicts.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-[#16a34a]">
              <CheckCircle2 className="h-4 w-4" />
              No conflicts detected in current schedule.
            </div>
          ) : (
            <div className="space-y-3">
              {conflicts.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 rounded-lg border border-[#fca5a5] bg-[#fee2e2] p-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#dc2626]" />
                  <div className="flex-1">
                    <p className="font-medium text-[#7f1d1d]">{entry.courseName}</p>
                    <p className="text-sm text-[#991b1b]">
                      {entry.groupName} · {entry.teacherName} · {entry.room}
                    </p>
                    <p className="mt-1 text-xs text-[#991b1b]">
                      This entry conflicts with another entry in the current schedule.
                    </p>
                  </div>
                  <button
                    onClick={() => setOverrideModal(entry.id)}
                    className="shrink-0 rounded-md border border-[#dc2626] px-3 py-1.5 text-sm font-medium text-[#dc2626] hover:bg-[#dc2626] hover:text-white"
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* Archive */}
      {activeTab === "Archive" && (
        <SectionCard title="Archive — Past Semesters">
          <div className="space-y-2">
            {["Fall 2025", "Spring 2025", "Fall 2024"].map((sem) => (
              <div key={sem} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary-foreground" />
                  <span className="text-sm font-medium">{sem}</span>
                </div>
                <button className="text-sm text-secondary-foreground hover:text-foreground">View →</button>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Override modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h2 className="mb-1 font-semibold">Resolve Conflict</h2>
            <p className="mb-4 text-sm text-secondary-foreground">
              Creating a manual override for this schedule entry. A reason is required and will be logged.
            </p>
            <label className="mb-1.5 block text-sm font-medium">
              Reason for override <span className="text-[#dc2626]">*</span>
            </label>
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              rows={3}
              placeholder="Describe the reason for this manual schedule override..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
            <div className="mt-5 flex gap-2">
              <button onClick={() => { setOverrideModal(null); setOverrideReason(""); }} className="flex-1 rounded-md border border-border py-2 text-sm hover:bg-secondary">Cancel</button>
              <button
                disabled={!overrideReason.trim()}
                onClick={() => { setOverrideModal(null); setOverrideReason(""); }}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-40 hover:opacity-90"
              >
                Save Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
