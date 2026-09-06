import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { reportById, schedulesForReport } from "@/lib/data/fixtures";
import { ButtonLink, Card, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Report schedules" };

/** When the report runs on its own, and who gets it. */
export default async function ReportSchedulesPage({
    params,
}: {
    params: Promise<{ reportId: string }>;
}) {
    const { reportId } = await params;
    const report = reportById(reportId);
    if (!report) notFound();

    const schedules = schedulesForReport(report.id);
    const base = `/reports/${report.id}/schedules`;

    return (
        <>
            <div className="flex justify-end">
                <ButtonLink href={`${base}/new`} testId="new-schedule">
                    New schedule
                </ButtonLink>
            </div>
            {schedules.length === 0 ? (
                <Card>
                    <p className="text-sm text-slate-600">
                        {report.name} only runs when somebody asks. Add a schedule to have it sent.
                    </p>
                </Card>
            ) : (
                <Table columns={["Cadence", "Day", "Recipients", "Next run"]}>
                    {schedules.map((schedule) => (
                        <tr key={schedule.id}>
                            <td className="px-4 py-2.5 font-medium text-ink">{schedule.cadence}</td>
                            <td className="px-4 py-2.5 text-slate-600">{schedule.day}</td>
                            <td className="px-4 py-2.5 text-slate-600">{schedule.recipients.join(", ")}</td>
                            <td className="px-4 py-2.5 text-slate-600">{schedule.nextRun}</td>
                        </tr>
                    ))}
                </Table>
            )}
        </>
    );
}
