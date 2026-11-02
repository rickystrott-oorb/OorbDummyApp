import { redirect } from "next/navigation";

/**
 * The root is the app. There used to be a landing page here with pricing,
 * security and a sign-in behind it; this app exists only for testing, so the
 * front door went and the root goes straight to the dashboard.
 *
 * The QUERY goes with it. Oorb opens this app at its address with a link
 * parameter on it (`?oorb_record=`, `?oorb_context=`, `?oorb_tour=` …), and a
 * redirect that dropped it handed the snippet a dashboard with nothing to
 * start: "Record a walkthrough" opened the app and no recorder appeared.
 */
export default async function RootPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(await searchParams)) {
        for (const one of Array.isArray(value) ? value : value === undefined ? [] : [value]) query.append(key, one);
    }
    const rest = query.toString();
    redirect(rest ? `/dashboard?${rest}` : "/dashboard");
}
