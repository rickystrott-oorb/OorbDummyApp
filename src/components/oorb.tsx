"use client";

import { useEffect } from "react";
import { OorbProvider, useOorb } from "@oorb/browser/react";

/**
 * Oorb, installed the npm way — `@oorb/browser`, exactly as Oorb's
 * Settings › Setup › Install & keys › npm tab says: `<OorbProvider>` round the
 * app, fed the signed-in user. It injects the same `o.js` tag a pasted
 * snippet would, so the code on the page is still served by Oorb; what it
 * adds is keeping identity true across CLIENT navigations — signing in here
 * is one, and a tag read once at boot used to go on reporting whoever was
 * signed in when the page first loaded (off by one, and plausible-looking).
 *
 * `user` is null when nobody is signed in, so signing out is a `reset`.
 */
export function Oorb({
    publicKey,
    origin,
    userId,
    email,
    name,
    accountId,
    accountDomain,
    children,
}: {
    publicKey: string;
    origin: string;
    userId?: string;
    email?: string;
    name?: string;
    accountId?: string;
    accountDomain?: string;
    children: React.ReactNode;
}) {
    const account = accountId || accountDomain ? { id: accountId, domain: accountDomain } : undefined;
    return (
        <OorbProvider publicKey={publicKey} origin={origin} user={email ? { userId, email, name } : null} account={account}>
            <WorkspaceSwitch email={email} accountId={accountId} accountDomain={accountDomain} />
            {children}
        </OorbProvider>
    );
}

/**
 * The provider reads `account` once, when it loads the snippet, and
 * re-identifies only when the PERSON changes. A consultant switching
 * workspace is the same person in another customer's account, so this says
 * so — o.js then starts a new session for the new account, and their clicks
 * in Levis never land on Northwind's row. `identify` merges, so the repeat
 * on first load is free.
 */
function WorkspaceSwitch({ email, accountId, accountDomain }: { email?: string; accountId?: string; accountDomain?: string }) {
    const oorb = useOorb();
    useEffect(() => {
        if (!email || !(accountId || accountDomain)) return;
        // `OorbIdentity` does not declare `account`; `window.oorb.identify` takes it.
        const withAccount = { email, account: { id: accountId, domain: accountDomain } };
        oorb.identify(withAccount);
    }, [oorb, email, accountId, accountDomain]);
    return null;
}
