import Link from "next/link";

import { planAtLeast, type Session } from "@/lib/auth/session";

import type { NavItem } from "./nav-items";

/**
 * A horizontal sub-navigation for a section that owns several screens.
 *
 * Shared by settings and admin. Like the sidebar it hides what the viewer
 * could not open anyway, and like the sidebar it decides nothing — the screens
 * hold their own gates.
 */
export function SubNav({ items, session }: { items: NavItem[]; session: Session }) {
    const visible = items.filter(
        (item) =>
            (!item.roles || item.roles.includes(session.role)) &&
            (!item.minimumPlan || planAtLeast(session.plan, item.minimumPlan))
    );

    return (
        <nav className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-3">
            {visible.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-ink"
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
