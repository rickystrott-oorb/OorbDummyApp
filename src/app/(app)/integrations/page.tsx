import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { Card, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Integrations" };

const INTEGRATIONS = [
    { name: "Stripe", blurb: "Pull card settlements as they clear.", connected: true },
    { name: "Xero", blurb: "Push invoices into the ledger nightly.", connected: true },
    { name: "Slack", blurb: "Post to a channel when an invoice goes overdue.", connected: false },
    { name: "HubSpot", blurb: "Match customers to the deal that created them.", connected: false },
];

/**
 * What this workspace is wired into.
 *
 * Connecting is admin work — a member sees the same list with the buttons
 * disabled, which is more useful than hiding the screen: knowing Slack is
 * available is what makes somebody go and ask for it.
 */
export default async function IntegrationsPage() {
    const session = await requireSession();
    const canConnect = session.role !== "member";

    return (
        <>
            <PageHeader title="Integrations" description="Where Ledgerline sends and fetches data." />

            <div className="grid gap-4 sm:grid-cols-2">
                {INTEGRATIONS.map((integration) => (
                    <Card key={integration.name}>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-ink">{integration.name}</h2>
                                <p className="mt-1 text-sm text-slate-600">{integration.blurb}</p>
                            </div>
                            <button
                                type="button"
                                disabled={!canConnect}
                                data-testid={`connect-${integration.name.toLowerCase()}`}
                                className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {integration.connected ? "Disconnect" : "Connect"}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {!canConnect && (
                <p className="text-sm text-slate-500">
                    Members can see integrations but cannot change them.
                </p>
            )}
        </>
    );
}
