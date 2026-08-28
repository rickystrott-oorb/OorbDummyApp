"use client";

import { useEffect } from "react";

/**
 * Tell Oorb who is using the app, on every navigation.
 *
 * WHY THE SCRIPT TAG IS NOT ENOUGH, which took a live test to see. The layout
 * interpolates `data-user-email` into the tag and that reads like the whole
 * story — it is even the path Oorb's own setup page leads with. It works
 * exactly once: `o.js` reads its tag when it boots, and in the App Router
 * signing in is a CLIENT navigation, so the script is never re-executed. The
 * snippet went on reporting whoever was signed in when the page first loaded.
 *
 * Signing in as four people in one tab produced four sessions attributed to
 * the previous person each time — off by one, and completely plausible-looking
 * on the Signals page. Nothing threw.
 *
 * So the tag stays (it is right on the FIRST load, before any JS has run, and
 * catches a visit that never navigates) and this keeps it true afterwards.
 * `identify` merges, so repeating it is free.
 */

interface OorbApi {
    identify(input: { userId?: string; email?: string; name?: string }): void;
    reset(): void;
}

/** How long to keep looking for a snippet that loads `afterInteractive`. */
const WAIT_MS = 5_000;
const POLL_MS = 200;

export function OorbIdentity({
    userId,
    email,
    name,
}: {
    userId?: string;
    email?: string;
    name?: string;
}) {
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;
        const deadline = Date.now() + WAIT_MS;

        const apply = (): boolean => {
            const oorb = (window as Window & { oorb?: OorbApi }).oorb;
            if (!oorb) return false;
            // Signing out is a real event, and its own call: `identify` merges,
            // so passing nothing would leave the last person in place.
            if (email) oorb.identify({ userId, email, name });
            else oorb.reset();
            return true;
        };

        // The snippet loads `afterInteractive`, so it may not have run yet on
        // the first paint. Give up rather than poll forever — a page with no
        // snippet on it is a perfectly normal state here, since the tag is
        // only rendered when the key is configured.
        if (!apply()) {
            timer = setInterval(() => {
                if (apply() || Date.now() > deadline) {
                    if (timer) clearInterval(timer);
                    timer = null;
                }
            }, POLL_MS);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [userId, email, name]);

    return null;
}
