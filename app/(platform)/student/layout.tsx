"use client";

import { mockStudentProfile } from "@/constants/student-mock-data";
import { AccessStatusBanner, BlockedByFraudPage } from "@/components/student/access-status-banner";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { accessStatus, temporaryOverrideUntil } = mockStudentProfile;

  if (accessStatus === "BlockedByFraud") {
    return <BlockedByFraudPage />;
  }

  return (
    <div>
      <AccessStatusBanner accessStatus={accessStatus} overrideUntil={temporaryOverrideUntil} />
      {children}
    </div>
  );
}
