import type { Payment } from "@/types/student";
import { Receipt } from "lucide-react";
import { StudentStatusBadge } from "./student-status-badge";

type PaymentRowProps = {
  payment: Payment;
};

export function PaymentRow({ payment }: PaymentRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Receipt className="h-4 w-4 text-secondary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{payment.description}</p>
          <p className="text-xs text-secondary-foreground">
            Due{" "}
            {new Date(payment.dueDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {payment.paidDate &&
              ` · Paid ${new Date(payment.paidDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">
          {payment.currency} {payment.amount.toLocaleString()}
        </span>
        <StudentStatusBadge status={payment.status} />
      </div>
    </div>
  );
}
