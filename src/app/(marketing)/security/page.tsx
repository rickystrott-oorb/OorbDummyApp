import type { Metadata } from "next";

export const metadata: Metadata = { title: "Security" };

/** A static trust page — the sort of route every B2B product has. */
export default function SecurityPage() {
    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-ink">Security</h1>
            <p className="text-slate-600">
                Ledgerline is a demonstration application. It holds no real customer
                data and connects to no payment network.
            </p>
            <dl className="space-y-4">
                {[
                    { term: "Data at rest", detail: "Nothing is stored. Every figure on every screen is a fixture compiled into the application." },
                    { term: "Data in transit", detail: "Served over whatever the host provides. There is nothing here worth intercepting." },
                    { term: "Access", detail: "Sign in with any address. The role and plan you pick decide what the screens allow." },
                ].map((item) => (
                    <div key={item.term}>
                        <dt className="text-sm font-semibold text-ink">{item.term}</dt>
                        <dd className="text-sm text-slate-600">{item.detail}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
