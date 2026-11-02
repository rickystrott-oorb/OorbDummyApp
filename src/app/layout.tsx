import type { Metadata } from "next";

import { Oorb } from "@/components/oorb";
import { getSession } from "@/lib/auth/session";

import "./globals.css";

export const metadata: Metadata = {
    title: { default: "Ledgerline", template: "%s · Ledgerline" },
    description: "Invoicing, payments and cash reporting for B2B teams.",
};

/**
 * The document shell.
 *
 * Oorb is installed here through its npm package (`@oorb/browser`) — once,
 * for every page, which is how a customer would install it. The key and
 * where Oorb lives come from the environment, so this repo carries no key of
 * its own: with either unset Oorb is simply not loaded. `NEXT_PUBLIC_OORB_SRC`
 * is the snippet's address as the script-tag install had it; the package
 * wants the origin, which is read off it.
 *
 * Note what is NOT happening. This app keeps its session in an `httpOnly`
 * cookie, which JavaScript cannot read by design — so a tracking script could
 * not discover who is signed in even if it tried. The app has to say. That is
 * true of every properly built app, and it is why Oorb asks rather than
 * sniffs.
 */
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const key = process.env.NEXT_PUBLIC_OORB_KEY;
    const origin = originOf(process.env.NEXT_PUBLIC_OORB_SRC);
    const session = await getSession();

    return (
        <html lang="en">
            <body>
                {key && origin ? (
                    <Oorb
                        publicKey={key}
                        origin={origin}
                        userId={session?.userId}
                        email={session?.email}
                        name={session?.name}
                        accountId={session?.accountId}
                        accountDomain={session?.accountDomain}
                    >
                        {children}
                    </Oorb>
                ) : (
                    children
                )}
            </body>
        </html>
    );
}

/** "http://localhost:3000/o.js" → "http://localhost:3000"; nothing for nothing usable. */
function originOf(src: string | undefined): string | null {
    if (!src) return null;
    try {
        return new URL(src).origin;
    } catch {
        return null;
    }
}
