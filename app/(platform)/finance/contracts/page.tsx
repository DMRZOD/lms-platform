"use client";

import { KPI, Badge, Tag, SectionCard, FTable, Tr, Td } from "@/components/finance/finance-ui";
import { CONTRACTS, CONTRACT_BADGE, usd } from "@/constants/finance-mock-data";

export default function ContractsPage() {
    return (
        <div>
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <KPI label="Active Contracts"  value="412"    sub="Spring 2026"      accent="success"/>
                <KPI label="Pending Signature" value="18"     sub="Awaiting student" accent="warning"/>
                <KPI label="Expired"           value="7"      sub="Need renewal"     accent="danger" />
                <KPI label="Total Value"       value="$1.38M" sub="Semester total"   accent="info"   />
            </div>

            <SectionCard title="Contract Registry" action={
                <button className="rounded-md border border-border px-3 py-1.5 text-xs text-secondary-foreground hover:bg-secondary">
                    + New Contract
                </button>
            }>
                <FTable headers={["Contract ID", "Student", "Program", "Start", "End", "Amount", "Schedule", "Status"]}>
                    {CONTRACTS.map((c) => (
                        <Tr key={c.id}>
                            <Td mono>{c.id}</Td>
                            <Td>{c.student}</Td>
                            <Td><Tag>{c.program}</Tag></Td>
                            <Td>{c.start}</Td>
                            <Td>{c.end}</Td>
                            <Td><span className="font-medium">{usd(c.amount)}</span></Td>
                            <Td>{c.schedule}</Td>
                            <Td>
                                <Badge cls={CONTRACT_BADGE[c.status] ?? "bg-secondary text-secondary-foreground"}>
                                    {c.status}
                                </Badge>
                            </Td>
                        </Tr>
                    ))}
                </FTable>
            </SectionCard>
        </div>
    );
}
