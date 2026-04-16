"use client";

import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";
import { Badge, SectionCard, FTable, Tr, Td } from "@/components/finance/finance-ui";
import { AUDIT_LOG, AUDIT_BADGE } from "@/constants/finance-mock-data";

const FILTERS = ["all", "Payments", "Blocks", "Overrides", "Contracts"] as const;
const FILTER_MAP: Record<string, string[]> = {
    Payments:  ["PAYMENT_CONFIRMED", "MANUAL_UNBLOCK"],
    Blocks:    ["AUTO_BLOCK", "FRAUD_BLOCK"],
    Overrides: ["OVERRIDE"],
    Contracts: ["CONTRACT_CREATED"],
};

export default function AuditPage() {
    const [filter, setFilter]   = useState("all");
    const [search, setSearch]   = useState("");

    const filtered = useMemo(() => {
        return AUDIT_LOG.filter((l) => {
            const matchF = filter === "all" || (FILTER_MAP[filter] ?? []).includes(l.action);
            const matchS = !search ||
                l.actor.toLowerCase().includes(search.toLowerCase()) ||
                l.entity.toLowerCase().includes(search.toLowerCase()) ||
                l.action.toLowerCase().includes(search.toLowerCase());
            return matchF && matchS;
        });
    }, [filter, search]);

    return (
        <div>
            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary-foreground"/>
                    <input
                        type="text"
                        placeholder="Search actor, entity, action…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-56 rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm focus:outline-none"
                    />
                </div>
                {FILTERS.map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                filter === f
                                    ? "bg-foreground text-background"
                                    : "border border-border bg-background text-secondary-foreground hover:bg-secondary"
                            }`}>
                        {f}
                    </button>
                ))}
                <button className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-secondary-foreground hover:bg-secondary">
                    <Download className="h-3.5 w-3.5"/> Export log
                </button>
            </div>

            <SectionCard title="Immutable audit log" sub="All finance actions · tamper-evident">
                <FTable headers={["Timestamp", "Actor", "Action", "Entity", "Details", "IP"]}>
                    {filtered.map((l, i) => (
                        <Tr key={i}>
                            <Td mono>{l.time}</Td>
                            <Td>{l.actor}</Td>
                            <Td>
                                <Badge cls={AUDIT_BADGE[l.action] ?? "bg-secondary text-secondary-foreground"}>
                                    {l.action}
                                </Badge>
                            </Td>
                            <Td mono>{l.entity}</Td>
                            <Td><span className="text-xs text-secondary-foreground">{l.detail}</span></Td>
                            <Td mono>{l.ip}</Td>
                        </Tr>
                    ))}
                </FTable>
                {filtered.length === 0 && (
                    <p className="py-8 text-center text-sm text-secondary-foreground">No entries match the filter.</p>
                )}
            </SectionCard>
        </div>
    );
}
