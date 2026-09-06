import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { contactsForCustomer, customerById, invoiceById, money } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "Send reminder" };

/** Chasing an invoice: pick who at the customer hears about it, and say what. */
export default async function RemindPage({
    params,
    searchParams,
}: {
    params: Promise<{ invoiceId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { invoiceId } = await params;
    const invoice = invoiceById(invoiceId);
    if (!invoice) notFound();

    const customer = customerById(invoice.customerId);
    const contacts = contactsForCustomer(invoice.customerId);
    const { done } = await searchParams;
    const base = `/invoices/${invoice.id}`;

    if (done) {
        return (
            <Done
                title="Reminder sent"
                detail={`${customer?.name ?? "The customer"} will hear about ${invoice.number} shortly. Nothing is sent in this demonstration.`}
                back={{ href: `${base}/activity`, label: "See activity" }}
            />
        );
    }

    return (
        <Card>
            <DemoForm doneHref={`${base}/remind?done=1`}>
                <Field label="Send to" htmlFor="recipient">
                    <select id="recipient" name="recipient" className={`${INPUT} max-w-sm`}>
                        {contacts.map((contact) => (
                            <option key={contact.id} value={contact.id}>
                                {contact.name} · {contact.email}
                                {contact.primary ? " (billing contact)" : ""}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Tone" htmlFor="tone">
                    <select id="tone" name="tone" className={`${INPUT} max-w-sm`}>
                        <option>Friendly nudge</option>
                        <option>Second reminder</option>
                        <option>Final notice</option>
                    </select>
                </Field>
                <Field label="Message" htmlFor="message">
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        defaultValue={`Hi — a quick note that ${invoice.number} for ${money(invoice.totalCents)} was due on ${invoice.due}. Could you let us know when we can expect it?`}
                        className={`${INPUT} max-w-lg`}
                    />
                </Field>
                <SubmitButton testId="confirm-reminder">Send reminder</SubmitButton>
            </DemoForm>
        </Card>
    );
}
