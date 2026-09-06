import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CUSTOMERS, money, reportById, runById } from "@/lib/data/fixtures";
import { Card, Facts, Table } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Report run" };

/** One run, frozen: what the report said on that day. */
export default async function ReportRunPage({
    params,
}: {
    params: Promise<{ reportId: string; runId: string }>;
}) {
    const { reportId, runId } = await params;
    const report = reportById(reportId);
    const run = runById(runId);
    if (!report || !run || run.reportId !== report.id) notFound();

    return (
        <>
            <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <Facts
                        items={[
                            { label: "Ran", value: run.ranAt },
                            { label: "Trigger", value: run.trigger },
                            { label: "Rows", value: `${run.rows}` },
                            { label: "Reference", value: run.id },
                        ]}
                    />
                    <ExportButton />
                </div>
            </Card>
            <Table columns={["Customer", "Country", "Contribution"]}>
                {CUSTOMERS.filter((customer) => customer.mrrCents > 0)
                    .slice(0, run.rows)
                    .map((customer) => (
                        <tr key={customer.id}>
                            <td className="px-4 py-2.5 font-medium text-ink">{customer.name}</td>
                            <td className="px-4 py-2.5 text-slate-600">{customer.country}</td>
                            <td className="px-4 py-2.5 tabular-nums text-slate-900">{money(customer.mrrCents * 12)}</td>
                        </tr>
                    ))}
            </Table>
        </>
    );
}
