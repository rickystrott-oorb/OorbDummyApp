"use client";

import { useState } from "react";

/**
 * The one control in this app that does not work.
 *
 * Deliberate: a rage-click needs something to rage at, and it needs to be the
 * ONLY candidate — otherwise every mis-click reads as friction and the signal
 * means nothing. It renders, it depresses, and it does nothing at all.
 *
 * Every other button and link on every other screen goes somewhere.
 */
export function ExportButton({ label = "Export CSV" }: { label?: string }) {
    const [attempts, setAttempts] = useState(0);

    return (
        <button
            type="button"
            data-testid="export-button"
            onClick={() => setAttempts((count) => count + 1)}
            aria-label={label}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
            {label}
            {attempts > 2 && (
                <span className="ml-2 text-xs text-slate-400">still nothing…</span>
            )}
        </button>
    );
}
