import { PageHeader } from "@/components/platform/page-header";

export default function ApplicantDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome, Applicant"
        description="Track your admission progress"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">
            Application Status
          </p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">
            Documents Uploaded
          </p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Upcoming Exams</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Application Progress</h2>
          <p className="text-sm text-secondary-foreground">
            No active application
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 font-semibold">Upcoming Exams</h2>
          <p className="text-sm text-secondary-foreground">
            No exams scheduled
          </p>
        </div>
      </div>
    </div>
  );
}
