import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { CUSTOMERS } from "@/lib/data/fixtures";
import { Card, Locked, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "New invoice" };

/**
 * Drafting an invoice.
 *
 * Gated on the ROLE rather than the plan: a member can read the ledger and
 * cannot bill anyone against it. The form saves nothing — it exists so there
 * is something long enough to abandon halfway.
 */
export default async function NewInvoicePage() {
    const session = await requireSession();

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
            <PageHeader title="New invoice" description="Nothing is saved — this is a demonstration." />

            <Card>
                <form className="space-y-4">
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
                        Save draft
                    </button>
                </form>
            </Card>
        </>
    );
}
