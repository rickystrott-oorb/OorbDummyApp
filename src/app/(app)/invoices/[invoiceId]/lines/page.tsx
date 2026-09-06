import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { invoiceById, money } from "@/lib/data/fixtures";
import { RowLink, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Invoice lines" };

/** Every line on the invoice. Each opens for editing. */
export default async function InvoiceLinesPage({
    params,
}: {
    params: Promise<{ invoiceId: string }>;
}) {
    const { invoiceId } = await params;
    const invoice = invoiceById(invoiceId);
    if (!invoice) notFound();

    return (
        <Table columns={["Description", "Qty", "Unit", "Amount", ""]}>
            {invoice.lines.map((line, index) => (
                <tr key={line.description} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-700">{line.description}</td>
                    <td className="px-4 py-2.5 tabular-nums text-slate-600">{line.quantity}</td>
                    <td className="px-4 py-2.5 tabular-nums text-slate-600">{money(line.unitCents)}</td>
                    <td className="px-4 py-2.5 tabular-nums text-slate-900">
                        {money(line.quantity * line.unitCents)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                        <RowLink href={`/invoices/${invoice.id}/lines/${index + 1}`}>Edit</RowLink>
                    </td>
                </tr>
            ))}
            <tr className="bg-slate-50">
                <td colSpan={3} className="px-4 py-2.5 text-right font-medium text-ink">
                    Total
                </td>
                <td className="px-4 py-2.5 font-bold tabular-nums text-ink">{money(invoice.totalCents)}</td>
                <td />
            </tr>
        </Table>
    );
}
