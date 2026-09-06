import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { planAtLeast, requireSession } from "@/lib/auth/session";
import { API_SCOPES, apiKeyById } from "@/lib/data/fixtures";
import { Card, Done, Facts, Locked, PageHeader, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "API key" };

/**
 * One key: what it may do, and the way to take it away. Revoking is the
 * whole form — there is nothing to fill in, only a button that means it.
 */
export default async function ApiKeyDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ keyId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { keyId } = await params;
    const key = apiKeyById(keyId);
    if (!key) notFound();

    const session = await requireSession();

    if (!planAtLeast(session.plan, "growth")) {
        return (
            <>
                <PageHeader title={key.label} />
                <Locked reason="The API is available from the Growth plan upward." cta="Compare plans" />
            </>
        );
    }

    if (session.role === "member") {
        return (
            <>
                <PageHeader title={key.label} />
                <Locked reason="Keys are managed by owners and admins. A leaked key can read every invoice." />
            </>
        );
    }

    const { done } = await searchParams;

    if (done) {
        return (
            <>
                <PageHeader title={key.label} />
                <Done
                    title="Key revoked"
                    detail={`Anything still using ${key.prefix} will be refused from now on. Nothing is stored in this demonstration.`}
                    back={{ href: "/settings/api-keys", label: "Back to API keys" }}
                />
            </>
        );
    }

    return (
        <>
            <PageHeader title={key.label} description={`Created ${key.created} · last used ${key.lastUsed}`} />
            <Card>
                <Facts
                    items={[
                        { label: "Key", value: <span className="font-mono text-xs">{key.prefix}</span> },
                        {
                            label: "May",
                            value: API_SCOPES.filter((scope) => key.scopes.includes(scope.id))
                                .map((scope) => scope.label.toLowerCase())
                                .join(", "),
                        },
                    ]}
                />
            </Card>
            <Card>
                <DemoForm doneHref={`/settings/api-keys/${key.id}?done=1`}>
                    <p className="text-sm text-slate-700">
                        Revoking stops every integration holding this key immediately. There is no undo — create a new key instead.
                    </p>
                    <SubmitButton testId="revoke-key">Revoke {key.label}</SubmitButton>
                </DemoForm>
            </Card>
        </>
    );
}
