import { requireSession } from "@/lib/auth/session";
import { SubNav } from "@/components/nav/sub-nav";
import { ADMIN_NAV } from "@/components/nav/nav-items";
import { Locked, PageHeader } from "@/components/ui/primitives";

/**
 * Owner-only, and refused HERE rather than on each screen.
 *
 * The opposite choice from settings, and the right one for this section: every
 * screen under /admin is owner work, so one gate covers them all and a new
 * admin screen cannot be added without it.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await requireSession();

    if (session.role !== "owner") {
        return (
            <div className="space-y-6">
                <PageHeader title="Admin" />
                <Locked reason="Only the workspace owner can open the admin area." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SubNav items={ADMIN_NAV} session={session} />
            {children}
        </div>
    );
}
