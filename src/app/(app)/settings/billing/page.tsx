import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { Card, Locked, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Billing" };

/**
 * What this workspace pays.
 *
 * Two conditions, checked in order: a member never sees billing at all, and
 * everyone else sees a warning first when the subscription has lapsed.
 */
export default async function BillingPage() {
    const session = await requireSession();

    if (session.role === "member") {
        return (
            <>
                <PageHeader title="Billing" />
                <Locked reason="Billing is visible to owners and admins only." />
            </>
        );
    }

    return (
        <>
            <PageHeader title="Billing" description="Your plan, and what it costs." />

            {!session.subscriptionActive && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    The last renewal did not go through. Reports and forecasting are
                    paused until a payment succeeds.
                </p>
            )}

            <Card>
                <dl className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plan</dt>
                        <dd className="mt-1 text-sm text-slate-700">{session.plan}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Renews</dt>
                        <dd className="mt-1 text-sm text-slate-700">1 September 2026</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment method</dt>
                        <dd className="mt-1 text-sm text-slate-700">Visa ending 4417</dd>
                    </div>
                </dl>
            </Card>
        </>
    );
}
