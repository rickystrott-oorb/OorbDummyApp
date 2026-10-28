import { redirect } from "next/navigation";

/**
 * The root is the app. There used to be a landing page here with pricing,
 * security and a sign-in behind it; this app exists only for testing, so the
 * front door went and the root goes straight to the dashboard.
 */
export default function RootPage() {
    redirect("/dashboard");
}
