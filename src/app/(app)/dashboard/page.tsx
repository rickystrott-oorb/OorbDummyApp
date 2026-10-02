import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { CUSTOMERS, INVOICES, PAYMENTS, money } from "@/lib/data/fixtures";
import { ButtonLink, Card, PageHeader, Stat } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Dashboard" };

/** Where everyone lands. The one screen with no gate beyond being signed in. */
export default async function DashboardPage() {
    const session = await requireSession();

    const unpaid = INVOICES.filter((invoice) => invoice.status !== "paid");
    const outstanding = unpaid.reduce((total, invoice) => total + invoice.totalCents, 0);
    const collected = PAYMENTS.filter((payment) => payment.status === "settled").reduce(
        (total, payment) => total + payment.amountCents,
        0
    );
    const overdue = INVOICES.filter((invoice) => invoice.status === "overdue").length;

    return (
        <>
            <PageHeader
                title={`Good morning, ${session.name}`}
                description="Where the money stands this month."
                action={
                    <div className="flex items-center gap-2">
                        <ButtonLink href="/invoices/new" tone="secondary" testId="dashboard-new-invoice">
                            New invoice
                        </ButtonLink>
                        <ExportButton label="Export summary" />
                    </div>
                }
            />

            <div className="grid gap-4 sm:grid-cols-4">
                <Stat label="Outstanding" value={money(outstanding)} hint={`Across ${unpaid.length} invoice${unpaid.length === 1 ? "" : "s"}`} />
                <Stat label="Collected" value={money(collected)} hint="Settled this month" />
                <Stat label="Overdue" value={String(overdue)} hint="Needs chasing" />
                <Stat label="Customers" value={String(CUSTOMERS.length)} hint="3 active" />
            </div>

            <Card>
                <h2 className="text-sm font-semibold text-ink">This week</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>· INV-2413 went overdue on 13 August — the card payment failed.</li>
                    <li>· Pellhaus Manufacturing&apos;s pilot ends in nine days.</li>
                    <li>· Two invoices are scheduled to send on the first.</li>
                </ul>
            </Card>
        </>
    );
}
