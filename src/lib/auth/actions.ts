"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { findPersona } from "./personas";
import { SESSION_COOKIE, type Plan, type Role } from "./session";

/**
 * Sign in as anybody.
 *
 * Deliberately trusting: the point of this app is to have screens that gate,
 * not to have a real login. The form picks the role and plan so every gated
 * screen can be reached — and refused — on demand.
 */
export async function signInAction(formData: FormData): Promise<void> {
    const email = String(formData.get("email") ?? "").trim();
    const role = String(formData.get("role") ?? "member") as Role;
    const plan = String(formData.get("plan") ?? "free") as Plan;

    /**
     * A known persona brings its own name and id, so two people at the same
     * company are two people rather than two spellings of one. A typed-in
     * address still works — it just gets a name derived from the local part.
     */
    const persona = findPersona(email);

    const store = await cookies();
    store.set(
        SESSION_COOKIE,
        encodeURIComponent(
            JSON.stringify({
                userId: persona?.userId ?? "u_1",
                name: persona?.name ?? email.split("@")[0] ?? "Dana Whitfield",
                email: persona?.email ?? email ?? "dana@northwind.test",
                // A persona's own role and plan unless the form overrode them.
                role: (formData.get("role") ? role : (persona?.role ?? role)) as Role,
                plan: (formData.get("plan") ? plan : (persona?.plan ?? plan)) as Plan,
                subscriptionActive: true,
                // A multi-workspace persona lands in their first workspace.
                ...(persona?.accounts?.[0]
                    ? {
                          accountId: persona.accounts[0].id,
                          accountDomain: persona.accounts[0].domain,
                      }
                    : {}),
            })
        ),
        { httpOnly: true, sameSite: "lax", path: "/" }
    );

    redirect("/dashboard");
}

/**
 * Open a different customer workspace, staying the same person.
 *
 * Only a workspace the persona actually has: the id comes from a form, and
 * writing an arbitrary one into the cookie would let the page tell Oorb the
 * person is somewhere they are not. An unknown id is ignored rather than
 * refused with an error — this app has no error surface for it, and the
 * sidebar only ever offers real ones.
 */
export async function switchWorkspaceAction(formData: FormData): Promise<void> {
    const accountId = String(formData.get("accountId") ?? "");
    const store = await cookies();
    const raw = store.get(SESSION_COOKIE)?.value;
    if (!raw) redirect("/dashboard");

    let session: Record<string, unknown>;
    try {
        session = JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>;
    } catch {
        redirect("/dashboard");
    }

    const persona = findPersona(String(session.email ?? ""));
    const account = persona?.accounts?.find((candidate) => candidate.id === accountId);
    if (!account) redirect("/dashboard");

    store.set(
        SESSION_COOKIE,
        encodeURIComponent(
            JSON.stringify({ ...session, accountId: account.id, accountDomain: account.domain })
        ),
        { httpOnly: true, sameSite: "lax", path: "/" }
    );

    redirect("/dashboard");
}

/**
 * Drop the chosen persona.
 *
 * Not a logout: clearing the cookie returns you to the default owner, because
 * nobody is ever signed out of this app. It is "stop pretending to be a member"
 * rather than "leave".
 */
export async function signOutAction(): Promise<void> {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
    redirect("/dashboard");
}
