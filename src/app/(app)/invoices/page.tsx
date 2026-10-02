import type { Metadata } from "next";

import { INVOICES, customerById, money } from "@/lib/data/fixtures";
import { Badge, PageHeader, RowLink, Table } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Invoices" };

/** The list reads the in-memory store, which the New invoice form appends to. */
export const dynamic = "force-dynamic";

/**
 * Every invoice. Note this file contains no href of its own — the link to a
 * row's detail page is inside `RowLink`, which is how most list screens are
 * actually written.
 */
export default function InvoicesPage() {
    return (
        <>
            <PageHeader
                title="Invoices"
                description="Everything issued, and what it is waiting on."
                action={<ExportButton />}
            />

            <Table columns={["Invoice", "Customer", "Issued", "Due", "Status", "Total"]}>
                {INVOICES.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                            <RowLink href={`/invoices/${invoice.id}`}>{invoice.number}</RowLink>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">
                            {customerById(invoice.customerId)?.name ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{invoice.issued}</td>
                        <td className="px-4 py-2.5 text-slate-600">{invoice.due}</td>
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
