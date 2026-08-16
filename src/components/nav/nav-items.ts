import type { Plan, Role } from "@/lib/auth/session";

/**
 * Every destination in the signed-in app.
 *
 * This table lives in its OWN module, imported by the sidebar, which is
 * rendered by a layout. No route file mentions any of these hrefs — which is
 * exactly how a real app is built, and the reason anything reading this
 * codebase has to follow imports rather than read one file per screen.
 */
export interface NavItem {
    href: string;
    label: string;
    /** Shown in the sidebar; the screen itself re-checks. */
    minimumPlan?: Plan;
    /** Roles that may see the link at all. Absent means everyone. */
    roles?: Role[];
}

export interface NavSection {
    heading: string;
    items: NavItem[];
}

export const APP_NAV: NavSection[] = [
    {
        heading: "Money in",
        items: [
            { href: "/dashboard", label: "Dashboard" },
            { href: "/invoices", label: "Invoices" },
            { href: "/payments", label: "Payments" },
            { href: "/customers", label: "Customers" },
        ],
    },
    {
        heading: "Money out",
        items: [{ href: "/expenses", label: "Expenses" }],
    },
    {
        heading: "Insight",
        items: [
            { href: "/reports", label: "Reports" },
            { href: "/forecasting", label: "Forecasting", minimumPlan: "scale" },
            { href: "/integrations", label: "Integrations" },
        ],
    },
    {
        heading: "Workspace",
        items: [
            { href: "/settings", label: "Settings" },
            { href: "/admin", label: "Admin", roles: ["owner"] },
        ],
    },
];

/** The settings sub-navigation, rendered by the settings layout. */
export const SETTINGS_NAV: NavItem[] = [
    { href: "/settings", label: "Overview" },
    { href: "/settings/profile", label: "Profile" },
    { href: "/settings/team", label: "Team", roles: ["owner", "admin"] },
    { href: "/settings/billing", label: "Billing", roles: ["owner", "admin"] },
    { href: "/settings/notifications", label: "Notifications" },
    { href: "/settings/api-keys", label: "API keys", minimumPlan: "growth" },
];

/** The admin sub-navigation, rendered by the admin layout. */
export const ADMIN_NAV: NavItem[] = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/accounts", label: "Accounts" },
    { href: "/admin/audit-log", label: "Audit log" },
];
