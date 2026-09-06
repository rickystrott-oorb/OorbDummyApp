import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { contactsForCustomer, customerById } from "@/lib/data/fixtures";
import { ButtonLink, RowLink, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Contacts" };

/** The people at the customer, and which of them invoices go to. */
export default async function CustomerContactsPage({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params;
    const customer = customerById(customerId);
    if (!customer) notFound();

    const base = `/customers/${customer.id}/contacts`;

    return (
        <>
            <div className="flex justify-end">
                <ButtonLink href={`${base}/new`} testId="add-contact">
                    Add contact
                </ButtonLink>
            </div>
            <Table columns={["Name", "Role", "Email", "Phone", "Invoices"]}>
                {contactsForCustomer(customer.id).map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                            <RowLink href={`${base}/${contact.id}`}>{contact.name}</RowLink>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{contact.role}</td>
                        <td className="px-4 py-2.5 text-slate-600">{contact.email}</td>
                        <td className="px-4 py-2.5 text-slate-600">{contact.phone}</td>
                        <td className="px-4 py-2.5 text-slate-600">{contact.primary ? "Billing contact" : "—"}</td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
