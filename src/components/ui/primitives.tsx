import Link from "next/link";

/** Page heading plus optional supporting line. Every screen starts with one. */
export function PageHeader({
    title,
    description,
    action,
}: {
    title: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
                {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
            </div>
            {action}
        </div>
    );
}

export function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {children}
        </div>
    );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</p>
            {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
        </div>
    );
}

const TONES: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-700",
    settled: "bg-emerald-50 text-emerald-700",
    active: "bg-emerald-50 text-emerald-700",
    sent: "bg-sky-50 text-sky-700",
    pending: "bg-amber-50 text-amber-700",
    trial: "bg-amber-50 text-amber-700",
    draft: "bg-slate-100 text-slate-600",
    overdue: "bg-red-50 text-red-700",
    failed: "bg-red-50 text-red-700",
    churned: "bg-slate-100 text-slate-500",
};

export function Badge({ value }: { value: string }) {
    return (
        <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TONES[value] ?? "bg-slate-100 text-slate-600"}`}
        >
            {value.replace(/_/g, " ")}
        </span>
    );
}

/**
 * A row that links to its own detail page.
 *
 * The `<Link>` lives HERE rather than in the list page, which is the usual
 * shape and the reason a list route file contains no href of its own.
 */
export function RowLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="font-medium text-sea hover:underline">
            {children}
        </Link>
    );
}

export function Table({
    columns,
    children,
}: {
    columns: string[];
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
                <thead className="border-b border-slate-100 bg-slate-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column}
                                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">{children}</tbody>
            </table>
        </div>
    );
}

/** Shown where a plan or a role stops somebody. Never a blank screen. */
export function Locked({ reason, cta }: { reason: string; cta?: string }) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="text-sm font-medium text-ink">Not available on this workspace</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">{reason}</p>
            {cta && (
                <Link
                    href="/pricing"
                    className="mt-4 inline-block rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
                >
                    {cta}
                </Link>
            )}
        </div>
    );
}
