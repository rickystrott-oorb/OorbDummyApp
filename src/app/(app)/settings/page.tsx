import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { Card, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Settings" };

/** What this workspace is, at a glance. */
export default async function SettingsPage() {
    const session = await requireSession();

    return (
        <>
            <PageHeader title="Settings" description="Your workspace and how it behaves." />

            <Card>
                <dl className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed in as</dt>
                        <dd className="mt-1 text-sm text-slate-700">{session.email}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</dt>
                        <dd className="mt-1 text-sm text-slate-700">{session.role}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plan</dt>
                        <dd className="mt-1 text-sm text-slate-700">{session.plan}</dd>
                    </div>
                </dl>
            </Card>
        </>
    );
}
