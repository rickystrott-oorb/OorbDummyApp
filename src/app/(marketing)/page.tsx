import Link from "next/link";

/** The landing page. Reachable by anyone, signed in or not. */
export default function HomePage() {
    return (
        <div className="space-y-12">
            <section className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-ink">
                    Get paid without chasing.
                </h1>
                <p className="max-w-xl text-lg text-slate-600">
                    Ledgerline turns your invoices, payments and expenses into one
                    running picture of the cash your business is owed.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                        href="/sign-up"
                        className="rounded-md bg-sea px-5 py-2.5 text-sm font-medium text-white hover:bg-sea/90"
                    >
                        Start free
                    </Link>
                    <Link
                        href="/pricing"
                        className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        See pricing
                    </Link>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
                {[
                    { title: "Invoices that send themselves", body: "Schedule a run and let it go out on the first of the month." },
                    { title: "Payments reconciled", body: "Card, transfer and direct debit, matched to the invoice they settle." },
                    { title: "Cash you can see", body: "Aging, cohorts and a forecast that updates as money lands." },
                ].map((feature) => (
                    <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-ink">{feature.title}</h2>
                        <p className="mt-1 text-sm text-slate-600">{feature.body}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
