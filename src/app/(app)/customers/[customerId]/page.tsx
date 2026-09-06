import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
    contactsForCustomer,
    customerById,
    invoicesForCustomer,
    money,
    notesForCustomer,
} from "@/lib/data/fixtures";
import { Badge, Card, Facts, RowLink } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Customer" };

/** The customer at a glance: who to talk to, what is open, what was said last. */
export default async function CustomerOverviewPage({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params;
    const customer = customerById(customerId);
    if (!customer) notFound();

    const primary = contactsForCustomer(customer.id).find((contact) => contact.primary);
    const open = invoicesForCustomer(customer.id).filter(
        (invoice) => invoice.status === "sent" || invoice.status === "overdue"
    );
    const latestNote = notesForCustomer(customer.id)[0];
    const base = `/customers/${customer.id}`;

    return (
        <>
            <Card>
                <Facts
                    items={[
                        {
                            label: "Billing contact",
                            value: primary ? (
                                <RowLink href={`${base}/contacts/${primary.id}`}>
                                    {primary.name} · {primary.role}
                                </RowLink>
                            ) : (
                                "—"
                            ),
                        },
                        {
                            label: "Open invoices",
                            value: open.length
                                ? open.map((invoice) => (
                                      <span key={invoice.id} className="mr-3 inline-flex items-center gap-1.5">
                                          <RowLink href={`/invoices/${invoice.id}`}>{invoice.number}</RowLink>
                                          <Badge value={invoice.status} />
                                          <span className="tabular-nums">{money(invoice.totalCents)}</span>
                                      </span>
                                  ))
                                : "None",
                        },
                        {
                            label: "Latest note",
                            value: latestNote ? `${latestNote.body} — ${latestNote.by}, ${latestNote.at}` : "No notes yet",
                        },
                        { label: "Reference", value: customer.id },
                    ]}
                />
            </Card>
        </>
    );
}
