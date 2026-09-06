import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { contactsForCustomer, customerById } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, Locked, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "Billing settings" };

/**
 * How this customer is billed. Gated on the role, like raising an invoice:
 * changing somebody's payment terms is a billing decision.
 */
export default async function CustomerSettingsPage({
    params,
    searchParams,
}: {
    params: Promise<{ customerId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { customerId } = await params;
    const customer = customerById(customerId);
    if (!customer) notFound();

    const session = await requireSession();
    if (session.role === "member") {
        return <Locked reason="Only owners and admins can change how a customer is billed." />;
    }

    const { done } = await searchParams;
    const base = `/customers/${customer.id}/settings`;
    const contacts = contactsForCustomer(customer.id);

    if (done) {
        return (
            <Done
                title="Billing settings saved"
                detail={`Future invoices for ${customer.name} will use them. Nothing is stored in this demonstration.`}
                back={{ href: `/customers/${customer.id}`, label: "Back to overview" }}
            />
        );
    }

    return (
        <Card>
            <DemoForm doneHref={`${base}?done=1`}>
                <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                    <Field label="Payment terms" htmlFor="terms">
                        <select id="terms" name="terms" defaultValue="Net 30" className={INPUT}>
                            <option>Net 30</option>
                            <option>Net 14</option>
                            <option>Due on receipt</option>
                        </select>
                    </Field>
                    <Field label="Currency" htmlFor="currency">
                        <select id="currency" name="currency" defaultValue="USD" className={INPUT}>
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                        </select>
                    </Field>
                </div>
                <Field label="Invoices go to" htmlFor="billing-contact">
                    <select id="billing-contact" name="billingContact" defaultValue={contacts.find((c) => c.primary)?.id} className={`${INPUT} max-w-sm`}>
                        {contacts.map((contact) => (
                            <option key={contact.id} value={contact.id}>
                                {contact.name} · {contact.email}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Purchase order" htmlFor="po" hint="Printed on every invoice when set.">
                    <input id="po" name="po" placeholder="PO-2026-0148" className={`${INPUT} max-w-sm`} />
                </Field>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="reminders" defaultChecked className="h-4 w-4 accent-sea" />
                    Send automatic reminders when an invoice goes overdue
                </label>
                <SubmitButton testId="save-billing-settings">Save settings</SubmitButton>
            </DemoForm>
        </Card>
    );
}
