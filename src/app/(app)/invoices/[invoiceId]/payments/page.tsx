import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { invoiceById, money, paymentsForInvoice } from "@/lib/data/fixtures";
import { Badge, Card, RowLink, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Invoice payments" };

/** What has arrived against this invoice, settled or not. */
export default async function InvoicePaymentsPage({
    params,
}: {
    params: Promise<{ invoiceId: string }>;
}) {
    const { invoiceId } = await params;
    const invoice = invoiceById(invoiceId);
    if (!invoice) notFound();

    const payments = paymentsForInvoice(invoice.id);

    if (payments.length === 0) {
        return (
            <Card>
                <p className="text-sm text-slate-600">
                    Nothing has been received against {invoice.number} yet. Use{" "}
                    <span className="font-medium text-ink">Record payment</span> above when it arrives.
                </p>
            </Card>
        );
    }

    return (
        <Table columns={["Received", "Method", "Status", "Amount"]}>
            {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                        <RowLink href={`/payments/${payment.id}`}>{payment.receivedAt}</RowLink>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{payment.method.replace(/_/g, " ")}</td>
                    <td className="px-4 py-2.5">
                        <Badge value={payment.status} />
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-slate-900">{money(payment.amountCents)}</td>
                </tr>
            ))}
        </Table>
    );
}
