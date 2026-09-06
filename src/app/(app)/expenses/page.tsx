import type { Metadata } from "next";

import { EXPENSES, money } from "@/lib/data/fixtures";
import { Badge, PageHeader, RowLink, Table } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Expenses" };

/** Money out. Each row opens, and the ones still waiting can be approved there. */
export default function ExpensesPage() {
    return (
        <>
            <PageHeader
                title="Expenses"
                description="What the business spent, and what somebody is owed back."
                action={<ExportButton />}
            />

            <Table columns={["Vendor", "Category", "Incurred", "Status", "Amount"]}>
                {EXPENSES.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                            <RowLink href={`/expenses/${expense.id}`}>{expense.vendor}</RowLink>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{expense.category}</td>
                        <td className="px-4 py-2.5 text-slate-600">{expense.incurred}</td>
                        <td className="px-4 py-2.5">
                            <Badge value={expense.status} />
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-slate-900">
                            {money(expense.amountCents)}
                        </td>
                    </tr>
                ))}
            </Table>
        </>
    );
}
