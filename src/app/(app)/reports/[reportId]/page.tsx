import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CUSTOMERS, money, reportById, runsForReport } from "@/lib/data/fixtures";
import { Card, RowLink, Table } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Report" };

/** The most recent run of the report. The plan gate is on the layout. */
export default async function ReportLatestPage({
    params,
}: {
    params: Promise<{ reportId: string }>;
}) {
    const { reportId } = await params;
    const report = reportById(reportId);
    if (!report) notFound();

    const latest = runsForReport(report.id)[0];

    return (
        <>
            <Card>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-600">
                        {latest ? (
                            <>
                                Last run {latest.ranAt} ({latest.trigger}) —{" "}
                                <RowLink href={`/reports/${report.id}/runs/${latest.id}`}>see that run</RowLink>.
                            </>
                        ) : (
                            "This report has not run yet. Configure it and run it now."
                        )}{" "}
                        Figures are fixtures and do not change between runs, which is deliberate.
                    </p>
                    <ExportButton />
                </div>
            </Card>

            <Table columns={["Customer", "Country", "Contribution"]}>
                {CUSTOMERS.filter((customer) => customer.mrrCents > 0).map((customer) => (
                    <tr key={customer.id}>
                        <td className="px-4 py-2.5">
                            <RowLink href={`/customers/${customer.id}`}>{customer.name}</RowLink>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{customer.country}</td>
                        <td className="px-4 py-2.5 tabular-nums text-slate-900">{money(customer.mrrCents * 12)}</td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
