import type { Metadata } from "next";

import { Card, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Notifications" };

const ALERTS = [
    { id: "overdue", label: "An invoice goes overdue", detail: "The morning after the due date passes." },
    { id: "failed", label: "A payment fails", detail: "Immediately, with the decline reason." },
    { id: "trial", label: "A trial is ending", detail: "Seven days before it expires." },
    { id: "digest", label: "Weekly cash digest", detail: "Monday at 8am in your time zone." },
];

/** Checkbox-heavy settings screen — a form with nothing to submit. */
export default function NotificationsPage() {
    return (
        <>
            <PageHeader title="Notifications" description="What Ledgerline tells you about, and when." />

            <Card>
                <form className="space-y-4">
                    {ALERTS.map((alert) => (
                        <label key={alert.id} className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name={alert.id}
                                defaultChecked={alert.id !== "digest"}
                                className="mt-0.5 h-4 w-4 accent-sea"
                            />
                            <span>
                                <span className="block text-sm font-medium text-ink">{alert.label}</span>
                                <span className="block text-sm text-slate-600">{alert.detail}</span>
                            </span>
                        </label>
                    ))}
                    <button
                        type="submit"
                        data-testid="save-notifications"
                        className="rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
                    >
                        Save preferences
                    </button>
                </form>
            </Card>
        </>
    );
}
