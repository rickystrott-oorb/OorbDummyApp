import type { Metadata } from "next";

import { EXPENSES, money } from "@/lib/data/fixtures";
import { PageHeader, Table } from "@/components/ui/primitives";
import { ExportButton } from "@/components/ui/export-button";

export const metadata: Metadata = { title: "Expenses" };

/** Money out. The only list with no detail page behind it. */
export default function ExpensesPage() {
    return (
        <>
            <PageHeader
                title="Expenses"
                description="What the business spent, and what somebody is owed back."
                action={<ExportButton />}
            />

            <Table columns={["Vendor", "Category", "Incurred", "Reimbursable", "Amount"]}>
                {EXPENSES.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-medium text-ink">{expense.vendor}</td>
                        <td className="px-4 py-2.5 text-slate-600">{expense.category}</td>
                        <td className="px-4 py-2.5 text-slate-600">{expense.incurred}</td>
                        <td className="px-4 py-2.5 text-slate-600">
                            {expense.reimbursable ? "Yes" : "No"}
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
