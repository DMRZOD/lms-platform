"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionCard } from "@/components/aqad/section-card";
import { StatCard } from "@/components/aqad/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAQADStats,
  mockAvgReviewTime,
  mockComplaintCategories,
  mockComplaintTrend,
  mockComplianceData,
  mockGradeDistribution,
  mockReviewDecisions,
} from "@/constants/aqad-mock-data";
import { Activity, BarChart3, CheckSquare, MessageSquareWarning } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" description="Quality metrics and trends — Spring 2026" />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Compliance Rate" value={`${mockAQADStats.complianceRate}%`} icon={CheckSquare} subtitle="Spring 2026" accent="success" />
        <StatCard label="First-Pass Rate" value={`${mockAQADStats.firstPassRate}%`} icon={Activity} subtitle="Approved on first review" />
        <StatCard label="Avg Review Time" value={`${mockAQADStats.avgReviewDays}d`} icon={BarChart3} subtitle="Days to decision" />
        <StatCard label="Open Complaints" value={mockAQADStats.pendingComplaints} icon={MessageSquareWarning} subtitle="Pending resolution" accent={mockAQADStats.pendingComplaints > 5 ? "warning" : "default"} />
      </div>

      {/* Row 1 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Compliance Rate Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockComplianceData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Review Decisions">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={mockReviewDecisions} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {mockReviewDecisions.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v} courses`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="shrink-0 space-y-2">
              {mockReviewDecisions.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs">{d.name}</span>
                  <span className="text-xs font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Row 2 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Average Review Time (days)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockAvgReviewTime} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v} days`} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Complaint Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockComplaintTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Row 3 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Complaint Categories">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={mockComplaintCategories} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={2}>
                  {mockComplaintCategories.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="shrink-0 space-y-2">
              {mockComplaintCategories.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs">{d.name}</span>
                  <span className="text-xs font-semibold">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Grade Distribution (All Courses)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockGradeDistribution} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* SLA Compliance */}
      <SectionCard title="SLA Compliance">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { label: "Review SLA", rate: 91, target: 95, color: "#22c55e" },
            { label: "Complaint SLA", rate: 74, target: 90, color: "#f59e0b" },
            { label: "Corrective Action SLA", rate: 68, target: 85, color: "#ef4444" },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">{item.label}</p>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.rate}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full transition-all" style={{ width: `${item.rate}%`, backgroundColor: item.color }} />
              </div>
              <p className="mt-1 text-xs text-secondary-foreground">Target: {item.target}%</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
