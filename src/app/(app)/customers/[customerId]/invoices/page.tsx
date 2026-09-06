import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { customerById, invoicesForCustomer, money } from "@/lib/data/fixtures";
import { Badge, RowLink, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Customer invoices" };

/** Every invoice raised against this customer. */
export default async function CustomerInvoicesPage({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params;
    const customer = customerById(customerId);
    if (!customer) notFound();

    return (
        <Table columns={["Invoice", "Issued", "Due", "Status", "Total"]}>
            {invoicesForCustomer(customer.id).map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                        <RowLink href={`/invoices/${invoice.id}`}>{invoice.number}</RowLink>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{invoice.issued}</td>
                    <td className="px-4 py-2.5 text-slate-600">{invoice.due}</td>
                    <td className="px-4 py-2.5">
                        <Badge value={invoice.status} />
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-slate-900">{money(invoice.totalCents)}</td>
                </tr>
            ))}
        </Table>
    );
}
