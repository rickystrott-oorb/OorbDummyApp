import type { Metadata } from "next";

import { signInAction } from "@/lib/auth/actions";

export const metadata: Metadata = { title: "Switch role or plan" };

/**
 * Become somebody else.
 *
 * Not a login — this app has no signed-out state, and going straight to any
 * screen works. This is how you get to the OTHER side of a gate: pick a member
 * on the free plan and watch Admin, Team, API keys and Forecasting all refuse.
 */
export default function SignInPage() {
    return (
        <div className="mx-auto max-w-sm space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                    Switch role or plan
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    You are already signed in as an owner. Change the role or plan
                    here to see a screen refuse you.
                </p>
            </div>

            <form action={signInAction} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink">
                        Work email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        defaultValue="dana@northwind.test"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sea focus:outline-none focus:ring-1 focus:ring-sea"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-ink">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="anything at all"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sea focus:outline-none focus:ring-1 focus:ring-sea"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-ink">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            defaultValue="owner"
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sea focus:outline-none focus:ring-1 focus:ring-sea"
                        >
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="plan" className="block text-sm font-medium text-ink">
                            Plan
                        </label>
                        <select
                            id="plan"
                            name="plan"
                            defaultValue="growth"
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sea focus:outline-none focus:ring-1 focus:ring-sea"
                        >
                            <option value="free">Free</option>
                            <option value="growth">Growth</option>
                            <option value="scale">Scale</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    data-testid="sign-in-submit"
                    className="w-full rounded-md bg-sea px-4 py-2 text-sm font-medium text-white hover:bg-sea/90"
                >
                    Switch
                </button>
            </form>
        </div>
    );
}
