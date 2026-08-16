import type { Metadata } from "next";

import { planAtLeast, requireSession } from "@/lib/auth/session";
import { Card, Locked, PageHeader, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "API keys" };

const KEYS = [
    { id: "k_live", label: "Production", prefix: "lk_live_9f2a…", created: "2025-11-04", lastUsed: "2 hours ago" },
    { id: "k_test", label: "Sandbox", prefix: "lk_test_41c8…", created: "2025-11-04", lastUsed: "never" },
];

/**
 * Programmatic access.
 *
 * Gated on BOTH plan and role — the only screen in the app that needs two
 * conditions to pass, and the one worth reading carefully.
 */
export default async function ApiKeysPage() {
    const session = await requireSession();

    if (!planAtLeast(session.plan, "growth")) {
        return (
            <>
                <PageHeader title="API keys" />
                <Locked
                    reason="The API is available from the Growth plan upward."
                    cta="Compare plans"
                />
            </>
        );
    }

    if (session.role === "member") {
        return (
            <>
                <PageHeader title="API keys" />
                <Locked reason="Keys are managed by owners and admins. A leaked key can read every invoice." />
            </>
        );
    }

    return (
        <>
            <PageHeader title="API keys" description="Never shown in full after they are created." />

            <Table columns={["Label", "Key", "Created", "Last used"]}>
                {KEYS.map((key) => (
                    <tr key={key.id}>
                        <td className="px-4 py-2.5 font-medium text-ink">{key.label}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-slate-600">{key.prefix}</td>
                        <td className="px-4 py-2.5 text-slate-600">{key.created}</td>
                        <td className="px-4 py-2.5 text-slate-600">{key.lastUsed}</td>
                    </tr>
                ))}
            </Table>

            <Card>
                <button
                    type="button"
                    data-testid="create-key"
                    className="rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
                >
                    Create a key
                </button>
            </Card>
        </>
    );
}
