"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
    AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { KPI, Badge, Tag, SectionCard, FTable, Tr, Td } from "@/components/finance/finance-ui";
import {
    MONTHLY_REVENUE, PAYMENT_STATUS, DEBT_BY_PROGRAM,
    TRANSACTIONS, TX_BADGE, DEBT_COLOR, DEBT_BADGE, usd,
} from "@/constants/finance-mock-data";

export default function FinanceDashboardPage() {
    return (
        <div>
            {/* KPIs */}
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-6">
                <KPI label="Total Collected"  value="$1.21M" sub="↑ 92% collection rate"  trend="up"   accent="success" />
                <KPI label="Outstanding Debt" value="$127K"  sub="↓ 8% of expected"        trend="down" accent="danger"  />
                <KPI label="Overdue Payments" value="43"     sub="Students this period"              accent="warning" />
                <KPI label="Blocked Students" value="5"      sub="Require action"                    accent="danger"  />
                <KPI label="Total Expected"   value="$1.38M" sub="Spring 2026"                       accent="info"    />
                <KPI label="Paid on Time"     value="312"    sub="Students"                          accent="success" />
            </div>

            {/* Charts row */}
            <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">

                {/* Revenue area chart */}
                <div className="lg:col-span-2 rounded-lg border border-border bg-background p-4">
                    <div className="mb-3 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-foreground">Revenue vs Expected</p>
                            <p className="text-xs text-secondary-foreground">Monthly · USD (thousands)</p>
                        </div>
                        <div className="flex gap-3 text-xs text-secondary-foreground">
                            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#10b981]"/>Collected</span>
                            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#e2e8f0]"/>Expected</span>
                            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#ef4444]"/>Debt</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={MONTHLY_REVENUE} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                            <defs>
                                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}k`}/>
                            <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f8fafc", fontSize: 12 }} formatter={(v) => [`${v}%`, "Risk score"]}/>
                            <Area type="monotone" dataKey="expected"  stroke="#cbd5e1" strokeWidth={2} fill="none" strokeDasharray="4 2"/>
                            <Area type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} fill="url(#gc)"/>
                            <Area type="monotone" dataKey="debt"      stroke="#ef4444" strokeWidth={1.5} fill="none" strokeDasharray="3 2"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment status pie */}
                <div className="rounded-lg border border-border bg-background p-4">
                    <p className="mb-1 text-sm font-medium text-foreground">Payment Status</p>
                    <p className="mb-3 text-xs text-secondary-foreground">All students · Spring 2026</p>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={PAYMENT_STATUS} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value">
                                {PAYMENT_STATUS.map((e, i) => <Cell key={i} fill={e.color}/>)}
                            </Pie>
                            <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f8fafc", fontSize: 12 }}/>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 space-y-1.5">
                        {PAYMENT_STATUS.map((d) => (
                            <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-secondary-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }}/>
                    {d.name}
                </span>
                                <span className="font-medium text-foreground">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Debt by program */}
            <SectionCard title="Debt by Program" sub="Outstanding balances · Spring 2026">
                <div className="space-y-3">
                    {DEBT_BY_PROGRAM.map((p) => (
                        <div key={p.name} className="flex items-center gap-3">
                            <div className="w-36 shrink-0">
                                <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                                <p className="text-xs text-secondary-foreground">{p.students} students</p>
                            </div>
                            <div className="flex-1">
                                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                    <div className={`h-full rounded-full ${DEBT_COLOR[p.risk]}`} style={{ width: `${p.pct}%` }}/>
                                </div>
                            </div>
                            <span className="w-16 text-right text-sm font-semibold text-foreground">{usd(p.debt)}</span>
                            <Badge cls={DEBT_BADGE[p.risk]}>{p.risk}</Badge>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Recent transactions */}
            <SectionCard title="Recent Transactions" action={
                <Link href="/finance/transactions" className="flex items-center gap-1 text-xs text-secondary-foreground hover:text-foreground">
                    View all <ChevronRight className="h-3 w-3"/>
                </Link>
            }>
                <FTable headers={["ID", "Student", "Program", "Date", "Amount", "Status"]}>
                    {TRANSACTIONS.slice(0, 6).map((t) => (
                        <Tr key={t.id}>
                            <Td mono>{t.id}</Td>
                            <Td>{t.student}</Td>
                            <Td><Tag>{t.program}</Tag></Td>
                            <Td>{t.date}</Td>
                            <Td><span className="font-medium">{usd(t.amount)}</span></Td>
                            <Td><Badge cls={TX_BADGE[t.status]}>{t.status}</Badge></Td>
                        </Tr>
                    ))}
                </FTable>
            </SectionCard>
        </div>
    );
}
