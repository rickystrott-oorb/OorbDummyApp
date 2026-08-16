import type { Metadata } from "next";
import Script from "next/script";

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
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    const key = process.env.NEXT_PUBLIC_OORB_KEY;
    const src = process.env.NEXT_PUBLIC_OORB_SRC;

    return (
        <html lang="en">
            <body>
                {children}
                {key && src && (
                    <Script src={src} data-key={key} strategy="afterInteractive" />
                )}
            </body>
        </html>
    );
}
