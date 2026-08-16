import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { Card, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Profile" };

/** Your own details. The one settings screen nobody is ever refused. */
export default async function ProfilePage() {
    const session = await requireSession();

    return (
        <>
            <PageHeader title="Profile" description="How you appear to the rest of the workspace." />

            <Card>
                <form className="max-w-md space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-ink">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            defaultValue={session.name}
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-ink">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={session.email}
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-ink">
                            Time zone
                        </label>
                        <select
                            id="timezone"
                            name="timezone"
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option>Europe/London</option>
                            <option>America/New_York</option>
                            <option>Australia/Sydney</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        data-testid="save-profile"
                        className="rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
                    >
                        Save changes
                    </button>
                </form>
            </Card>
        </>
    );
}
