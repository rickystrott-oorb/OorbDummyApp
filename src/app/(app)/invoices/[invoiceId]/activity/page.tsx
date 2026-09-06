import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { activityForInvoice, invoiceById } from "@/lib/data/fixtures";
import { Card } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Invoice activity" };

/** Everything that has happened to the invoice, oldest first. */
export default async function InvoiceActivityPage({
    params,
}: {
    params: Promise<{ invoiceId: string }>;
}) {
    const { invoiceId } = await params;
    const invoice = invoiceById(invoiceId);
    if (!invoice) notFound();

    const events = activityForInvoice(invoice.id);

    return (
        <Card>
            {events.length === 0 ? (
                <p className="text-sm text-slate-600">No activity recorded for {invoice.number}.</p>
            ) : (
                <ol className="space-y-3">
                    {events.map((event, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                            <span className="w-24 shrink-0 tabular-nums text-slate-500">{event.at}</span>
                            <span className="text-slate-700">
                                {event.what}
                                <span className="block text-xs text-slate-400">{event.who}</span>
                            </span>
                        </li>
                    ))}
                </ol>
            )}
        </Card>
    );
}
