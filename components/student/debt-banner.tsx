import { AlertTriangle } from "lucide-react";
import Link from "next/link";

type DebtBannerProps = {
  amount: number;
  currency: string;
  nextPaymentDate?: string;
};

export function DebtBanner({ amount, currency, nextPaymentDate }: DebtBannerProps) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      <div className="flex-1">
        <p className="font-semibold text-red-800">
          Outstanding balance: {currency} {amount.toLocaleString()}
        </p>
        <p className="mt-0.5 text-sm text-red-700">
          {nextPaymentDate
            ? `Next payment of ${currency} ${amount.toLocaleString()} is due by ${new Date(nextPaymentDate).toLocaleDateString("en-US", { day: "numeric", month: "long" })}.`
            : "Please settle your outstanding balance to avoid account restrictions."}
        </p>
      </div>
      <Link
        href="/student/finance"
        className="shrink-0 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Pay Now
      </Link>
    </div>
  );
}
