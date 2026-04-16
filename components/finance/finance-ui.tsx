// components/finance/finance-ui.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function KPI({ label, value, sub, trend, accent = "default" }: {
    label: string; value: string; sub?: string;
    trend?: "up" | "down";
    accent?: "default" | "success" | "danger" | "warning" | "info";
}) {
    const borderColor = {
        default: "border-l-border",
        success: "border-l-[#10b981]",
        danger:  "border-l-[#ef4444]",
        warning: "border-l-[#f59e0b]",
        info:    "border-l-[#3b82f6]",
    }[accent];

    return (
        <div className={`rounded-lg border border-border border-l-4 ${borderColor} bg-background p-4`}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-secondary-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {sub && (
                <p className={`mt-1 flex items-center gap-1 text-xs ${
                    trend === "up" ? "text-[#10b981]" : trend === "down" ? "text-[#ef4444]" : "text-secondary-foreground"
                }`}>
                    {trend === "up"   && <ArrowUpRight   className="h-3 w-3" />}
                    {trend === "down" && <ArrowDownRight  className="h-3 w-3" />}
                    {sub}
                </p>
            )}
        </div>
    );
}

export function Badge({ children, cls }: { children: React.ReactNode; cls: string }) {
    return (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
    );
}

export function Tag({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground">
      {children}
    </span>
    );
}

export function SectionCard({ title, sub, action, children }: {
    title?: string; sub?: string;
    action?: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-border bg-background p-4 mb-4">
            {(title || action) && (
                <div className="mb-3 flex items-start justify-between">
                    <div>
                        {title && <p className="text-sm font-medium text-foreground">{title}</p>}
                        {sub   && <p className="text-xs text-secondary-foreground mt-0.5">{sub}</p>}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </div>
    );
}

export function FTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-border bg-secondary">
                    {headers.map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-secondary-foreground whitespace-nowrap">
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-border">{children}</tbody>
            </table>
        </div>
    );
}

export function Tr({ children }: { children: React.ReactNode }) {
    return <tr className="hover:bg-secondary/40 transition-colors">{children}</tr>;
}

export function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
    return (
        <td className={`px-3 py-2.5 text-sm text-foreground whitespace-nowrap ${mono ? "font-mono text-xs text-secondary-foreground" : ""}`}>
            {children}
        </td>
    );
}

export function AlertBox({ type, children }: {
    type: "warning" | "danger" | "success"; children: React.ReactNode;
}) {
    const styles = {
        warning: "border-[#fcd34d] bg-[#fef3c7] text-[#92400e]",
        danger:  "border-[#fca5a5] bg-[#fee2e2] text-[#991b1b]",
        success: "border-[#6ee7b7] bg-[#d1fae5] text-[#065f46]",
    }[type];
    return (
        <div className={`mb-4 flex items-start gap-2 rounded-lg border p-3 text-sm ${styles}`}>
            {children}
        </div>
    );
}

export function ActionBtn({ children, onClick, variant = "default" }: {
    children: React.ReactNode; onClick?: () => void;
    variant?: "default" | "success" | "danger" | "warning";
}) {
    const styles = {
        default: "border-border text-secondary-foreground hover:bg-secondary",
        success: "border-[#6ee7b7] text-[#065f46] hover:bg-[#d1fae5]",
        danger:  "border-[#fca5a5] text-[#991b1b] hover:bg-[#fee2e2]",
        warning: "border-[#fcd34d] text-[#92400e] hover:bg-[#fef3c7]",
    }[variant];
    return (
        <button onClick={onClick} className={`rounded border px-2 py-0.5 text-xs transition-colors ${styles}`}>
            {children}
        </button>
    );
}
