import type { Metadata } from "next";

import { CUSTOMERS, money } from "@/lib/data/fixtures";
import { Badge, PageHeader, RowLink, Table } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Accounts" };

/** Every customer with the numbers only an owner sees. */
export default function AdminAccountsPage() {
    return (
        <>
            <PageHeader
                title="Accounts"
                description="Every customer, with lifetime value."
                action={<ExportButton />}
            />

            <Table columns={["Customer", "Status", "MRR", "Annualised", "Since"]}>
                {CUSTOMERS.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                            <RowLink href={`/customers/${customer.id}`}>{customer.name}</RowLink>
                        </td>
                        <td className="px-4 py-2.5">
                            <Badge value={customer.status} />
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-slate-900">
                            {customer.mrrCents ? money(customer.mrrCents) : "—"}
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-slate-900">
                            {customer.mrrCents ? money(customer.mrrCents * 12) : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{customer.since}</td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
