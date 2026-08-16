import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { customerById, invoiceById, money } from "@/lib/data/fixtures";
import { Badge, Card, PageHeader, RowLink } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Invoice" };

/** One invoice, its lines and who owes it. */
export default async function InvoiceDetailPage({
    params,
}: {
    params: Promise<{ invoiceId: string }>;
}) {
    const { invoiceId } = await params;
    const invoice = invoiceById(invoiceId);
    if (!invoice) notFound();

    const customer = customerById(invoice.customerId);

    return (
        <>
            <PageHeader
                title={invoice.number}
                description={`Issued ${invoice.issued} · due ${invoice.due}`}
                action={<ExportButton label="Export PDF" />}
            />

            <div className="flex flex-wrap items-center gap-3">
                <Badge value={invoice.status} />
                {customer && (
                    <RowLink href={`/customers/${customer.id}`}>{customer.name}</RowLink>
                )}
            </div>

            <Card>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Description
                            </th>
                            <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Qty
                            </th>
                            <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Unit
                            </th>
                            <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoice.lines.map((line) => (
                            <tr key={line.description}>
                                <td className="py-2 text-slate-700">{line.description}</td>
                                <td className="py-2 text-right tabular-nums text-slate-600">
                                    {line.quantity}
                                </td>
                                <td className="py-2 text-right tabular-nums text-slate-600">
                                    {money(line.unitCents)}
                                </td>
                                <td className="py-2 text-right tabular-nums text-slate-900">
                                    {money(line.quantity * line.unitCents)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-slate-200">
                            <td colSpan={3} className="pt-2 text-right text-sm font-medium text-ink">
                                Total
                            </td>
                            <td className="pt-2 text-right text-sm font-bold tabular-nums text-ink">
                                {money(invoice.totalCents)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </Card>
        </>
    );
}
