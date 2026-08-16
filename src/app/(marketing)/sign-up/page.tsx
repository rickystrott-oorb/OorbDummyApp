import Link from "next/link";
import type { Metadata } from "next";

import { signInAction } from "@/lib/auth/actions";

export const metadata: Metadata = { title: "Start free" };

/**
 * Sign-up is sign-in with different copy and a longer form.
 *
 * The extra fields exist to be abandoned: a form somebody starts and leaves is
 * the only way to produce a form-abandon signal.
 */
export default function SignUpPage() {
    return (
        <div className="mx-auto max-w-sm space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">Start free</h1>
                <p className="mt-1 text-sm text-slate-600">
                    No card. Ten invoices a month on the free plan.
                </p>
            </div>

            <form action={signInAction} className="space-y-4">
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-ink">
                        Company
                    </label>
                    <input
                        id="company"
                        name="company"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sea focus:outline-none focus:ring-1 focus:ring-sea"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink">
                        Work email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sea focus:outline-none focus:ring-1 focus:ring-sea"
                    />
                </div>
                <div>
                    <label htmlFor="vat" className="block text-sm font-medium text-ink">
                        VAT number
                    </label>
                    <input
                        id="vat"
                        name="vat"
                        placeholder="GB123456789"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sea focus:outline-none focus:ring-1 focus:ring-sea"
                    />
                </div>
                <input type="hidden" name="plan" value="free" />
                <input type="hidden" name="role" value="owner" />

                <button
                    type="submit"
                    data-testid="sign-up-submit"
                    className="w-full rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
                >
                    Create workspace
                </button>
            </form>

            <p className="text-center text-sm text-slate-500">
                Already have one?{" "}
                <Link href="/sign-in" className="font-medium text-sea hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
