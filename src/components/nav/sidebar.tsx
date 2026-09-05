import Link from "next/link";

import { planAtLeast, type Session } from "@/lib/auth/session";
import { findPersona } from "@/lib/auth/personas";
import { switchWorkspaceAction } from "@/lib/auth/actions";

import { APP_NAV } from "./nav-items";

/**
 * The signed-in chrome.
 *
 * Filters the nav table against the viewer's role and plan, so what somebody
 * sees in the sidebar matches what they can actually open. Each screen still
 * re-checks: the sidebar is a courtesy, not a boundary.
 */
export function Sidebar({ session }: { session: Session }) {
    return (
        <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sea text-sm font-bold text-white">
                        L
                    </span>
                    <span className="text-sm font-semibold text-ink">Ledgerline</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
                {APP_NAV.map((section) => {
                    const visible = section.items.filter(
                        (item) =>
                            (!item.roles || item.roles.includes(session.role)) &&
                            (!item.minimumPlan || planAtLeast(session.plan, item.minimumPlan))
                    );
                    if (visible.length === 0) return null;

                    return (
                        <div key={section.heading}>
                            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                {section.heading}
                            </p>
                            <ul className="space-y-0.5">
                                {visible.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            data-testid={`nav-${item.label.toLowerCase()}`}
                                            className="block rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-ink"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </nav>

            <div className="border-t border-slate-100 px-3 py-3">
                <p className="px-2 text-sm font-medium text-ink">{session.name}</p>
                <p className="px-2 text-xs text-slate-500">
                    {session.role} · {session.plan}
                </p>
                <WorkspaceSwitcher session={session} />
                {/* Not a logout — nobody is ever signed out here. This picks
                    a different role and plan so a gate can be shown refusing. */}
                <Link
                    href="/sign-in"
                    data-testid="switch-persona"
                    className="mt-2 block rounded-md px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-ink"
                >
                    Switch role or plan
                </Link>
            </div>
        </aside>
    );
}


/**
 * Which customer's workspace is open, for a person who has more than one.
 *
 * Renders nothing for an ordinary user. The consultant sees their two
 * workspaces and can move between them; each switch rewrites the session
 * cookie and the layout then tells Oorb the new account — which is the whole
 * point of the persona.
 */
function WorkspaceSwitcher({ session }: { session: Session }) {
    const accounts = findPersona(session.email)?.accounts ?? [];
    if (accounts.length < 2) return null;

    return (
        <div className="mt-2 px-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Workspace
            </p>
            <div className="mt-1 space-y-0.5">
                {accounts.map((account) => (
                    <form key={account.id} action={switchWorkspaceAction}>
                        <input type="hidden" name="accountId" value={account.id} />
                        <button
                            type="submit"
                            data-testid={`workspace-${account.id}`}
                            className={`w-full rounded-md px-2 py-1 text-left text-sm ${
                                account.id === session.accountId
                                    ? "bg-slate-100 font-medium text-ink"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-ink"
                            }`}
                        >
                            {account.name}
                        </button>
                    </form>
                ))}
            </div>
        </div>
    );
}
