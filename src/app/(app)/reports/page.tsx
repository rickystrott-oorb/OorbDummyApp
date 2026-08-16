import type { Metadata } from "next";

import { requireSession, planAtLeast } from "@/lib/auth/session";
import { REPORTS } from "@/lib/data/fixtures";
import { PageHeader, RowLink, Table } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Reports" };

/**
 * The report catalogue.
 *
 * Every report is LISTED whatever the plan — hiding the ones somebody cannot
 * open would leave them unable to discover what upgrading buys. The lock is
 * shown against the row, and the report screen itself refuses.
 */
export default async function ReportsPage() {
    const session = await requireSession();

    return (
        <>
            <PageHeader title="Reports" description="Standing analyses, run on a schedule." />

            <Table columns={["Report", "Summary", "Cadence", "Plan"]}>
                {REPORTS.map((report) => {
                    const allowed = planAtLeast(session.plan, report.minimumPlan);
                    return (
                        <tr key={report.id} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5">
                                <RowLink href={`/reports/${report.id}`}>{report.name}</RowLink>
                            </td>
                            <td className="px-4 py-2.5 text-slate-600">{report.summary}</td>
                            <td className="px-4 py-2.5 text-slate-600">{report.cadence}</td>
                            <td className="px-4 py-2.5">
                                <span
                                    className={
                                        allowed
                                            ? "text-xs text-slate-500"
                                            : "text-xs font-medium text-coral"
                                    }
                                >
                                    {allowed ? "Included" : `${report.minimumPlan} and up`}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </Table>
        </>
    );
}
