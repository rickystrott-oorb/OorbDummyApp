import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { planAtLeast, requireSession } from "@/lib/auth/session";
import { money, reportById, CUSTOMERS } from "@/lib/data/fixtures";
import { Card, Locked, PageHeader, Table } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Report" };

/**
 * One report.
 *
 * The plan gate lives here, not in the catalogue: the list decides what to
 * SHOW, and this decides what to serve. A reader following the link from a
 * lower plan gets an explanation rather than a blank page.
 */
export default async function ReportDetailPage({
    params,
}: {
    params: Promise<{ reportId: string }>;
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

    return (
        <>
            <PageHeader
                title={report.name}
                description={`${report.summary} · runs ${report.cadence}`}
                action={<ExportButton />}
            />

            <Card>
                <p className="text-sm text-slate-600">
                    Figures below are fixtures. They do not change between runs, which
                    is deliberate — a number that moved on refresh would look live.
                </p>
            </Card>

            <Table columns={["Customer", "Country", "Contribution"]}>
                {CUSTOMERS.filter((customer) => customer.mrrCents > 0).map((customer) => (
                    <tr key={customer.id}>
                        <td className="px-4 py-2.5 font-medium text-ink">{customer.name}</td>
                        <td className="px-4 py-2.5 text-slate-600">{customer.country}</td>
                        <td className="px-4 py-2.5 tabular-nums text-slate-900">
                            {money(customer.mrrCents * 12)}
                        </td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
