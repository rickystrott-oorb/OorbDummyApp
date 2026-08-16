import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { customerById, invoicesForCustomer, money } from "@/lib/data/fixtures";
import { Badge, PageHeader, RowLink, Stat, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Customer" };

/** One customer and every invoice raised against them. */
export default async function CustomerDetailPage({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params;
    const customer = customerById(customerId);
    if (!customer) notFound();

    const invoices = invoicesForCustomer(customer.id);
    const billed = invoices.reduce((total, invoice) => total + invoice.totalCents, 0);

    return (
        <>
            <PageHeader title={customer.name} description={`${customer.contact} · ${customer.domain}`} />

            <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="MRR" value={customer.mrrCents ? money(customer.mrrCents) : "—"} />
                <Stat label="Billed all time" value={money(billed)} />
                <Stat label="Customer since" value={customer.since} />
            </div>

            <Table columns={["Invoice", "Issued", "Status", "Total"]}>
                {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                            <RowLink href={`/invoices/${invoice.id}`}>{invoice.number}</RowLink>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{invoice.issued}</td>
                        <td className="px-4 py-2.5">
                            <Badge value={invoice.status} />
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-slate-900">
                            {money(invoice.totalCents)}
                        </td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
