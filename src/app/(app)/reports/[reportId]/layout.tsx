import { notFound } from "next/navigation";

import { planAtLeast, requireSession } from "@/lib/auth/session";
import { reportById } from "@/lib/data/fixtures";
import { ButtonLink, Locked, PageHeader } from "@/components/ui/primitives";
import { RecordTabs } from "@/components/nav/record-tabs";

/**
 * One report, and the plan gate in front of all of it.
 *
 * The gate moved here from the report page when the report grew tabs: four
 * screens each repeating `planAtLeast(session.plan, report.minimumPlan)` is
 * four chances to forget one. The list still decides what to SHOW; this
 * decides what to serve, and a reader from a lower plan gets the explanation
 * on every tab rather than a blank page on some of them.
 */
export default async function ReportLayout({
    params,
    children,
}: {
    params: Promise<{ reportId: string }>;
    children: React.ReactNode;
}) {
    const { reportId } = await params;
    const report = reportById(reportId);
    if (!report) notFound();

    const session = await requireSession();

    if (!planAtLeast(session.plan, report.minimumPlan)) {
        return (
            <>
                <PageHeader title={report.name} description={report.summary} />
                <Locked
                    reason={`${report.name} is part of the ${report.minimumPlan} plan. This workspace is on ${session.plan}.`}
                    cta="Compare plans"
                />
            </>
        );
    }

    const base = `/reports/${report.id}`;

    return (
        <>
            <PageHeader
                title={report.name}
                description={`${report.summary} · runs ${report.cadence}`}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <ButtonLink href={`${base}/schedules/new`} tone="secondary" testId="schedule-report">
                            Schedule
                        </ButtonLink>
                        <ButtonLink href={`${base}/configure`} testId="configure-report">
                            Configure &amp; run
                        </ButtonLink>
                    </div>
                }
            />

            <RecordTabs
                base={base}
                items={[
                    { href: base, label: "Latest" },
                    { href: `${base}/configure`, label: "Configure" },
                    { href: `${base}/schedules`, label: "Schedules" },
                    { href: `${base}/runs`, label: "Past runs" },
                ]}
            />

            {children}
        </>
    );
}
