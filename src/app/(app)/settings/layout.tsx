import { requireSession } from "@/lib/auth/session";
import { SubNav } from "@/components/nav/sub-nav";
import { SETTINGS_NAV } from "@/components/nav/nav-items";

/**
 * The settings section.
 *
 * Adds a sub-navigation and nothing else: settings is open to everyone signed
 * in, and the screens inside it that are NOT hold their own gates. A blanket
 * refusal here would take Profile away from a member too.
 */
export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
    const session = await requireSession();

    return (
        <div className="space-y-6">
            <SubNav items={SETTINGS_NAV} session={session} />
            {children}
        </div>
    );
}
