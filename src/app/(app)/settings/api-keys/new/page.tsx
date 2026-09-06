import type { Metadata } from "next";

import { planAtLeast, requireSession } from "@/lib/auth/session";
import { Locked, PageHeader } from "@/components/ui/primitives";

import { CreateKeyWizard } from "./create-key-wizard";

export const metadata: Metadata = { title: "Create a key" };

/**
 * Minting a key, in three steps on one screen.
 *
 * Same two gates as the list — plan AND role — repeated here because this is
 * the screen that does the thing, and the list only shows the way to it.
 */
export default async function NewApiKeyPage() {
    const session = await requireSession();

    if (!planAtLeast(session.plan, "growth")) {
        return (
            <>
                <PageHeader title="Create a key" />
                <Locked reason="The API is available from the Growth plan upward." cta="Compare plans" />
            </>
        );
    }

    if (session.role === "member") {
        return (
            <>
                <PageHeader title="Create a key" />
                <Locked reason="Keys are managed by owners and admins. A leaked key can read every invoice." />
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Create a key"
                description="Name it, choose what it may do, then copy it — it is shown once."
            />
            <CreateKeyWizard />
        </>
    );
}
