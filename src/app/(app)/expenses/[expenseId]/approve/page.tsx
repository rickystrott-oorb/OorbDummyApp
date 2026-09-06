import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { expenseById, money } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, Locked, PageHeader, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "Approve expense" };

/**
 * Signing off an expense. Gated on the role: a member can file one and
 * cannot approve one — least of all their own.
 */
export default async function ApproveExpensePage({
    params,
    searchParams,
}: {
    params: Promise<{ expenseId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { expenseId } = await params;
    const expense = expenseById(expenseId);
    if (!expense) notFound();

    const session = await requireSession();
    if (session.role === "member") {
        return (
            <>
                <PageHeader title="Approve expense" />
                <Locked reason="Members can file expenses but cannot approve them. Ask an owner or an admin." />
            </>
        );
    }

    const { done } = await searchParams;
    const self = `/expenses/${expense.id}`;

    if (done) {
        return (
            <>
                <PageHeader title="Approve expense" />
                <Done
                    title="Expense approved"
                    detail={`${money(expense.amountCents)} to ${expense.vendor}${expense.reimbursable ? ` will be paid back to ${expense.submittedBy}` : ""}. Nothing is stored in this demonstration.`}
                    back={{ href: self, label: "Back to expense" }}
                />
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Approve expense"
                description={`${expense.vendor} · ${money(expense.amountCents)} · filed by ${expense.submittedBy}`}
            />
            <Card>
                <DemoForm doneHref={`${self}/approve?done=1`}>
                    <Field label="Charge to" htmlFor="cost-centre">
                        <select id="cost-centre" name="costCentre" defaultValue={expense.category} className={`${INPUT} max-w-sm`}>
                            <option>Infrastructure</option>
                            <option>Software</option>
                            <option>Office</option>
                            <option>Travel</option>
                            <option>Sales</option>
                        </select>
                    </Field>
                    {expense.reimbursable && (
                        <Field label="Pay back via" htmlFor="via">
                            <select id="via" name="via" defaultValue="Next payroll" className={`${INPUT} max-w-sm`}>
                                <option>Next payroll</option>
                                <option>Bank transfer now</option>
                            </select>
                        </Field>
                    )}
                    <Field label="Note to the submitter" htmlFor="note">
                        <textarea id="note" name="note" rows={2} placeholder="Optional." className={`${INPUT} max-w-lg`} />
                    </Field>
                    <SubmitButton testId="confirm-approval">Approve {money(expense.amountCents)}</SubmitButton>
                </DemoForm>
            </Card>
        </>
    );
}
