import { notFound } from "next/navigation";

import { customerById, invoiceById } from "@/lib/data/fixtures";
import { Badge, ButtonLink, PageHeader, RowLink } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";
import { RecordTabs } from "@/components/nav/record-tabs";

/**
 * One invoice, and everything you can do to it.
 *
 * The header and the tabs live here so the four screens under it — lines,
 * payments, activity, and the overview — share one frame and hold only their
 * own content. The two flows (record a payment, send a reminder) start from
 * this header on every tab, because the moment somebody wants them is rarely
 * the moment they are on the right tab.
 */
export default async function InvoiceLayout({
    params,
    children,
}: {
    params: Promise<{ invoiceId: string }>;
    children: React.ReactNode;
}) {
    const { invoiceId } = await params;
    const invoice = invoiceById(invoiceId);
    if (!invoice) notFound();

    const customer = customerById(invoice.customerId);
    const base = `/invoices/${invoice.id}`;

    return (
        <>
            <PageHeader
                title={invoice.number}
                description={`Issued ${invoice.issued} · due ${invoice.due}`}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        {invoice.status !== "paid" && invoice.status !== "draft" && (
                            <ButtonLink href={`${base}/remind`} tone="secondary" testId="send-reminder">
                                Send reminder
                            </ButtonLink>
                        )}
                        {invoice.status !== "paid" && (
                            <ButtonLink href={`${base}/record-payment`} testId="record-payment">
                                Record payment
                            </ButtonLink>
                        )}
                        <ExportButton label="Export PDF" />
                    </div>
                }
            />

            <div className="flex flex-wrap items-center gap-3">
                <Badge value={invoice.status} />
                {customer && <RowLink href={`/customers/${customer.id}`}>{customer.name}</RowLink>}
            </div>

            <RecordTabs
                base={base}
                items={[
                    { href: base, label: "Overview" },
                    { href: `${base}/lines`, label: "Lines" },
                    { href: `${base}/payments`, label: "Payments" },
                    { href: `${base}/activity`, label: "Activity" },
                ]}
            />

            {children}
        </>
    );
}
