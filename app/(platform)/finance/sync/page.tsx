"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { KPI, Badge, SectionCard, FTable, Tr, Td, AlertBox } from "@/components/finance/finance-ui";
import { SYNC_LOG, UNMATCHED_RECORDS, usd } from "@/constants/finance-mock-data";

export default function SyncPage() {
    return (
        <div>
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <KPI label="Last Sync"     value="09:00"    sub="Today · Success"  accent="success"/>
                <KPI label="Unmatched"     value="3"         sub="Need resolution"  accent="warning"/>
                <KPI label="Frequency"     value="Every 3h"  sub="Scheduled"                       />
                <KPI label="Matched today" value="284"        sub="Records synced"  accent="success"/>
            </div>

            {/* Sync history */}
            <SectionCard title="Sync history" action={
                <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-secondary-foreground hover:bg-secondary">
                    <RefreshCw className="h-3 w-3"/> Sync now
                </button>
            }>
                <FTable headers={["Time", "Status", "Matched", "Unmatched", "Duplicates", "Action"]}>
                    {SYNC_LOG.map((l, i) => (
                        <Tr key={i}>
                            <Td mono>{l.time}</Td>
                            <Td>
                                <Badge cls={l.status === "success" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fef3c7] text-[#92400e]"}>
                                    {l.status}
                                </Badge>
                            </Td>
                            <Td>{l.matched}</Td>
                            <Td>
                <span className={l.unmatched > 0 ? "font-semibold text-[#f59e0b]" : "text-secondary-foreground"}>
                  {l.unmatched}
                </span>
                            </Td>
                            <Td>
                <span className={l.duplicates > 0 ? "font-semibold text-[#ef4444]" : "text-secondary-foreground"}>
                  {l.duplicates}
                </span>
                            </Td>
                            <Td>
                                {(l.unmatched > 0 || l.duplicates > 0) && (
                                    <button className="rounded border border-[#fcd34d] bg-[#fef3c7] px-2 py-0.5 text-xs text-[#92400e] hover:bg-[#fde68a]">
                                        Resolve {l.unmatched + l.duplicates}
                                    </button>
                                )}
                            </Td>
                        </Tr>
                    ))}
                </FTable>
            </SectionCard>

            {/* Unmatched records */}
            <SectionCard title="Unmatched records" sub="Require manual resolution">
                <AlertBox type="warning">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5"/>
                    <span>3 records from 1C cannot be matched to LMS students. Manual intervention required.</span>
                </AlertBox>
                <FTable headers={["1C Reference", "Student", "Amount", "Issue", "Action"]}>
                    {UNMATCHED_RECORDS.map((r) => (
                        <Tr key={r.ref}>
                            <Td mono>{r.ref}</Td>
                            <Td>{r.student}</Td>
                            <Td><span className="font-medium">{usd(r.amount)}</span></Td>
                            <Td><span className="text-[#92400e]">{r.issue}</span></Td>
                            <Td>
                                <button className="rounded border border-border px-2 py-0.5 text-xs hover:bg-secondary">
                                    Resolve
                                </button>
                            </Td>
                        </Tr>
                    ))}
                </FTable>
            </SectionCard>
        </div>
    );
}
