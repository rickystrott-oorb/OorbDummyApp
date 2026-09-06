"use client";

import { useRouter } from "next/navigation";

/**
 * A form that lands somewhere.
 *
 * There is no database, so nothing is saved — but a submit that reloads the
 * page and shows the same empty form is exactly what a broken control looks
 * like, and this app allows itself only one of those. Submitting navigates to
 * `doneHref` on the client, so the screen confirms and the tour follows.
 */
export function DemoForm({
    doneHref,
    className = "space-y-4",
    children,
}: {
    doneHref: string;
    className?: string;
    children: React.ReactNode;
}) {
    const router = useRouter();
    return (
        <form
            className={className}
            onSubmit={(event) => {
                event.preventDefault();
                router.push(doneHref);
            }}
        >
            {children}
        </form>
    );
}
