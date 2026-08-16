import { requireSession } from "@/lib/auth/session";
import { Sidebar } from "@/components/nav/sidebar";

/**
 * The signed-in shell, and the only auth gate in the app.
 *
 * Every screen under this layout is behind `requireSession()`, so no page
 * repeats the check. The sidebar it renders is where every in-app destination
 * comes from — no route file below holds a link to a sibling screen.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await requireSession();

    return (
        <div className="flex min-h-screen">
            <Sidebar session={session} />
            <main className="flex-1 overflow-x-hidden">
                <div className="mx-auto max-w-screen-xl space-y-6 px-8 py-8">{children}</div>
            </main>
        </div>
    );
}
