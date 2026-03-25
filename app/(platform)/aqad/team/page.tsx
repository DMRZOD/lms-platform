"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Users, X } from "lucide-react";
import { SectionCard } from "@/components/aqad/section-card";
import { StatCard } from "@/components/aqad/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockAQADMembers } from "@/constants/aqad-mock-data";

const MEMBER_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function TeamPage() {
  const [showReassign, setShowReassign] = useState(false);

  const workloadData = mockAQADMembers.map((m, i) => ({
    name: m.name.split(" ").slice(-1)[0],
    reviews: m.activeReviews,
    complaints: m.activeComplaints,
    actions: m.activeCorrectiveActions,
    color: MEMBER_COLORS[i % MEMBER_COLORS.length],
  }));

  const totalReviews = mockAQADMembers.reduce((s, m) => s + m.activeReviews, 0);
  const totalComplaints = mockAQADMembers.reduce((s, m) => s + m.activeComplaints, 0);
  const avgReviewTime = (mockAQADMembers.reduce((s, m) => s + m.avgReviewDays, 0) / mockAQADMembers.length).toFixed(1);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <PageHeader title="Team" description={`${mockAQADMembers.length} AQAD members`} />
        <button onClick={() => setShowReassign(true)} className="rounded-md border px-4 py-2 text-sm hover:bg-secondary">
          Reassign Items
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Active Reviews" value={totalReviews} icon={Users} subtitle="Across all members" />
        <StatCard label="Open Complaints" value={totalComplaints} icon={Users} subtitle="Under investigation" />
        <StatCard label="Avg Review Time" value={`${avgReviewTime}d`} icon={Users} subtitle="Team average" />
      </div>

      {/* Team Member Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockAQADMembers.map((member, i) => {
          const total = member.activeReviews + member.activeComplaints + member.activeCorrectiveActions;
          return (
            <div key={member.id} className="rounded-lg border p-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length] }}>
                  {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-secondary-foreground">{member.role}</p>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-1">
                {member.specializations.map((s) => (
                  <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{s}</span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-secondary py-2">
                  <p className="text-lg font-bold">{member.activeReviews}</p>
                  <p className="text-xs text-secondary-foreground">Reviews</p>
                </div>
                <div className="rounded-md bg-secondary py-2">
                  <p className="text-lg font-bold">{member.activeComplaints}</p>
                  <p className="text-xs text-secondary-foreground">Complaints</p>
                </div>
                <div className="rounded-md bg-secondary py-2">
                  <p className="text-lg font-bold">{member.activeCorrectiveActions}</p>
                  <p className="text-xs text-secondary-foreground">Actions</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-secondary-foreground">
                <span>Total workload: <strong className="text-foreground">{total}</strong></span>
                <span>Avg review: <strong className="text-foreground">{member.avgReviewDays}d</strong></span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full" style={{ width: `${Math.min((total / 12) * 100, 100)}%`, backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length] }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Workload Chart */}
      <SectionCard title="Workload Distribution">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={workloadData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="reviews" name="Reviews" stackId="a" fill="#3b82f6" />
            <Bar dataKey="complaints" name="Complaints" stackId="a" fill="#f59e0b" />
            <Bar dataKey="actions" name="Actions" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center justify-center gap-6">
          {[{ label: "Reviews", color: "#3b82f6" }, { label: "Complaints", color: "#f59e0b" }, { label: "Actions", color: "#8b5cf6" }].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Reassign Modal */}
      {showReassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Reassign Items</h3>
              <button onClick={() => setShowReassign(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium">From</label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="">Select member…</option>
                  {mockAQADMembers.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.activeReviews + m.activeComplaints + m.activeCorrectiveActions} items)</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">To</label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option value="">Select member…</option>
                  {mockAQADMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Item Type</label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none">
                  <option>Reviews</option><option>Complaints</option><option>All</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowReassign(false)} className="rounded-md border px-4 py-2 text-sm hover:bg-secondary">Cancel</button>
              <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">Reassign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
