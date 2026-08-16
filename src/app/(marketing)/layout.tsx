import Link from "next/link";

/**
 * The signed-out chrome.
 *
 * No session is read here at all: these pages are reachable by anyone, and
 * asking who they are would be the first step toward accidentally gating them.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-screen-lg items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sea text-sm font-bold text-white">
                            L
                        </span>
                        <span className="text-sm font-semibold text-ink">Ledgerline</span>
                    </Link>
                    <nav className="flex items-center gap-1 text-sm">
                        <Link href="/pricing" className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100">
                            Pricing
                        </Link>
                        <Link href="/security" className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100">
                            Security
                        </Link>
                        <Link href="/sign-in" className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100">
                            Sign in
                        </Link>
                        {/* Goes straight in — there is no signed-out state. The
                            marketing pages keep their real calls to action
                            because the App Map reads this file and a demo of a
                            product with no front door is not a demo. */}
                        <Link
                            href="/dashboard"
                            className="rounded-md bg-sea px-3 py-1.5 font-medium text-white hover:bg-sea/90"
                        >
                            Open the app
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-screen-lg px-6 py-12">{children}</main>
        </div>
    );
}
