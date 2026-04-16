export type TxStatus       = "paid" | "pending" | "overdue" | "partial";
export type BlockType      = "BlockedByDebt" | "BlockedByFraud";
export type ContractStatus = "active" | "overdue" | "pending sig." | "blocked-fraud" | "1 left";
export type SyncStatus     = "success" | "warning";
export type RiskLevel      = "high" | "medium" | "low";

export interface Transaction {
    id: string; student: string; program: string;
    amount: number; date: string; method: string; status: TxStatus;
}

export interface Contract {
    id: string; student: string; program: string;
    start: string; end: string; amount: number;
    schedule: string; status: ContractStatus;
}

export interface BlockedStudent {
    id: string; name: string; program: string;
    debt: number; since: string; days: number; type: BlockType;
}

export interface OverdueStudent {
    name: string; program: string; dueDate: string;
    debt: number; daysLate: number; warnings: number;
    status: "blocked" | "warned";
}

export interface SyncRecord {
    time: string; status: SyncStatus;
    matched: number; unmatched: number; duplicates: number;
}

export interface AuditEntry {
    time: string; actor: string; action: string;
    entity: string; detail: string; ip: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MONTHLY_REVENUE = [
    { month: "Sep", collected: 142, expected: 160, debt: 18 },
    { month: "Oct", collected: 155, expected: 168, debt: 13 },
    { month: "Nov", collected: 148, expected: 165, debt: 17 },
    { month: "Dec", collected: 162, expected: 172, debt: 10 },
    { month: "Jan", collected: 134, expected: 170, debt: 36 },
    { month: "Feb", collected: 158, expected: 175, debt: 17 },
    { month: "Mar", collected: 171, expected: 178, debt: 7  },
    { month: "Apr", collected: 143, expected: 180, debt: 37 },
];

export const PAYMENT_STATUS = [
    { name: "Paid on Time", value: 312, color: "#10b981" },
    { name: "Pending",      value: 87,  color: "#f59e0b" },
    { name: "Overdue",      value: 43,  color: "#ef4444" },
    { name: "Partial",      value: 28,  color: "#6366f1" },
];

export const DEBT_BY_PROGRAM = [
    { name: "Computer Science",  debt: 48200, students: 23, pct: 100, risk: "high"   as RiskLevel },
    { name: "Business Admin",    debt: 31500, students: 18, pct: 65,  risk: "medium" as RiskLevel },
    { name: "Data Science",      debt: 22800, students: 11, pct: 47,  risk: "medium" as RiskLevel },
    { name: "Mechanical Eng.",   debt: 15600, students: 8,  pct: 32,  risk: "low"    as RiskLevel },
    { name: "Digital Marketing", debt: 9200,  students: 5,  pct: 19,  risk: "low"    as RiskLevel },
];

export const TRANSACTIONS: Transaction[] = [
    { id: "TXN-8821", student: "Amir Saidov",      program: "Computer Science",  amount: 1500, date: "Apr 14, 2026", method: "card",         status: "paid"    },
    { id: "TXN-8820", student: "Dina Karimova",     program: "Business Admin",    amount: 1500, date: "Apr 14, 2026", method: "bank transfer", status: "paid"    },
    { id: "TXN-8819", student: "Timur Yusupov",     program: "Data Science",      amount: 750,  date: "Apr 13, 2026", method: "card",         status: "partial" },
    { id: "TXN-8818", student: "Malika Rashidova",  program: "Computer Science",  amount: 1500, date: "Apr 12, 2026", method: "—",            status: "overdue" },
    { id: "TXN-8817", student: "Bekzod Mirzayev",   program: "Digital Marketing", amount: 900,  date: "Apr 12, 2026", method: "card",         status: "paid"    },
    { id: "TXN-8816", student: "Zulfiya Tosheva",   program: "Mechanical Eng.",   amount: 1200, date: "Apr 11, 2026", method: "—",            status: "pending" },
    { id: "TXN-8815", student: "Jasur Nazarov",     program: "Business Admin",    amount: 1500, date: "Apr 11, 2026", method: "—",            status: "overdue" },
    { id: "TXN-8814", student: "Nilufar Ergasheva", program: "Data Science",      amount: 1500, date: "Apr 10, 2026", method: "bank transfer", status: "paid"   },
    { id: "TXN-8813", student: "Otabek Xolmatov",   program: "Computer Science",  amount: 1500, date: "Apr 10, 2026", method: "card",         status: "paid"    },
    { id: "TXN-8812", student: "Shahnoza Alieva",   program: "Digital Marketing", amount: 450,  date: "Apr 9, 2026",  method: "card",         status: "partial" },
];

export const CONTRACTS: Contract[] = [
    { id: "CTR-2026-0142", student: "Amir Saidov",      program: "CS", start: "Sep 2025", end: "Jun 2026", amount: 5000, schedule: "Installments ×2", status: "active"        },
    { id: "CTR-2026-0198", student: "Jasur Nazarov",     program: "BA", start: "Sep 2025", end: "Jun 2026", amount: 4500, schedule: "Installments ×2", status: "overdue"       },
    { id: "CTR-2026-0231", student: "Rustam Qodirov",    program: "DS", start: "Sep 2025", end: "Jun 2026", amount: 5500, schedule: "Full payment",    status: "overdue"       },
    { id: "CTR-2026-0267", student: "Feruza Yuldasheva", program: "CS", start: "Sep 2025", end: "Jun 2026", amount: 5000, schedule: "Installments ×2", status: "pending sig."  },
    { id: "CTR-2026-0312", student: "Sherzod Tursunov",  program: "ME", start: "Sep 2025", end: "Jun 2026", amount: 4800, schedule: "Installments ×3", status: "blocked-fraud" },
    { id: "CTR-2026-0401", student: "Nilufar Ergasheva", program: "DS", start: "Sep 2025", end: "Jun 2026", amount: 5500, schedule: "Full payment",    status: "active"        },
    { id: "CTR-2026-0502", student: "Malika Rashidova",  program: "CS", start: "Sep 2025", end: "Jun 2026", amount: 5000, schedule: "Installments ×2", status: "1 left"        },
];

export const OVERDUE_STUDENTS: OverdueStudent[] = [
    { name: "Malika Rashidova", program: "CS", dueDate: "Apr 1",  debt: 3000, daysLate: 14, warnings: 2, status: "blocked" },
    { name: "Jasur Nazarov",    program: "BA", dueDate: "Apr 1",  debt: 1500, daysLate: 14, warnings: 2, status: "blocked" },
    { name: "Rustam Qodirov",   program: "DS", dueDate: "Mar 28", debt: 4500, daysLate: 18, warnings: 2, status: "blocked" },
    { name: "Kamola Yusupova",  program: "CS", dueDate: "Apr 5",  debt: 1500, daysLate: 10, warnings: 1, status: "warned"  },
    { name: "Behruz Ismoilov",  program: "ME", dueDate: "Apr 7",  debt: 2400, daysLate: 8,  warnings: 1, status: "warned"  },
    { name: "Sarvar Toshmatov", program: "DM", dueDate: "Apr 8",  debt: 900,  daysLate: 7,  warnings: 1, status: "warned"  },
];

export const BLOCKED_STUDENTS: BlockedStudent[] = [
    { id: "STU-0142", name: "Malika Rashidova",  program: "CS", debt: 3000, since: "Apr 1, 2026",  days: 14, type: "BlockedByDebt"  },
    { id: "STU-0198", name: "Jasur Nazarov",     program: "BA", debt: 1500, since: "Apr 2, 2026",  days: 13, type: "BlockedByDebt"  },
    { id: "STU-0231", name: "Rustam Qodirov",    program: "DS", debt: 4500, since: "Mar 28, 2026", days: 18, type: "BlockedByDebt"  },
    { id: "STU-0267", name: "Feruza Yuldasheva", program: "CS", debt: 1500, since: "Apr 5, 2026",  days: 10, type: "BlockedByDebt"  },
    { id: "STU-0312", name: "Sherzod Tursunov",  program: "ME", debt: 2400, since: "Apr 8, 2026",  days: 7,  type: "BlockedByFraud" },
];

export const SYNC_LOG: SyncRecord[] = [
    { time: "2026-04-15 09:00", status: "success", matched: 284, unmatched: 3, duplicates: 0 },
    { time: "2026-04-15 06:00", status: "success", matched: 281, unmatched: 2, duplicates: 1 },
    { time: "2026-04-15 03:00", status: "success", matched: 280, unmatched: 4, duplicates: 0 },
    { time: "2026-04-14 21:00", status: "warning", matched: 275, unmatched: 8, duplicates: 2 },
    { time: "2026-04-14 18:00", status: "success", matched: 278, unmatched: 3, duplicates: 0 },
];

export const UNMATCHED_RECORDS = [
    { ref: "1C-88421", student: "Kamol Rakhimov", amount: 1500, issue: "Student ID not found in LMS" },
    { ref: "1C-88419", student: "—",              amount: 900,  issue: "No student reference"        },
    { ref: "1C-88415", student: "Aziza Nazarova", amount: 750,  issue: "Duplicate payment detected"  },
];

export const AUDIT_LOG: AuditEntry[] = [
    { time: "2026-04-15 09:42", actor: "N. Petrov",          action: "PAYMENT_CONFIRMED", entity: "STU-0142", detail: "$1,500 installment confirmed via 1C",                          ip: "10.0.1.44" },
    { time: "2026-04-15 09:15", actor: "System",             action: "AUTO_BLOCK",        entity: "STU-0267", detail: "Debt threshold exceeded — auto-block triggered",               ip: "system"    },
    { time: "2026-04-15 09:00", actor: "System",             action: "1C_SYNC",           entity: "—",        detail: "284 matched, 3 unmatched, 0 duplicates",                       ip: "system"    },
    { time: "2026-04-14 16:30", actor: "A. Karimov (Acad.)", action: "OVERRIDE",          entity: "STU-0501", detail: "TemporaryOverride granted · scholarship pending · expires Apr 30", ip: "10.0.1.31" },
    { time: "2026-04-14 14:12", actor: "N. Petrov",          action: "REMINDER_SENT",     entity: "STU-0198", detail: "2nd warning email sent — debt $1,500",                         ip: "10.0.1.44" },
    { time: "2026-04-14 11:05", actor: "N. Petrov",          action: "CONTRACT_CREATED",  entity: "CTR-0502", detail: "New contract for Malika Rashidova · $5,000",                   ip: "10.0.1.44" },
    { time: "2026-04-13 08:22", actor: "System",             action: "FRAUD_BLOCK",       entity: "STU-0312", detail: "Fraud flag received — access blocked",                         ip: "system"    },
    { time: "2026-04-12 17:41", actor: "N. Petrov",          action: "MANUAL_UNBLOCK",    entity: "STU-0088", detail: "Manual unblock after full payment · reason: 1C delay",         ip: "10.0.1.44" },
];

export const DEBT_AGING = [
    { label: "7–14 days",  count: 21 },
    { label: "14–30 days", count: 17 },
    { label: "30+ days",   count: 5  },
];

export const DROPOUT_RISK = [
    { label: "CS", score: 82 },
    { label: "BA", score: 64 },
    { label: "DS", score: 58 },
    { label: "ME", score: 35 },
    { label: "DM", score: 22 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function usd(n: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", maximumFractionDigits: 0,
    }).format(n);
}

export const TX_BADGE: Record<string, string> = {
    paid:    "bg-[#d1fae5] text-[#065f46]",
    pending: "bg-[#fef3c7] text-[#92400e]",
    overdue: "bg-[#fee2e2] text-[#991b1b]",
    partial: "bg-[#ede9fe] text-[#5b21b6]",
};

export const DEBT_COLOR: Record<string, string> = {
    high:   "bg-[#ef4444]",
    medium: "bg-[#f59e0b]",
    low:    "bg-[#10b981]",
};

export const DEBT_BADGE: Record<string, string> = {
    high:   "bg-[#fee2e2] text-[#991b1b]",
    medium: "bg-[#fef3c7] text-[#92400e]",
    low:    "bg-[#d1fae5] text-[#065f46]",
};

export const CONTRACT_BADGE: Record<string, string> = {
    "active":        "bg-[#d1fae5] text-[#065f46]",
    "overdue":       "bg-[#fee2e2] text-[#991b1b]",
    "pending sig.":  "bg-[#fef3c7] text-[#92400e]",
    "blocked-fraud": "bg-[#fed7aa] text-[#9a3412]",
    "1 left":        "bg-[#fef3c7] text-[#92400e]",
};

export const AUDIT_BADGE: Record<string, string> = {
    PAYMENT_CONFIRMED: "bg-[#d1fae5] text-[#065f46]",
    AUTO_BLOCK:        "bg-[#fee2e2] text-[#991b1b]",
    "1C_SYNC":         "bg-[#dbeafe] text-[#1e40af]",
    OVERRIDE:          "bg-[#ede9fe] text-[#5b21b6]",
    REMINDER_SENT:     "bg-[#fef3c7] text-[#92400e]",
    CONTRACT_CREATED:  "bg-[#d1fae5] text-[#065f46]",
    FRAUD_BLOCK:       "bg-[#fee2e2] text-[#991b1b]",
    MANUAL_UNBLOCK:    "bg-[#d1fae5] text-[#065f46]",
};