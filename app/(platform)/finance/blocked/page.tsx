"use client";

import { AlertTriangle } from "lucide-react";
import { Badge, Tag, SectionCard, FTable, Tr, Td, AlertBox } from "@/components/finance/finance-ui";
import { BLOCKED_STUDENTS, usd } from "@/constants/finance-mock-data";

const POLICIES = [
    {
        title: "Auto-Block",
        body: "Triggered automatically when payment deadline is missed by >7 days. 1C sync confirms status.",
    },
    {
        title: "Unblock",
        body: "Automatic upon payment confirmation from 1C sync. Manual unblock requires Finance approval and audit entry.",
    },
    {
        title: "Temporary Override",
        body: "Academic Dept can grant TemporaryOverride with reason_code and expiry date. Expires automatically.",
    },
];

export default function BlockedPage() {
    return (
        <div>
            <AlertBox type="warning">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5"/>
                <span>
          5 students are currently blocked. Academic Department can issue temporary overrides
          with reason code and expiry date.
        </span>
            </AlertBox>

            <SectionCard title="Blocked students">
                <FTable headers={["Student ID", "Name", "Program", "Debt", "Blocked Since", "Days", "Block Type", "Actions"]}>
                    {BLOCKED_STUDENTS.map((s) => (
                        <Tr key={s.id}>
                            <Td mono>{s.id}</Td>
                            <Td>{s.name}</Td>
                            <Td><Tag>{s.program}</Tag></Td>
                            <Td><span className="font-semibold text-[#ef4444]">{usd(s.debt)}</span></Td>
                            <Td>{s.since}</Td>
                            <Td>{s.days}</Td>
                            <Td>
                                <Badge cls={
                                    s.type === "BlockedByDebt"
                                        ? "bg-[#fee2e2] text-[#991b1b]"
                                        : "bg-[#fed7aa] text-[#9a3412]"
                                }>
                                    {s.type}
                                </Badge>
                            </Td>
                            <Td>
                                <div className="flex gap-1.5">
                                    <button className="rounded border border-border px-2 py-0.5 text-xs hover:bg-secondary">
                                        View
                                    </button>
                                    {s.type === "BlockedByDebt" && (
                                        <button className="rounded border border-[#6ee7b7] px-2 py-0.5 text-xs text-[#065f46] hover:bg-[#d1fae5]">
                                            Mark Paid
                                        </button>
                                    )}
                                    {s.type === "BlockedByFraud" && (
                                        <button className="rounded border border-[#fdba74] px-2 py-0.5 text-xs text-[#9a3412] hover:bg-[#fed7aa]">
                                            Investigate
                                        </button>
                                    )}
                                </div>
                            </Td>
                        </Tr>
                    ))}
                </FTable>
            </SectionCard>

            {/* Policy cards */}
            <SectionCard title="Block / Unblock policy">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {POLICIES.map(({ title, body }) => (
                        <div key={title} className="rounded-lg bg-secondary p-3">
                            <p className="mb-1 text-xs font-medium text-foreground">{title}</p>
                            <p className="text-xs leading-relaxed text-secondary-foreground">{body}</p>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
}
