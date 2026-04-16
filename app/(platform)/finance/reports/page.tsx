"use client";

import { Download } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Badge, SectionCard, FTable, Tr, Td } from "@/components/finance/finance-ui";
import { MONTHLY_REVENUE } from "@/constants/finance-mock-data";

const REPORTS = [
    { name: "Revenue Summary",     period: "Spring 2026", gen: "Apr 15", fmt: "PDF" },
    { name: "Debt Register",       period: "Spring 2026", gen: "Apr 15", fmt: "CSV" },
    { name: "Payment Compliance",  period: "Spring 2026", gen: "Apr 14", fmt: "PDF" },
    { name: "Blocked Students",    period: "Current",     gen: "Apr 15", fmt: "CSV" },
    { name: "1C Reconciliation",   period: "Apr 2026",    gen: "Apr 15", fmt: "PDF" },
    { name: "Dropout Risk (Debt)", period: "Spring 2026", gen: "Apr 14", fmt: "PDF" },
    { name: "Installment Schedule",period: "Spring 2026", gen: "Apr 10", fmt: "CSV" },
];

const SCHEDULED = [
    { name: "Revenue report (weekly)",  status: "active" },
    { name: "Debt register (daily)",    status: "active" },
    { name: "Reconciliation (monthly)", status: "paused" },
];

export default function ReportsPage() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* Reports list */}
            <SectionCard title="Available reports">
                <FTable headers={["Report", "Period", "Last Generated", "Format", "Action"]}>
                    {REPORTS.map((r) => (
                        <Tr key={r.name}>
                            <Td>{r.name}</Td>
                            <Td>{r.period}</Td>
                            <Td>{r.gen}</Td>
                            <Td>
                                <Badge cls="bg-secondary text-secondary-foreground">{r.fmt}</Badge>
                            </Td>
                            <Td>
                                <button className="flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs hover:bg-secondary">
                                    <Download className="h-3 w-3"/> Export
                                </button>
                            </Td>
                        </Tr>
                    ))}
                </FTable>
            </SectionCard>

            <div className="space-y-4">
                {/* Monthly summary chart */}
                <div className="rounded-lg border border-border bg-background p-4">
                    <p className="mb-2 text-sm font-medium text-foreground">Monthly summary</p>
                    <div className="mb-3 flex gap-3 text-xs text-secondary-foreground">
                        <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#10b981]"/>Collected</span>
                        <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#e2e8f0]"/>Expected</span>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={MONTHLY_REVENUE} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}k`}/>
                            <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f8fafc", fontSize: 12 }} formatter={(v) => [`${v}%`, "Risk score"]}/>
                            <Bar dataKey="expected"  fill="#e2e8f0" radius={[3, 3, 0, 0]}/>
                            <Bar dataKey="collected" fill="#10b981" radius={[3, 3, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Scheduled exports */}
                <SectionCard title="Scheduled exports" action={
                    <button className="rounded-md border border-border px-3 py-1.5 text-xs text-secondary-foreground hover:bg-secondary">
                        + Schedule
                    </button>
                }>
                    {SCHEDULED.map((s) => (
                        <div key={s.name} className="flex items-center justify-between border-b border-border py-2.5 last:border-b-0">
                            <span className="text-sm text-secondary-foreground">{s.name}</span>
                            <Badge cls={s.status === "active" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fef3c7] text-[#92400e]"}>
                                {s.status}
                            </Badge>
                        </div>
                    ))}
                </SectionCard>
            </div>
        </div>
    );
}
