"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

    const store = await cookies();
    store.set(
        SESSION_COOKIE,
        encodeURIComponent(
            JSON.stringify({
                userId: "u_1",
                name: email.split("@")[0] || "Dana Whitfield",
                email: email || "dana@northwind.test",
                role,
                plan,
                subscriptionActive: true,
            })
        ),
        { httpOnly: true, sameSite: "lax", path: "/" }
    );

    redirect("/dashboard");
}

/** Sign out and land back on the marketing page. */
export async function signOutAction(): Promise<void> {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
    redirect("/");
}
