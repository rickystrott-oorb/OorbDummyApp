import type { Metadata } from "next";

import { planAtLeast, requireSession } from "@/lib/auth/session";
import { API_KEYS } from "@/lib/data/fixtures";
import { ButtonLink, Locked, PageHeader, RowLink, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "API keys" };

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
            <PageHeader
                title="API keys"
                description="Never shown in full after they are created."
                action={
                    <ButtonLink href="/settings/api-keys/new" testId="create-key">
                        Create a key
                    </ButtonLink>
                }
            />

            <Table columns={["Label", "Key", "Created", "Last used"]}>
                {API_KEYS.map((key) => (
                    <tr key={key.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                            <RowLink href={`/settings/api-keys/${key.id}`}>{key.label}</RowLink>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-slate-600">{key.prefix}</td>
                        <td className="px-4 py-2.5 text-slate-600">{key.created}</td>
                        <td className="px-4 py-2.5 text-slate-600">{key.lastUsed}</td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
