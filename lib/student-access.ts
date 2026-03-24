import type { AccessStatus } from "@/types/student";

export function canSubmit(status: AccessStatus): boolean {
  return status === "Active" || status === "TemporaryOverride";
}

export function isReadOnly(status: AccessStatus): boolean {
  return status === "BlockedByDebt" || status === "SuspendedByAdmin";
}

export function isFullyBlocked(status: AccessStatus): boolean {
  return status === "BlockedByFraud";
}

export function canJoinLecture(status: AccessStatus): boolean {
  return status === "Active" || status === "TemporaryOverride";
}

export function canTakeExam(status: AccessStatus): boolean {
  return status === "Active" || status === "TemporaryOverride";
}
