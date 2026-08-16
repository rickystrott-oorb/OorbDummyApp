import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { money, INVOICES } from "@/lib/data/fixtures";
import { Card, Locked, PageHeader, Stat } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Forecasting" };

/**
 * The top plan's own screen.
 *
 * A different condition from the reports gate on purpose: this one names the
 * plan exactly rather than comparing rank, so anything reading this codebase
 * has two shapes of the same idea to tell apart.
 */
export default async function ForecastingPage() {
    const session = await requireSession();

    if (session.plan !== "scale") {
        return (
            <>
                <PageHeader title="Forecasting" />
                <Locked
                    reason="Forecasting is on the Scale plan. Modelled collections need the full payment history."
                    cta="See Scale"
                />
            </>
        );
    }

    const booked = INVOICES.filter((invoice) => invoice.status === "sent").reduce(
        (total, invoice) => total + invoice.totalCents,
        0
    );

    return (
        <>
            <PageHeader title="Forecasting" description="Modelled collections for the next two quarters." />

            <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Booked, unpaid" value={money(booked)} hint="Sent, not yet settled" />
                <Stat label="Expected Q3" value={money(booked * 2)} hint="At current collection rate" />
                <Stat label="Confidence" value="72%" hint="Six months of history" />
            </div>

            <Card>
                <h2 className="text-sm font-semibold text-ink">Assumptions</h2>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    <li>· Invoices settle 9 days after their due date on average.</li>
                    <li>· One failed card retries successfully 64% of the time.</li>
                    <li>· Trials convert at 31%, weighted by seat count.</li>
                </ul>
            </Card>
        </>
    );
}
