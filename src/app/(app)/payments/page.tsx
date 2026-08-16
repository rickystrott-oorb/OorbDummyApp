import type { Metadata } from "next";

import { PAYMENTS, invoiceById, money } from "@/lib/data/fixtures";
import { Badge, PageHeader, RowLink, Table } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Payments" };

/** Money that has arrived, or tried to. */
export default function PaymentsPage() {
    return (
        <>
            <PageHeader
                title="Payments"
                description="Card, transfer and direct debit, matched to what they settle."
                action={<ExportButton />}
            />

            <Table columns={["Payment", "Invoice", "Method", "Received", "Status", "Amount"]}>
                {PAYMENTS.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                            <RowLink href={`/payments/${payment.id}`}>{payment.id}</RowLink>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">
                            {invoiceById(payment.invoiceId)?.number ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">
                            {payment.method.replace(/_/g, " ")}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{payment.receivedAt}</td>
                        <td className="px-4 py-2.5">
                            <Badge value={payment.status} />
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-slate-900">
                            {money(payment.amountCents)}
                        </td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
