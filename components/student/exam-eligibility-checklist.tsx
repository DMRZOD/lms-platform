import type { ExamEligibility } from "@/types/student";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ExamEligibilityChecklistProps = {
  eligibility: ExamEligibility;
};

type CheckItemProps = {
  met: boolean;
  label: string;
  detail?: string;
};

function CheckItem({ met, label, detail }: CheckItemProps) {
  return (
    <div className="flex items-start gap-2.5">
      {met ? (
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
      ) : (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      )}
      <div>
        <p className={cn("text-sm", met ? "text-foreground" : "text-foreground")}>{label}</p>
        {detail && <p className="text-xs text-secondary-foreground">{detail}</p>}
      </div>
    </div>
  );
}

export function ExamEligibilityChecklist({ eligibility }: ExamEligibilityChecklistProps) {
  return (
    <div className="space-y-2.5">
      <CheckItem
        met={eligibility.attendanceMet}
        label="Attendance requirement"
        detail={`${eligibility.attendanceActual}% actual / ${eligibility.attendanceRequired}% required`}
      />
      <CheckItem
        met={eligibility.debtFree}
        label="No outstanding payments"
        detail={eligibility.debtFree ? undefined : "Settle your debt to become eligible"}
      />
      <CheckItem
        met={eligibility.prerequisitesDone}
        label="Prerequisites completed"
        detail={
          eligibility.prerequisites.length > 0
            ? eligibility.prerequisites.join(", ")
            : undefined
        }
      />
      {eligibility.overrideGranted && (
        <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-700">Override granted by Academic Department</p>
        </div>
      )}
    </div>
  );
}
