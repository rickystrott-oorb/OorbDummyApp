import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { Card, Locked, PageHeader, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Team" };

const TEAM = [
    { name: "Dana Whitfield", email: "dana@northwind.test", role: "owner", lastSeen: "today" },
    { name: "Ravi Chandra", email: "ravi@northwind.test", role: "admin", lastSeen: "yesterday" },
    { name: "Mei Lin", email: "mei@northwind.test", role: "member", lastSeen: "3 days ago" },
    { name: "Joss Kerrigan", email: "joss@northwind.test", role: "member", lastSeen: "2 weeks ago" },
];

/** Who else is in here. Members cannot see their colleagues' access levels. */
export default async function TeamPage() {
    const session = await requireSession();

    if (session.role === "member") {
        return (
            <>
                <PageHeader title="Team" />
                <Locked reason="Only owners and admins can see who has access to this workspace." />
            </>
        );
    }

    return (
        <>
            <PageHeader title="Team" description="Who can open this workspace, and as what." />

            <Table columns={["Name", "Email", "Role", "Last seen"]}>
                {TEAM.map((person) => (
                    <tr key={person.email}>
                        <td className="px-4 py-2.5 font-medium text-ink">{person.name}</td>
                        <td className="px-4 py-2.5 text-slate-600">{person.email}</td>
                        <td className="px-4 py-2.5 text-slate-600">{person.role}</td>
                        <td className="px-4 py-2.5 text-slate-600">{person.lastSeen}</td>
                    </tr>
                ))}
            </Table>

            <Card>
                <form className="flex flex-wrap items-end gap-3">
                    <div>
                        <label htmlFor="invite" className="block text-sm font-medium text-ink">
                            Invite by email
                        </label>
                        <input
                            id="invite"
                            name="invite"
                            type="email"
                            placeholder="colleague@northwind.test"
                            className="mt-1 w-64 rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        data-testid="send-invite"
                        className="rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
                    >
                        Send invite
                    </button>
                </form>
            </Card>
        </>
    );
}
