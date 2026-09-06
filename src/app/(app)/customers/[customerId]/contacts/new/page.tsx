import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { customerById } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "Add contact" };

/** A new person at the customer. */
export default async function NewContactPage({
    params,
    searchParams,
}: {
    params: Promise<{ customerId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { customerId } = await params;
    const customer = customerById(customerId);
    if (!customer) notFound();

    const { done } = await searchParams;
    const base = `/customers/${customer.id}/contacts`;

    if (done) {
        return (
            <Done
                title="Contact added"
                detail={`They now appear under ${customer.name}. Nothing is stored in this demonstration.`}
                back={{ href: base, label: "Back to contacts" }}
            />
        );
    }

    return (
        <Card>
            <DemoForm doneHref={`${base}/new?done=1`}>
                <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                    <Field label="Name" htmlFor="name">
                        <input id="name" name="name" placeholder="Full name" className={INPUT} />
                    </Field>
                    <Field label="Role" htmlFor="role">
                        <input id="role" name="role" placeholder="Accounts Payable" className={INPUT} />
                    </Field>
                    <Field label="Email" htmlFor="email">
                        <input id="email" name="email" type="email" placeholder={`name@${customer.domain}`} className={INPUT} />
                    </Field>
                    <Field label="Phone" htmlFor="phone">
                        <input id="phone" name="phone" type="tel" className={INPUT} />
                    </Field>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="primary" className="h-4 w-4 accent-sea" />
                    Send invoices to this person
                </label>
                <SubmitButton testId="save-contact">Add contact</SubmitButton>
            </DemoForm>
        </Card>
    );
}
