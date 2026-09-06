import { notFound } from "next/navigation";

import { customerById, invoicesForCustomer, money } from "@/lib/data/fixtures";
import { Badge, ButtonLink, PageHeader, Stat } from "@/components/ui/primitives";
import { RecordTabs } from "@/components/nav/record-tabs";

/**
 * One customer — the frame every screen about them shares.
 *
 * Header, the three numbers somebody always wants, and the tabs. The pages
 * underneath hold only their own content, so "Contacts" is a table and
 * nothing else.
 */
export default async function CustomerLayout({
    params,
    children,
}: {
    params: Promise<{ customerId: string }>;
    children: React.ReactNode;
}) {
    const { customerId } = await params;
    const customer = customerById(customerId);
    if (!customer) notFound();

    const invoices = invoicesForCustomer(customer.id);
    const billed = invoices.reduce((total, invoice) => total + invoice.totalCents, 0);
    const base = `/customers/${customer.id}`;

    return (
        <>
            <PageHeader
                title={customer.name}
                description={`${customer.contact} · ${customer.domain} · ${customer.country}`}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge value={customer.status} />
                        <ButtonLink href="/invoices/new" tone="secondary">
                            New invoice
                        </ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="MRR" value={customer.mrrCents ? money(customer.mrrCents) : "—"} />
                <Stat label="Billed all time" value={money(billed)} />
                <Stat label="Customer since" value={customer.since} />
            </div>

            <RecordTabs
                base={base}
                items={[
                    { href: base, label: "Overview" },
                    { href: `${base}/invoices`, label: "Invoices" },
                    { href: `${base}/contacts`, label: "Contacts" },
                    { href: `${base}/notes`, label: "Notes" },
                    { href: `${base}/settings`, label: "Billing settings" },
                ]}
            />

            {children}
        </>
    );
}
