import Link from "next/link";

import { planAtLeast, type Session } from "@/lib/auth/session";
import { signOutAction } from "@/lib/auth/actions";

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
                <form action={signOutAction}>
                    <button
                        type="submit"
                        data-testid="sign-out"
                        className="mt-2 w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-500 hover:bg-slate-100 hover:text-ink"
                    >
                        Sign out
                    </button>
                </form>
            </div>
        </aside>
    );
}
