import type { Metadata } from "next";

import { PageHeader, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Audit log" };

const ENTRIES = [
    { at: "2026-08-16 09:14", actor: "dana@northwind.test", action: "Signed in", detail: "Chrome · London" },
    { at: "2026-08-15 17:02", actor: "ravi@northwind.test", action: "Sent invoice", detail: "INV-2415 to Northwind Freight" },
    { at: "2026-08-15 11:47", actor: "system", action: "Payment failed", detail: "p_883 · card declined" },
    { at: "2026-08-14 08:30", actor: "dana@northwind.test", action: "Changed plan", detail: "growth → scale" },
    { at: "2026-08-12 15:55", actor: "ravi@northwind.test", action: "Invited member", detail: "joss@northwind.test" },
];

/** Who did what. The last screen an owner reaches, and read-only. */
export default function AuditLogPage() {
    return (
        <>
            <PageHeader title="Audit log" description="Every change anyone made to this workspace." />

            <Table columns={["When", "Who", "Action", "Detail"]}>
                {ENTRIES.map((entry) => (
                    <tr key={entry.at}>
                        <td className="px-4 py-2.5 tabular-nums text-slate-600">{entry.at}</td>
                        <td className="px-4 py-2.5 text-slate-600">{entry.actor}</td>
                        <td className="px-4 py-2.5 font-medium text-ink">{entry.action}</td>
                        <td className="px-4 py-2.5 text-slate-600">{entry.detail}</td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
