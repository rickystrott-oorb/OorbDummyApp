"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Tabs across one record — an invoice's lines, a customer's contacts.
 *
 * Rendered by the record's layout, so every screen under it shares the same
 * header and the same way between sections; the pages hold only their own
 * content. The active tab is the one whose path the current one starts with,
 * except the base, which must match exactly or it would always be lit.
 */
export function RecordTabs({ base, items }: { base: string; items: { href: string; label: string }[] }) {
    const pathname = usePathname();
    return (
        <nav className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-3">
            {items.map((item) => {
                const active =
                    item.href === base ? pathname === base : pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={
                            active
                                ? "rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-ink"
                                : "rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-ink"
                        }
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
