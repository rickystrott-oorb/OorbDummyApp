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
    submitted: "bg-sky-50 text-sky-700",
    approved: "bg-emerald-50 text-emerald-700",
    reimbursed: "bg-emerald-50 text-emerald-700",
    schedule: "bg-slate-100 text-slate-600",
    manual: "bg-sky-50 text-sky-700",
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

/**
 * A link dressed as a button — the way into a flow from a record's header.
 *
 * A `<Link>`, so the tour follows a client-side navigation like any other, and
 * a real destination, so the one dead control in this app stays the only one.
 */
export function ButtonLink({
    href,
    children,
    tone = "primary",
    testId,
}: {
    href: string;
    children: React.ReactNode;
    tone?: "primary" | "secondary";
    testId?: string;
}) {
    const look =
        tone === "primary"
            ? "bg-sea text-white hover:bg-sea/90"
            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
    return (
        <Link
            href={href}
            data-testid={testId}
            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium ${look}`}
        >
            {children}
        </Link>
    );
}

/** The one input style, so every form in the app is the same form. */
export const INPUT = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

/** A labelled form control. */
export function Field({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string;
    htmlFor: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
                {label}
            </label>
            {children}
            {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
    );
}

/** The submit button every form ends on. */
export function SubmitButton({ children, testId }: { children: React.ReactNode; testId?: string }) {
    return (
        <button
            type="submit"
            data-testid={testId}
            className="rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
        >
            {children}
        </button>
    );
}

/**
 * Where a flow lands. Nothing was stored — there is nowhere to store it — but
 * the screen says the thing happened and offers the way back, because a form
 * that submits into silence is indistinguishable from the broken button.
 */
export function Done({
    title,
    detail,
    back,
}: {
    title: string;
    detail: string;
    back: { href: string; label: string };
}) {
    return (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
            <p className="text-base font-semibold text-emerald-800">{title}</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-emerald-700">{detail}</p>
            <Link
                href={back.href}
                data-testid="done-back"
                className="mt-4 inline-block rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
            >
                {back.label}
            </Link>
        </div>
    );
}

/** A definition list of facts about one record. */
export function Facts({ items }: { items: { label: string; value: React.ReactNode }[] }) {
    return (
        <dl className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
                <div key={item.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {item.label}
                    </dt>
                    <dd className="mt-1 text-sm text-slate-700">{item.value}</dd>
                </div>
            ))}
        </dl>
    );
}
