import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Who is signed in, and what they are allowed to see.
 *
 * There is no real identity provider here — the session is a cookie the
 * sign-in form writes. That is enough for the thing this app exists to
 * exercise: every screen gates on a CONDITION, and the condition is written
 * plainly so a reader can quote it.
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
}

const COOKIE = "ledgerline_session";

const ROLES: Role[] = ["owner", "admin", "member"];
const PLANS: Plan[] = ["free", "growth", "scale"];

/** The signed-in workspace, or null. */
export async function getSession(): Promise<Session | null> {
    const store = await cookies();
    const raw = store.get(COOKIE)?.value;
    if (!raw) return null;

    try {
        const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<Session>;
        if (!parsed.email) return null;
        return {
            userId: parsed.userId ?? "u_1",
            name: parsed.name ?? "Dana Whitfield",
            email: parsed.email,
            role: ROLES.includes(parsed.role as Role) ? (parsed.role as Role) : "member",
            plan: PLANS.includes(parsed.plan as Plan) ? (parsed.plan as Plan) : "free",
            subscriptionActive: parsed.subscriptionActive !== false,
        };
    } catch {
        return null;
    }
}

/** The session, or off to sign-in. Every screen inside `(app)` calls this. */
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
