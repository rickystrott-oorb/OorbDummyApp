import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { expenseById, money } from "@/lib/data/fixtures";
import { Badge, ButtonLink, Card, Facts, PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Expense" };

/** One expense: who spent it, on what, and whether it has been signed off. */
export default async function ExpenseDetailPage({
    params,
}: {
    params: Promise<{ expenseId: string }>;
}) {
    const { expenseId } = await params;
    const expense = expenseById(expenseId);
    if (!expense) notFound();

    return (
        <>
            <PageHeader
                title={`${expense.vendor} · ${money(expense.amountCents)}`}
                description={`${expense.category} · incurred ${expense.incurred}`}
                action={
                    expense.status === "submitted" ? (
                        <ButtonLink href={`/expenses/${expense.id}/approve`} testId="approve-expense">
                            Approve
                        </ButtonLink>
                    ) : undefined
                }
            />

            <div className="flex flex-wrap items-center gap-3">
                <Badge value={expense.status} />
                {expense.reimbursable && (
                    <span className="text-sm text-slate-600">Owed back to {expense.submittedBy}</span>
                )}
            </div>

            <Card>
                <Facts
                    items={[
                        { label: "Submitted by", value: expense.submittedBy },
                        { label: "Receipt", value: expense.receipt ?? "Not attached" },
                        { label: "Reimbursable", value: expense.reimbursable ? "Yes" : "No — paid on the company card" },
                        { label: "Reference", value: expense.id },
                    ]}
                />
                <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-700">{expense.notes}</p>
            </Card>
        </>
    );
}
