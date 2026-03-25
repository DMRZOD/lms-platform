"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  BarChart3,
  Briefcase,
  Download,
  FileBarChart,
  FileText,
  KeyRound,
  X,
} from "lucide-react";
import { SectionCard } from "@/components/resource/section-card";
import { PageHeader } from "@/components/platform/page-header";

const REPORT_TYPES = [
  {
    id: "workload",
    title: "Workload Report",
    description:
      "Teacher workload analysis — hours, courses, students, and comparison with norms. For Deputy Director and Academic Dept.",
    icon: BarChart3,
  },
  {
    id: "performance",
    title: "Performance Report",
    description:
      "KPI summary — attendance, feedback, Q&A SLA, AQAD approval rates. Per teacher or aggregated.",
    icon: FileBarChart,
  },
  {
    id: "utilization",
    title: "Resource Utilization",
    description:
      "Efficiency analysis — overloaded vs underloaded distribution, capacity utilization.",
    icon: BarChart3,
  },
  {
    id: "replacements",
    title: "Replacement History",
    description:
      "All replacement events — reasons, duration, impact on courses and students.",
    icon: ArrowLeftRight,
  },
  {
    id: "assignments",
    title: "Assignment Report",
    description:
      "All assignments by program, course, group, and type. Includes historical data.",
    icon: Briefcase,
  },
  {
    id: "access-audit",
    title: "Access Audit Report",
    description:
      "Full audit trail of access grants and revocations. For compliance and security review.",
    icon: KeyRound,
  },
];

const SEMESTERS = ["Spring 2026", "Fall 2025", "Spring 2025", "Fall 2024"];
const DEPARTMENTS = [
  "All Departments",
  "Computer Science",
  "Mathematics",
  "English",
  "Business",
  "Physics",
  "Psychology",
];
const TEACHERS = [
  "All Teachers",
  "Elena Volkova",
  "Rustam Nazarov",
  "Dilnoza Karimova",
  "Malika Yusupova",
  "Otabek Mirzayev",
];

const REPORT_HISTORY = [
  {
    id: "rpt-001",
    type: "Workload Report",
    filters: "Spring 2026 · All Departments",
    format: "PDF",
    generatedAt: "2026-03-20 09:15",
    generatedBy: "Resource Dept",
  },
  {
    id: "rpt-002",
    type: "Performance Report",
    filters: "Spring 2026 · Business",
    format: "Excel",
    generatedAt: "2026-03-15 14:30",
    generatedBy: "Resource Dept",
  },
  {
    id: "rpt-003",
    type: "Access Audit Report",
    filters: "All period",
    format: "PDF",
    generatedAt: "2026-03-10 11:00",
    generatedBy: "Admin",
  },
];

type ReportConfig = {
  semester: string;
  department: string;
  teacher: string;
  format: "PDF" | "Excel";
};

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [config, setConfig] = useState<ReportConfig>({
    semester: "Spring 2026",
    department: "All Departments",
    teacher: "All Teachers",
    format: "PDF",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const selectedReport = REPORT_TYPES.find((r) => r.id === selectedType);

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export reports for workload, performance, assignments, and access audits."
      />

      {/* Report Type Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon;
          const isSelected = selectedType === report.id;
          return (
            <button
              key={report.id}
              onClick={() => {
                setSelectedType(isSelected ? null : report.id);
                setShowPreview(false);
              }}
              className={`rounded-lg border p-5 text-left transition-colors ${
                isSelected
                  ? "border-foreground bg-secondary"
                  : "border-border bg-background hover:bg-secondary"
              }`}
            >
              <div className="mb-2 flex items-center gap-3">
                <div
                  className={`rounded-md p-2 ${isSelected ? "bg-foreground" : "bg-secondary"}`}
                >
                  <Icon
                    className={`h-5 w-5 ${isSelected ? "text-background" : "text-secondary-foreground"}`}
                  />
                </div>
                <p className="font-semibold">{report.title}</p>
              </div>
              <p className="text-sm text-secondary-foreground">{report.description}</p>
            </button>
          );
        })}
      </div>

      {/* Config Panel */}
      {selectedType && selectedReport && (
        <SectionCard
          title={`Configure — ${selectedReport.title}`}
          className="mb-6"
          action={
            <button
              onClick={() => setSelectedType(null)}
              className="text-secondary-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          }
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium">Semester</label>
              <select
                value={config.semester}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, semester: e.target.value }))
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Department</label>
              <select
                value={config.department}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, department: e.target.value }))
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Teacher</label>
              <select
                value={config.teacher}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, teacher: e.target.value }))
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              >
                {TEACHERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Format</label>
              <div className="flex gap-2">
                {(["PDF", "Excel"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, format: fmt }))}
                    className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
                      config.format === fmt
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              <FileText className="h-4 w-4" />
              Generate Preview
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              <Download className="h-4 w-4" />
              Download {config.format}
            </button>
            <button
              onClick={() => setShowSchedule(true)}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              Schedule Report
            </button>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="mt-6 rounded-md border border-border bg-secondary p-6">
              <p className="mb-3 text-xs font-medium uppercase text-secondary-foreground">
                Preview — {selectedReport.title} · {config.semester} ·{" "}
                {config.department}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium">Teacher</th>
                      <th className="py-2 text-right font-medium">Metric 1</th>
                      <th className="py-2 text-right font-medium">Metric 2</th>
                      <th className="py-2 text-right font-medium">Metric 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Elena Volkova", m1: 92, m2: "4.6", m3: "88%" },
                      { name: "Rustam Nazarov", m1: 78, m2: "3.8", m3: "72%" },
                      { name: "Malika Yusupova", m1: 95, m2: "4.8", m3: "93%" },
                    ].map(({ name, m1, m2, m3 }) => (
                      <tr key={name} className="border-b last:border-b-0">
                        <td className="py-2">{name}</td>
                        <td className="py-2 text-right text-secondary-foreground">{m1}</td>
                        <td className="py-2 text-right text-secondary-foreground">{m2}</td>
                        <td className="py-2 text-right text-secondary-foreground">{m3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-secondary-foreground">
                Preview shows sample data. Full report will contain all records for the
                selected filters.
              </p>
            </div>
          )}
        </SectionCard>
      )}

      {/* Report History */}
      <SectionCard title="Generated Reports">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="px-4 py-2.5 text-left font-medium">Report Type</th>
                <th className="px-4 py-2.5 text-left font-medium">Filters</th>
                <th className="px-4 py-2.5 text-left font-medium">Format</th>
                <th className="px-4 py-2.5 text-left font-medium">Generated</th>
                <th className="px-4 py-2.5 text-left font-medium">By</th>
                <th className="px-4 py-2.5 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {REPORT_HISTORY.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{r.type}</td>
                  <td className="px-4 py-3 text-secondary-foreground">{r.filters}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                      {r.format}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary-foreground">{r.generatedAt}</td>
                  <td className="px-4 py-3 text-secondary-foreground">{r.generatedBy}</td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-xs text-secondary-foreground underline hover:text-foreground">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Schedule Report</h3>
              <button onClick={() => setShowSchedule(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium">Frequency</label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>End of semester</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Recipients (email)
                </label>
                <input
                  type="text"
                  placeholder="e.g. director@uou.edu, dean@uou.edu"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowSchedule(false)}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSchedule(false)}
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
