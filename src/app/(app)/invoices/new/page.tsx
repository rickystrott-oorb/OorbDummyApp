import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { CUSTOMERS } from "@/lib/data/fixtures";
import { createInvoiceAction } from "@/lib/data/invoice-actions";
import { Card, Locked, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "New invoice" };

/**
 * Drafting an invoice.
 *
 * Gated on the ROLE rather than the plan: a member can read the ledger and
 * cannot bill anyone against it. The form SAVES — into the in-memory store
 * in `fixtures.ts`, which lasts until the server restarts — so the
 * dashboard's Outstanding figure can be moved by hand. It is still long
 * enough to abandon halfway.
 */
export default async function NewInvoicePage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const session = await requireSession();
    const { error } = await searchParams;

    if (session.role === "member") {
        return (
            <>
                <PageHeader title="New invoice" />
                <Locked reason="Members can read invoices but cannot raise them. Ask an owner or an admin." />
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="New invoice"
                description="Saved in memory, so it counts on the dashboard until the server restarts."
            />

            <Card>
                <form action={createInvoiceAction} className="space-y-4">
                    {error && (
                        <p className="text-sm text-red-600">
                            That did not save. Choose a customer and enter an amount above zero.
                        </p>
                    )}
                    <div>
                        <label htmlFor="customer" className="block text-sm font-medium text-ink">
                            Customer
                        </label>
                        <select
                            id="customer"
                            name="customer"
                            className="mt-1 w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm"
                        >
                            {CUSTOMERS.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="issued" className="block text-sm font-medium text-ink">
                                Issue date
                            </label>
                            <input
                                id="issued"
                                name="issued"
                                type="date"
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="terms" className="block text-sm font-medium text-ink">
                                Payment terms
                            </label>
                            <select
                                id="terms"
                                name="terms"
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option>Net 30</option>
                                <option>Net 14</option>
                                <option>Due on receipt</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-ink">
                                Amount (USD)
                            </label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                min="0.01"
                                // The action's own ceiling, so the browser
                                // says so before the server has to.
                                max="1000000000000"
                                step="0.01"
                                required
                                placeholder="1500.00"
                                data-testid="invoice-amount"
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm tabular-nums"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-ink">
                                Status
                            </label>
                            {/* Anything but Paid counts as outstanding. */}
                            <select
                                id="status"
                                name="status"
                                defaultValue="sent"
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="sent">Sent</option>
                                <option value="draft">Draft</option>
                                <option value="overdue">Overdue</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-ink">
                            First line
                        </label>
                        <input
                            id="description"
                            name="description"
                            placeholder="Platform subscription — September"
                            className="mt-1 w-full max-w-lg rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-ink">
                            Notes to the customer
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            className="mt-1 w-full max-w-lg rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        data-testid="save-invoice"
                        className="rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
                    >
                        Save invoice
                    </button>
                </form>
            </Card>
        </>
    );
}
