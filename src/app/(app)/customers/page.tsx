import type { Metadata } from "next";

import { CUSTOMERS, money } from "@/lib/data/fixtures";
import { Badge, PageHeader, RowLink, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Customers" };

/** Everyone who owes, or has owed, this workspace money. */
export default function CustomersPage() {
    return (
        <>
            <PageHeader title="Customers" description="Who you bill, and what they are worth." />

            <Table columns={["Customer", "Contact", "Country", "Status", "MRR", "Since"]}>
                {CUSTOMERS.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                            <RowLink href={`/customers/${customer.id}`}>{customer.name}</RowLink>
                            <span className="ml-2 text-xs text-slate-400">{customer.domain}</span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{customer.contact}</td>
                        <td className="px-4 py-2.5 text-slate-600">{customer.country}</td>
                        <td className="px-4 py-2.5">
                            <Badge value={customer.status} />
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-slate-900">
                            {customer.mrrCents ? money(customer.mrrCents) : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{customer.since}</td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
