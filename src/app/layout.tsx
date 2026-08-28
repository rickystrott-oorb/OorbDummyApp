import type { Metadata } from "next";
import Script from "next/script";

import { getSession } from "@/lib/auth/session";

import "./globals.css";

export const metadata: Metadata = {
    title: { default: "Ledgerline", template: "%s · Ledgerline" },
    description: "Invoicing, payments and cash reporting for B2B teams.",
};

/**
 * The document shell.
 *
 * The Oorb Signals snippet is loaded here — once, for every page including the
 * marketing ones, which is how a customer would actually install it. Both
 * values come from the environment so this repo carries no key of its own:
 * with them unset the tag is simply not rendered.
 *
 * IDENTITY RIDES ON THE TAG, which is the whole point of doing it this way in
 * a server-rendered app: the layout already knows who is signed in, so the
 * address is interpolated into the markup and there is no JS call to time
 * correctly. An SPA would call `window.oorb.identify()` after login instead.
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
    const src = process.env.NEXT_PUBLIC_OORB_SRC;
    const session = await getSession();

    return (
        <html lang="en">
            <body>
                {children}
                {key && src && (
                    <Script
                        src={src}
                        data-key={key}
                        // Absent rather than empty for a signed-out visitor, so
                        // they arrive anonymous instead of identified as "".
                        {...(session?.email
                            ? {
                                  "data-user-id": session.userId,
                                  "data-user-email": session.email,
                                  "data-user-name": session.name,
                              }
                            : {})}
                        strategy="afterInteractive"
                    />
                )}
            </body>
        </html>
    );
}
