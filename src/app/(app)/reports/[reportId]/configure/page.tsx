import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CUSTOMERS, money, reportById } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, SubmitButton, Table } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Configure report" };

/**
 * Choosing what the report covers, then running it. The result renders in
 * place under a confirmation, with the export beside it — which is where
 * people go looking for a download, and where the one dead control lives.
 */
export default async function ConfigureReportPage({
    params,
    searchParams,
}: {
    params: Promise<{ reportId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { reportId } = await params;
    const report = reportById(reportId);
    if (!report) notFound();

    const { done } = await searchParams;
    const base = `/reports/${report.id}`;

    if (done) {
        return (
            <>
                <Done
                    title="Report ran"
                    detail={`${report.name} was run with your settings. The rows below are fixtures; nothing is stored in this demonstration.`}
                    back={{ href: `${base}/runs`, label: "See past runs" }}
                />
                <div className="flex justify-end">
                    <ExportButton />
                </div>
                <Table columns={["Customer", "Country", "Contribution"]}>
                    {CUSTOMERS.filter((customer) => customer.mrrCents > 0).map((customer) => (
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

    return (
        <Card>
            <DemoForm doneHref={`${base}/configure?done=1`}>
                <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                    <Field label="Period" htmlFor="period">
                        <select id="period" name="period" defaultValue="Last 90 days" className={INPUT}>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                            <option>Year to date</option>
                            <option>All time</option>
                        </select>
                    </Field>
                    <Field label="Group by" htmlFor="group">
                        <select id="group" name="group" defaultValue="Customer" className={INPUT}>
                            <option>Customer</option>
                            <option>Country</option>
                            <option>Month</option>
                        </select>
                    </Field>
                </div>
                <Field label="Currency" htmlFor="currency">
                    <select id="currency" name="currency" defaultValue="USD" className={`${INPUT} max-w-sm`}>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                    </select>
                </Field>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="includeChurned" className="h-4 w-4 accent-sea" />
                    Include churned customers
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="includeTrials" defaultChecked className="h-4 w-4 accent-sea" />
                    Include trials
                </label>
                <SubmitButton testId="run-report">Run report</SubmitButton>
            </DemoForm>
        </Card>
    );
}
