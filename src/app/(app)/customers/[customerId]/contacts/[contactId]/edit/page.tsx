import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { contactById, customerById } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "Edit contact" };

/** Correcting a person's details. Saving confirms and returns to them. */
export default async function EditContactPage({
    params,
    searchParams,
}: {
    params: Promise<{ customerId: string; contactId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { customerId, contactId } = await params;
    const customer = customerById(customerId);
    const contact = contactById(contactId);
    if (!customer || !contact || contact.customerId !== customer.id) notFound();

    const { done } = await searchParams;
    const self = `/customers/${customer.id}/contacts/${contact.id}`;

    if (done) {
        return (
            <Done
                title="Contact saved"
                detail={`${contact.name}'s details were updated. Nothing is stored in this demonstration.`}
                back={{ href: self, label: `Back to ${contact.name}` }}
            />
        );
    }

    return (
        <Card>
            <DemoForm doneHref={`${self}/edit?done=1`}>
                <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                    <Field label="Name" htmlFor="name">
                        <input id="name" name="name" defaultValue={contact.name} className={INPUT} />
                    </Field>
                    <Field label="Role" htmlFor="role">
                        <input id="role" name="role" defaultValue={contact.role} className={INPUT} />
                    </Field>
                    <Field label="Email" htmlFor="email">
                        <input id="email" name="email" type="email" defaultValue={contact.email} className={INPUT} />
                    </Field>
                    <Field label="Phone" htmlFor="phone">
                        <input id="phone" name="phone" type="tel" defaultValue={contact.phone} className={INPUT} />
                    </Field>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="primary" defaultChecked={contact.primary} className="h-4 w-4 accent-sea" />
                    Send invoices to this person
                </label>
                <SubmitButton testId="save-contact">Save changes</SubmitButton>
            </DemoForm>
        </Card>
    );
}
