import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing" };

const TIERS = [
    { name: "Free", price: "$0", blurb: "One user, ten invoices a month.", features: ["Invoices", "Payments", "Receivables aging"] },
    { name: "Growth", price: "$79", blurb: "For a finance team of a few.", features: ["Everything in Free", "Revenue cohorts", "Churn drivers", "API keys"] },
    { name: "Scale", price: "$249", blurb: "For a finance function.", features: ["Everything in Growth", "Cash forecast", "Forecasting workspace", "Priority support"] },
];

/** What each plan unlocks — the screens that gate say "upgrade" and land here. */
export default function PricingPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-ink">Pricing</h1>
                <p className="mt-1 text-slate-600">Every plan includes unlimited customers.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {TIERS.map((tier) => (
                    <div key={tier.name} className="rounded-xl border border-slate-200 bg-white p-5">
                        <h2 className="text-sm font-semibold text-ink">{tier.name}</h2>
                        <p className="mt-2 text-3xl font-bold tabular-nums text-ink">
                            {tier.price}
                            <span className="text-sm font-normal text-slate-500">/mo</span>
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{tier.blurb}</p>
                        <ul className="mt-4 space-y-1 text-sm text-slate-600">
                            {tier.features.map((feature) => (
                                <li key={feature}>· {feature}</li>
                            ))}
                        </ul>
                        <Link
                            href="/sign-up"
                            className="mt-5 block rounded-md bg-sea px-4 py-2 text-center text-sm font-medium text-white hover:bg-sea/90"
                        >
                            Choose {tier.name}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
