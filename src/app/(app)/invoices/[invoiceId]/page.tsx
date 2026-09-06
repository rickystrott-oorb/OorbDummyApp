import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
    activityForInvoice,
    contactsForCustomer,
    invoiceById,
    money,
    paymentsForInvoice,
} from "@/lib/data/fixtures";
import { Card, Facts, Stat } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Invoice" };

/** Where the invoice stands: what is owed, what has arrived, who it went to. */
export default async function InvoiceOverviewPage({
    params,
}: {
    params: Promise<{ invoiceId: string }>;
}) {
    const { invoiceId } = await params;
    const invoice = invoiceById(invoiceId);
    if (!invoice) notFound();

    const settled = paymentsForInvoice(invoice.id)
        .filter((payment) => payment.status === "settled")
        .reduce((total, payment) => total + payment.amountCents, 0);
    const primary = contactsForCustomer(invoice.customerId).find((contact) => contact.primary);
    const latest = activityForInvoice(invoice.id).at(-1);

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Total" value={money(invoice.totalCents)} />
                <Stat label="Received" value={money(settled)} />
                <Stat
                    label="Outstanding"
                    value={money(Math.max(invoice.totalCents - settled, 0))}
                    hint={invoice.status === "overdue" ? "Past due" : undefined}
                />
            </div>

            <Card>
                <Facts
                    items={[
                        { label: "Billed to", value: primary ? `${primary.name} · ${primary.email}` : "—" },
                        { label: "Lines", value: `${invoice.lines.length}` },
                        { label: "Last activity", value: latest ? `${latest.what} · ${latest.at}` : "Nothing yet" },
                        { label: "Reference", value: invoice.id },
                    ]}
                />
            </Card>
        </>
    );
}
