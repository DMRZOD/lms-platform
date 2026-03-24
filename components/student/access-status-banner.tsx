import type { AccessStatus } from "@/types/student";
import { AlertCircle, AlertTriangle, Clock, Info, ShieldX } from "lucide-react";
import Link from "next/link";

type AccessStatusBannerProps = {
  accessStatus: AccessStatus;
  overrideUntil?: string;
};

export function AccessStatusBanner({ accessStatus, overrideUntil }: AccessStatusBannerProps) {
  if (accessStatus === "Active") return null;

  if (accessStatus === "BlockedByDebt") {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="flex-1">
          <p className="font-semibold text-amber-800">Account restricted due to outstanding payment</p>
          <p className="mt-0.5 text-sm text-amber-700">
            Your account is in read-only mode. You cannot submit assignments or take exams until the balance is cleared.{" "}
            <Link href="/student/finance" className="font-medium underline underline-offset-2">
              View payment details
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (accessStatus === "SuspendedByAdmin") {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div className="flex-1">
          <p className="font-semibold text-red-800">Account suspended by administration</p>
          <p className="mt-0.5 text-sm text-red-700">
            Your account has been temporarily suspended. Please contact the academic department for more information.
          </p>
        </div>
      </div>
    );
  }

  if (accessStatus === "TemporaryOverride") {
    const overrideDate = overrideUntil
      ? new Date(overrideUntil).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
      : "unknown date";
    return (
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-blue-800">Temporary access granted</p>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              <Clock className="h-3 w-3" /> Until {overrideDate}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-blue-700">
            You have temporary full access granted by the Academic Department. After {overrideDate}, restrictions will apply if the underlying issue is not resolved.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export function BlockedByFraudPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <ShieldX className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="mt-4 text-xl font-bold">Account Access Suspended</h2>
      <p className="mt-2 max-w-sm text-sm text-secondary-foreground">
        Your account has been suspended pending an investigation into a potential policy violation. All access has been temporarily disabled.
      </p>
      <p className="mt-4 text-sm text-secondary-foreground">
        For assistance, contact the Academic Integrity Office at{" "}
        <span className="font-medium text-foreground">integrity@uou.edu</span>
      </p>
    </div>
  );
}
