"use client";

import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";
import { Badge, Tag, SectionCard, FTable, Tr, Td } from "@/components/finance/finance-ui";
import { TRANSACTIONS, TX_BADGE, usd } from "@/constants/finance-mock-data";

export default function TransactionsPage() {
    const [txFilter, setTxFilter] = useState("all");
    const [txSearch, setTxSearch] = useState("");

    const filtered = useMemo(() =>
        TRANSACTIONS.filter((t) => {
            const matchF = txFilter === "all" || t.status === txFilter;
            const matchS = !txSearch ||
                t.student.toLowerCase().includes(txSearch.toLowerCase()) ||
                t.id.toLowerCase().includes(txSearch.toLowerCase());
            return matchF && matchS;
        }), [txFilter, txSearch]);

    return (
        <div>
            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary-foreground"/>
                    <input
                        type="text"
                        placeholder="Search student or ID…"
                        value={txSearch}
                        onChange={(e) => setTxSearch(e.target.value)}
                        className="w-56 rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm focus:outline-none"
                    />
                </div>
                {["all", "paid", "pending", "overdue", "partial"].map((f) => (
                    <button key={f} onClick={() => setTxFilter(f)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                                txFilter === f
                                    ? "bg-foreground text-background"
                                    : "border border-border bg-background text-secondary-foreground hover:bg-secondary"
                            }`}>
                        {f}
                    </button>
                ))}
                <button className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-secondary-foreground hover:bg-secondary">
                    <Download className="h-3.5 w-3.5"/> Export CSV
                </button>
            </div>

            <SectionCard title={`${filtered.length} transactions`}>
                <FTable headers={["Transaction", "Student", "Program", "Date", "Amount", "Method", "Status", "Action"]}>
                    {filtered.map((t) => (
                        <Tr key={t.id}>
                            <Td mono>{t.id}</Td>
                            <Td>{t.student}</Td>
                            <Td><Tag>{t.program}</Tag></Td>
                            <Td>{t.date}</Td>
                            <Td><span className="font-medium">{usd(t.amount)}</span></Td>
                            <Td>{t.method}</Td>
                            <Td><Badge cls={TX_BADGE[t.status]}>{t.status}</Badge></Td>
                            <Td>
                                {(t.status === "overdue" || t.status === "pending") && (
                                    <button className="rounded border border-border px-2 py-0.5 text-xs hover:bg-secondary">
                                        Remind
                                    </button>
                                )}
                            </Td>
                        </Tr>
                    ))}
                </FTable>
                {filtered.length === 0 && (
                    <p className="py-8 text-center text-sm text-secondary-foreground">
                        No transactions match the filter.
                    </p>
                )}
            </SectionCard>
        </div>
    );
}
