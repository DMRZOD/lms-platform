"use client";

import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Download,
  FileBarChart,
  FileText,
  MessageSquareWarning,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { SectionCard } from "@/components/aqad/section-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockReportHistory } from "@/constants/aqad-mock-data";
import type { ReportType } from "@/types/aqad";

type ReportOption = {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ElementType;
};

const REPORT_OPTIONS: ReportOption[] = [
  { type: "QualityOverview", title: "Quality Overview", description: "Compliance rate, review stats, approvals and rejections, avg review time.", icon: ShieldCheck },
  { type: "CourseQuality", title: "Course Quality Report", description: "Detailed report for a specific course: all reviews, audits, complaints, corrective actions.", icon: BookOpen },
  { type: "TeacherQuality", title: "Teacher Quality Report", description: "All courses by teacher, first-pass rate, corrective actions count, complaints.", icon: Users },
  { type: "ComplaintAnalysis", title: "Complaint Analysis", description: "Complaint trends, categories, SLA compliance, repeat complaints.", icon: MessageSquareWarning },
  { type: "CorrectiveActions", title: "Corrective Actions Report", description: "Completion rates, overdue stats, repeat issues by teacher/course.", icon: FileText },
  { type: "AuditResults", title: "Audit Results Report", description: "Audit outcomes, pass rates, quality trend across semesters.", icon: FileBarChart },
  { type: "TopProblematic", title: "Top Problematic Courses", description: "Ranking of courses and teachers with most quality issues.", icon: TrendingUp },
  { type: "AccreditationCompliance", title: "Accreditation Compliance", description: "Standards compliance matrix for external accreditation requirements.", icon: BarChart3 },
];

const FORMAT_OPTIONS = ["PDF", "Excel"] as const;
const PERIOD_OPTIONS = ["Current Semester", "Last Semester", "Last Quarter", "Custom Range"] as const;

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ReportsPage() {
  const [selected, setSelected] = useState<ReportType | null>(null);
  const [format, setFormat] = useState<"PDF" | "Excel">("PDF");
  const [period, setPeriod] = useState<string>("Current Semester");
  const [showPreview, setShowPreview] = useState(false);

  const selectedOption = REPORT_OPTIONS.find((r) => r.type === selected);

  return (
    <div>
      <PageHeader title="Quality Reports" description="Generate and export reports for management and accreditation" />

      {/* Report Type Picker */}
      <SectionCard title="Select Report Type" className="mb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REPORT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.type}
                onClick={() => { setSelected(opt.type); setShowPreview(false); }}
                className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors hover:bg-secondary ${selected === opt.type ? "border-foreground bg-secondary" : ""}`}
              >
                <Icon className="h-5 w-5 text-secondary-foreground" />
                <p className="text-sm font-medium">{opt.title}</p>
                <p className="text-xs text-secondary-foreground leading-relaxed">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Config Form */}
      {selected && (
        <SectionCard title={`Configure — ${selectedOption?.title}`} className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                {PERIOD_OPTIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Format</label>
              <div className="flex gap-2">
                {FORMAT_OPTIONS.map((f) => (
                  <button key={f} onClick={() => setFormat(f)} className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${format === f ? "border-foreground bg-foreground text-background" : "hover:bg-secondary"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {(selected === "CourseQuality" || selected === "TeacherQuality") && (
              <div>
                <label className="mb-1 block text-xs font-medium">
                  {selected === "CourseQuality" ? "Course" : "Teacher"}
                </label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="">All</option>
                </select>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => setShowPreview(true)} className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">
              Preview Report
            </button>
            <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-secondary">
              <Download className="h-4 w-4" /> Download {format}
            </button>
          </div>
        </SectionCard>
      )}

      {/* Mock Preview */}
      {showPreview && selectedOption && (
        <SectionCard title={`Preview — ${selectedOption.title}`} className="mb-6">
          <div className="overflow-hidden rounded-lg border">
            <div className="bg-secondary px-4 py-3">
              <p className="text-sm font-medium">{selectedOption.title}</p>
              <p className="text-xs text-secondary-foreground">Period: {period} · Format: {format} · Generated: {new Date().toLocaleDateString("en-US")}</p>
            </div>
            <div className="p-4">
              <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Total Courses Reviewed", value: "47" },
                  { label: "Approval Rate", value: "68%" },
                  { label: "Avg Review Days", value: "4.2" },
                  { label: "Compliance Rate", value: "87%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-secondary-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border">
                <div className="grid grid-cols-4 border-b bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground">
                  <span>Metric</span><span>Current</span><span>Previous</span><span>Change</span>
                </div>
                {[
                  { metric: "First-Pass Rate", cur: "68%", prev: "63%", change: "+5%" },
                  { metric: "Avg Review Time", cur: "4.2d", prev: "5.1d", change: "-0.9d" },
                  { metric: "Open Complaints", cur: "8", prev: "12", change: "-4" },
                  { metric: "Overdue Actions", cur: "3", prev: "7", change: "-4" },
                ].map((row) => (
                  <div key={row.metric} className="grid grid-cols-4 border-b px-4 py-2.5 text-sm last:border-b-0">
                    <span>{row.metric}</span>
                    <span>{row.cur}</span>
                    <span className="text-secondary-foreground">{row.prev}</span>
                    <span className="text-[#16a34a]">{row.change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Report History */}
      <SectionCard title="Report History">
        {mockReportHistory.length === 0 ? (
          <p className="text-sm text-secondary-foreground">No reports generated yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Report</th>
                  <th className="px-4 py-2.5 text-left font-medium">Period</th>
                  <th className="px-4 py-2.5 text-left font-medium">Generated</th>
                  <th className="px-4 py-2.5 text-left font-medium">By</th>
                  <th className="px-4 py-2.5 text-center font-medium">Format</th>
                  <th className="px-4 py-2.5 text-center font-medium" />
                </tr>
              </thead>
              <tbody>
                {mockReportHistory.map((rep) => (
                  <tr key={rep.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">{rep.title}</td>
                    <td className="px-4 py-3 text-secondary-foreground">{rep.period}</td>
                    <td className="px-4 py-3 text-xs text-secondary-foreground">{formatDate(rep.generatedAt)}</td>
                    <td className="px-4 py-3 text-xs">{rep.generatedByName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{rep.format}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs hover:bg-secondary">
                        <Download className="h-3 w-3" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
