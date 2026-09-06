import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { reportById, runsForReport } from "@/lib/data/fixtures";
import { Badge, Card, RowLink, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Past runs" };

/** Every time the report ran, and what it produced. */
export default async function ReportRunsPage({
    params,
}: {
    params: Promise<{ reportId: string }>;
}) {
    const { reportId } = await params;
    const report = reportById(reportId);
    if (!report) notFound();

    const runs = runsForReport(report.id);

    if (runs.length === 0) {
        return (
            <Card>
                <p className="text-sm text-slate-600">{report.name} has not run yet.</p>
            </Card>
        );
    }

    return (
        <Table columns={["Ran", "Trigger", "Rows", ""]}>
            {runs.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-700">{run.ranAt}</td>
                    <td className="px-4 py-2.5">
                        <Badge value={run.trigger} />
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-slate-600">{run.rows}</td>
                    <td className="px-4 py-2.5 text-right">
                        <RowLink href={`/reports/${report.id}/runs/${run.id}`}>Open</RowLink>
                    </td>
                </tr>
            ))}
        </Table>
    );
}
