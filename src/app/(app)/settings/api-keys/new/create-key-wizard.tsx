"use client";

import { useState } from "react";
import Link from "next/link";

import { API_SCOPES } from "@/lib/data/fixtures";
import { Field, INPUT } from "@/components/ui/primitives";

/**
 * Three steps, one route.
 *
 * Deliberately NOT three pages: a walkthrough has to follow a step that
 * changes the screen without changing the address, and a wizard is the
 * commonest shape that does. Every Next button here is a real click that
 * draws the next step in place.
 */
export function CreateKeyWizard() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [label, setLabel] = useState("");
    const [scopes, setScopes] = useState<string[]>(["invoices:read"]);

    const button = "rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90";
    const ghost = "rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <ol className="mb-5 flex items-center gap-2 text-xs">
                {["Name", "Permissions", "Your key"].map((title, index) => {
                    const n = (index + 1) as 1 | 2 | 3;
                    return (
                        <li key={title} className="flex items-center gap-2">
                            <span
                                className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                                    step >= n ? "bg-sea text-white" : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {n}
                            </span>
                            <span className={step === n ? "font-medium text-ink" : "text-slate-500"}>{title}</span>
                            {n < 3 && <span className="mx-1 text-slate-300">—</span>}
                        </li>
                    );
                })}
            </ol>

            {step === 1 && (
                <form
                    className="space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setStep(2);
                    }}
                >
                    <Field label="What is this key for?" htmlFor="label" hint="Shown in the list so you can tell keys apart later.">
                        <input
                            id="label"
                            name="label"
                            autoFocus
                            value={label}
                            onChange={(event) => setLabel(event.target.value)}
                            placeholder="Zapier, or the data warehouse sync"
                            className={`${INPUT} max-w-sm`}
                        />
                    </Field>
                    <button type="submit" data-testid="key-step-name" className={button}>
                        Next: permissions
                    </button>
                </form>
            )}

            {step === 2 && (
                <form
                    className="space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setStep(3);
                    }}
                >
                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium text-ink">What may it do?</legend>
                        {API_SCOPES.map((scope) => (
                            <label key={scope.id} className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="scope"
                                    value={scope.id}
                                    checked={scopes.includes(scope.id)}
                                    onChange={(event) =>
                                        setScopes((current) =>
                                            event.target.checked
                                                ? [...current, scope.id]
                                                : current.filter((id) => id !== scope.id)
                                        )
                                    }
                                    className="mt-0.5 h-4 w-4 accent-sea"
                                />
                                <span>
                                    <span className="block text-sm font-medium text-ink">{scope.label}</span>
                                    <span className="block text-sm text-slate-600">{scope.detail}</span>
                                </span>
                            </label>
                        ))}
                    </fieldset>
                    <div className="flex items-center gap-2">
                        <button type="button" className={ghost} onClick={() => setStep(1)}>
                            Back
                        </button>
                        <button type="submit" data-testid="key-step-scopes" className={button}>
                            Create key
                        </button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <p className="text-sm text-slate-700">
                        <span className="font-medium text-ink">{label || "Untitled key"}</span> can{" "}
                        {scopes.length
                            ? API_SCOPES.filter((scope) => scopes.includes(scope.id))
                                  .map((scope) => scope.label.toLowerCase())
                                  .join(", ")
                            : "do nothing yet"}
                        .
                    </p>
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                            Copy it now — it is not shown again
                        </p>
                        <code className="mt-1 block break-all font-mono text-sm text-ink">
                            lk_live_7c41e9b2d0f84a6a9e3b5c1d2f8a7b6c
                        </code>
                    </div>
                    <p className="text-xs text-slate-500">
                        Nothing was created — this is a demonstration. The key above is not real.
                    </p>
                    <Link href="/settings/api-keys" data-testid="key-done" className={`inline-block ${button}`}>
                        Back to API keys
                    </Link>
                </div>
            )}
        </div>
    );
}
