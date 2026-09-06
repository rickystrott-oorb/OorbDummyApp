import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { activityForInvoice, contactById, customerById, invoicesForCustomer } from "@/lib/data/fixtures";
import { ButtonLink, Card, Facts } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Contact" };

/**
 * One person at the customer. Three clicks in — Customers → the customer →
 * Contacts → the name — with Edit a fourth.
 */
export default async function ContactDetailPage({
    params,
}: {
    params: Promise<{ customerId: string; contactId: string }>;
}) {
    const { customerId, contactId } = await params;
    const customer = customerById(customerId);
    const contact = contactById(contactId);
    if (!customer || !contact || contact.customerId !== customer.id) notFound();

    // What this person has actually done with an invoice: the activity log
    // names who opened one.
    const seen = invoicesForCustomer(customer.id).filter((invoice) =>
        activityForInvoice(invoice.id).some((event) => event.who === contact.name)
    );

    return (
        <Card>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-ink">{contact.name}</h2>
                    <p className="text-sm text-slate-600">{contact.role}</p>
                </div>
                <ButtonLink href={`/customers/${customer.id}/contacts/${contact.id}/edit`} tone="secondary" testId="edit-contact">
                    Edit
                </ButtonLink>
            </div>
            <div className="mt-5">
                <Facts
                    items={[
                        { label: "Email", value: contact.email },
                        { label: "Phone", value: contact.phone },
                        { label: "Invoices", value: contact.primary ? "Receives every invoice" : "Not on the invoice email" },
                        {
                            label: "Opened invoices",
                            value: seen.length ? seen.map((invoice) => invoice.number).join(", ") : "None recorded",
                        },
                    ]}
                />
            </div>
        </Card>
    );
}
