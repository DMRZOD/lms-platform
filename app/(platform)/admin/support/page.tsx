"use client";

import {
  CheckCircle2,
  Clock,
  MessageSquare,
  ThumbsUp,
  Timer,
} from "lucide-react";
import { useState } from "react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockSupportStats,
  mockSupportTickets,
} from "@/constants/admin-mock-data";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
  UserRole,
} from "@/types/admin";

const statusColors: Record<TicketStatus, { bg: string; text: string }> = {
  Open: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  InProgress: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
  WaitingOnUser: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
  Resolved: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Closed: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
};

const priorityColors: Record<TicketPriority, { bg: string; text: string }> = {
  Critical: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  High: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  Medium: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Low: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
};

const categoryColors: Record<TicketCategory, { bg: string; text: string }> = {
  Account: { bg: "bg-[#f5f3ff]", text: "text-[#6d28d9]" },
  Technical: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
  Billing: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  Access: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
  Bug: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Other: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
};

const roleLabelMap: Record<UserRole, string> = {
  admin: "Admin",
  "it-ops": "IT Ops",
  deputy: "Deputy",
  academic: "Academic",
  accountant: "Finance",
  aqad: "AQAD",
  resource: "Resource",
  teacher: "Teacher",
  student: "Student",
  applicant: "Applicant",
};

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Open", value: "Open" },
  { label: "In Progress", value: "InProgress" },
  { label: "Waiting", value: "WaitingOnUser" },
  { label: "Resolved", value: "Resolved" },
  { label: "Closed", value: "Closed" },
];

const priorityOptions = [
  { label: "All Priorities", value: "all" },
  { label: "Critical", value: "Critical" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AdminSupportPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const s = mockSupportStats;

  const filtered = mockSupportTickets.filter((t) => {
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority =
      priorityFilter === "all" || t.priority === priorityFilter;
    const matchSearch =
      search === "" ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.submittedBy.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const byCategory = (
    [
      "Account",
      "Technical",
      "Billing",
      "Access",
      "Bug",
      "Other",
    ] as TicketCategory[]
  ).map((cat) => ({
    label: cat,
    count: mockSupportTickets.filter((t) => t.category === cat).length,
  }));

  const byPriority = (
    ["Critical", "High", "Medium", "Low"] as TicketPriority[]
  ).map((p) => ({
    label: p,
    count: mockSupportTickets.filter((t) => t.priority === p).length,
  }));

  const maxCatCount = Math.max(...byCategory.map((c) => c.count), 1);
  const maxPriCount = Math.max(...byPriority.map((p) => p.count), 1);

  const recentActivity = [...mockSupportTickets]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="User Support"
        description="Support tickets, user assistance, and issue resolution"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Open Tickets"
          value={s.openTickets}
          icon={MessageSquare}
          accent={s.openTickets > 5 ? "warning" : "default"}
        />
        <StatCard
          label="In Progress"
          value={s.inProgressTickets}
          icon={Clock}
          accent="info"
        />
        <StatCard
          label="Avg Response"
          value={s.avgResponseTime}
          icon={Timer}
        />
        <StatCard
          label="Avg Resolution"
          value={s.avgResolutionTime}
          icon={CheckCircle2}
        />
        <StatCard
          label="Satisfaction"
          value={`${s.satisfactionRate}%`}
          icon={ThumbsUp}
          accent={s.satisfactionRate >= 90 ? "success" : "warning"}
        />
        <StatCard
          label="Resolved This Week"
          value={s.resolvedThisWeek}
          icon={CheckCircle2}
          accent="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tickets list — 2/3 */}
        <div className="lg:col-span-2">
          <SectionCard>
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {statusFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      statusFilter === f.value
                        ? "bg-foreground text-background"
                        : "border border-border bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {priorityOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tickets..."
                  className="w-full rounded-md border border-border bg-background py-1.5 px-3 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 sm:w-56"
                />
              </div>
            </div>
            <p className="mb-3 text-sm text-secondary-foreground">
              {filtered.length} ticket{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-3">
              {filtered.map((ticket) => {
                const sc =
                  statusColors[ticket.status] ?? statusColors.Open;
                const pc =
                  priorityColors[ticket.priority] ?? priorityColors.Low;
                const cc =
                  categoryColors[ticket.category] ?? categoryColors.Other;
                return (
                  <div
                    key={ticket.id}
                    className="rounded-md border border-border p-3 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-secondary-foreground">
                          {ticket.ticketNumber}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${pc.bg} ${pc.text}`}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${cc.bg} ${cc.text}`}
                        >
                          {ticket.category}
                        </span>
                      </div>
                      {ticket.responseCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-secondary-foreground">
                          <MessageSquare className="h-3 w-3" />
                          {ticket.responseCount}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm font-medium">
                      {ticket.subject}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-secondary-foreground">
                      <span>
                        {ticket.submittedBy} ·{" "}
                        {roleLabelMap[ticket.submittedByRole]}
                      </span>
                      <span>{formatDateTime(ticket.createdAt)}</span>
                      {ticket.assignedTo && (
                        <span>Assigned to: {ticket.assignedTo}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-secondary-foreground">
                  No tickets match the selected filters.
                </p>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Right sidebar — 1/3 */}
        <div className="space-y-6">
          <SectionCard title="By Category">
            <div className="space-y-2.5">
              {byCategory.map((c) => {
                const colors =
                  categoryColors[c.label as TicketCategory] ??
                  categoryColors.Other;
                return (
                  <div key={c.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {c.label}
                      </span>
                      <span className="font-medium">{c.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-foreground"
                        style={{
                          width: `${(c.count / maxCatCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="By Priority">
            <div className="space-y-2.5">
              {byPriority.map((p) => {
                const colors =
                  priorityColors[p.label as TicketPriority] ??
                  priorityColors.Low;
                return (
                  <div key={p.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {p.label}
                      </span>
                      <span className="font-medium">{p.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-foreground"
                        style={{
                          width: `${(p.count / maxPriCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Recent Activity">
            <div className="space-y-3">
              {recentActivity.map((t) => {
                const sc = statusColors[t.status] ?? statusColors.Open;
                return (
                  <div key={t.id} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-secondary-foreground">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-sm">{t.subject}</p>
                    <p className="text-xs text-secondary-foreground">
                      {formatDateTime(t.updatedAt)}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
