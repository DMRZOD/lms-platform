"use client";

import { AlertTriangle } from "lucide-react";
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { KPI, Badge, Tag, SectionCard, FTable, Tr, Td, AlertBox } from "@/components/finance/finance-ui";
import { OVERDUE_STUDENTS, DEBT_AGING, DROPOUT_RISK, usd } from "@/constants/finance-mock-data";

export default function DebtsPage() {
    // @ts-ignore
    return (
        <div>
            <AlertBox type="danger">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5"/>
                <span>
          <strong>43 overdue payments</strong> totalling $127,000.
          Automated reminders sent to 38 students. 5 students blocked.
        </span>
            </AlertBox>

            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <KPI label="Total Overdue" value="$127K" sub="43 students"          accent="danger" />
                <KPI label="7–14 days"     value="21"    sub="First warning sent"   accent="warning"/>
                <KPI label=">14 days"      value="17"    sub="Second warning sent"  accent="danger" />
                <KPI label=">30 days"      value="5"     sub="Access blocked"       accent="danger" />
            </div>

            {/* Charts */}
            <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-4">
                    <p className="mb-3 text-sm font-medium text-foreground">Debt aging breakdown</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={DEBT_AGING} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                            <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f8fafc", fontSize: 12 }}/>
                            <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-lg border border-border bg-background p-4">
                    <p className="mb-3 text-sm font-medium text-foreground">Dropout risk from debt (by program)</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={DROPOUT_RISK} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`}/>
                            <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f8fafc", fontSize: 12 }} formatter={(v) => [`${v}%`, "Risk score"]}/>
                            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                {DROPOUT_RISK.map((e, i) => (
                                    <Cell key={i} fill={e.score > 70 ? "#ef4444" : e.score > 50 ? "#f59e0b" : "#10b981"}/>
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Overdue table */}
            <SectionCard title="Overdue students" action={
                <button className="rounded-md border border-border px-3 py-1.5 text-xs text-secondary-foreground hover:bg-secondary">
                    Send reminders
                </button>
            }>
                <FTable headers={["Student", "Program", "Due Date", "Debt", "Days Late", "Warnings", "Status", "Action"]}>
                    {OVERDUE_STUDENTS.map((s) => (
                        <Tr key={s.name}>
                            <Td>{s.name}</Td>
                            <Td><Tag>{s.program}</Tag></Td>
                            <Td>{s.dueDate}</Td>
                            <Td>
                <span className={`font-semibold ${s.status === "blocked" ? "text-[#ef4444]" : "text-[#f59e0b]"}`}>
                  {usd(s.debt)}
                </span>
                            </Td>
                            <Td>{s.daysLate}</Td>
                            <Td>{s.warnings}</Td>
                            <Td>
                                <Badge cls={s.status === "blocked" ? "bg-[#fee2e2] text-[#991b1b]" : "bg-[#fef3c7] text-[#92400e]"}>
                                    {s.status}
                                </Badge>
                            </Td>
                            <Td>
                                <button className="rounded border border-border px-2 py-0.5 text-xs hover:bg-secondary">
                                    {s.status === "blocked" ? "Resolve" : "Remind"}
                                </button>
                            </Td>
                        </Tr>
                    ))}
                </FTable>
            </SectionCard>
        </div>
    );
}
