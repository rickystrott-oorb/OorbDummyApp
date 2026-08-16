import type { Metadata } from "next";

import { CUSTOMERS, INVOICES, PAYMENTS } from "@/lib/data/fixtures";
import { PageHeader, Stat } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Admin" };

/** The owner's view of the whole workspace. */
export default function AdminOverviewPage() {
    return (
        <>
            <PageHeader title="Admin" description="The workspace as a whole." />

            <div className="grid gap-4 sm:grid-cols-4">
                <Stat label="Customers" value={String(CUSTOMERS.length)} />
                <Stat label="Invoices" value={String(INVOICES.length)} />
                <Stat label="Payments" value={String(PAYMENTS.length)} />
                <Stat label="Seats used" value="4 of 10" />
            </div>
        </>
    );
}
