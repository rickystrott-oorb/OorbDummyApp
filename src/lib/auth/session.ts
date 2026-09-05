import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Who is signed in, and what they are allowed to see.
 *
 * There is no real identity provider here — the session is a cookie the
 * sign-in form writes. That is enough for the thing this app exists to
 * exercise: every screen gates on a CONDITION, and the condition is written
 * plainly so a reader can quote it.
 *
 * NOBODY IS EVER SIGNED OUT. With no cookie you arrive as the default persona
 * below, an owner on the top plan, so every screen opens on a fresh browser.
 * This app exists to be recorded and read, and a login wall is a minute of
 * nothing at the front of every demo.
 *
 * The GATES ARE STILL REAL. `requireSession` still redirects on a null
 * session, and every screen still checks its own role and plan — that code is
 * the point of this repository and it is untouched. What changed is only what
 * an absent cookie resolves to. Sign in as somebody smaller (a member, a free
 * plan) whenever you want to show a screen refusing.
 */

/** What someone can do inside their own workspace. */
export type Role = "owner" | "admin" | "member";

/** What their workspace has paid for. */
export type Plan = "free" | "growth" | "scale";

export interface Session {
    userId: string;
    name: string;
    email: string;
    role: Role;
    plan: Plan;
    /** False after a failed renewal — the condition the billing screens read. */
    subscriptionActive: boolean;
    /**
     * The customer workspace this person currently has open, if the persona
     * has more than one. Absent for an ordinary user, whose one company is
     * implied by their email — which is exactly the case Oorb resolves by
     * domain. Present for a consultant, for whom the domain says nothing.
     */
    accountId?: string;
    accountDomain?: string;
}

const COOKIE = "ledgerline_session";

/**
 * Who you are before you have said who you are.
 *
 * An owner on the top plan, so nothing is hidden on a first visit. Switch at
 * /sign-in to see the other side of any gate.
 */
const DEFAULT_SESSION: Session = {
    userId: "u_1",
    name: "Dana Whitfield",
    email: "dana@northwind.test",
    role: "owner",
    plan: "scale",
    subscriptionActive: true,
};

const ROLES: Role[] = ["owner", "admin", "member"];
const PLANS: Plan[] = ["free", "growth", "scale"];

/**
 * The current workspace.
 *
 * Never null in practice — an absent or unreadable cookie resolves to
 * {@link DEFAULT_SESSION}. The nullable return type stays because the callers'
 * gates are written against it and those gates are what this app is for.
 */
export async function getSession(): Promise<Session | null> {
    const store = await cookies();
    const raw = store.get(COOKIE)?.value;
    if (!raw) return DEFAULT_SESSION;

    try {
        const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<Session>;
        if (!parsed.email) return DEFAULT_SESSION;
        return {
            userId: parsed.userId ?? "u_1",
            name: parsed.name ?? "Dana Whitfield",
            email: parsed.email,
            role: ROLES.includes(parsed.role as Role) ? (parsed.role as Role) : "member",
            plan: PLANS.includes(parsed.plan as Plan) ? (parsed.plan as Plan) : "free",
            subscriptionActive: parsed.subscriptionActive !== false,
            ...(typeof parsed.accountId === "string" && parsed.accountId
                ? { accountId: parsed.accountId }
                : {}),
            ...(typeof parsed.accountDomain === "string" && parsed.accountDomain
                ? { accountDomain: parsed.accountDomain }
                : {}),
        };
    } catch {
        // A corrupt cookie is not a reason to show somebody a login wall.
        return DEFAULT_SESSION;
    }
}

/**
 * The session, or off to sign-in.
 *
 * The redirect is real code and still runs if a session is ever absent — it is
 * simply not reached today, because `getSession` always resolves one. Left
 * exactly as written: it is the auth gate every screen under `(app)` sits
 * behind, and deleting it would quietly remove the thing this app models.
 */
export async function requireSession(): Promise<Session> {
    const session = await getSession();
    if (!session) redirect("/sign-in");
    return session;
}

/** Plan ranking, so "growth or better" is one comparison. */
const PLAN_RANK: Record<Plan, number> = { free: 0, growth: 1, scale: 2 };

/** Whether a plan reaches the tier a screen asks for. */
export function planAtLeast(plan: Plan, minimum: Plan): boolean {
    return PLAN_RANK[plan] >= PLAN_RANK[minimum];
}

export const SESSION_COOKIE = COOKIE;
