import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { invoiceById, money, paymentsForInvoice } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, Locked, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "Record payment" };

/**
 * Recording money that arrived outside Ledgerline — a cheque, a transfer with
 * no reference. Gated on the role: a member can see that an invoice is paid,
 * and cannot be the one who says so.
 */
export default async function RecordPaymentPage({
    params,
    searchParams,
}: {
    params: Promise<{ invoiceId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { invoiceId } = await params;
    const invoice = invoiceById(invoiceId);
    if (!invoice) notFound();

    const session = await requireSession();
    if (session.role === "member") {
        return <Locked reason="Members can see payments but cannot record them. Ask an owner or an admin." />;
    }

    const { done } = await searchParams;
    const base = `/invoices/${invoice.id}`;

    if (done) {
        return (
            <Done
                title="Payment recorded"
                detail={`${invoice.number} now shows the payment. Nothing is stored in this demonstration.`}
                back={{ href: `${base}/payments`, label: "See payments" }}
            />
        );
    }

    const settled = paymentsForInvoice(invoice.id)
        .filter((payment) => payment.status === "settled")
        .reduce((total, payment) => total + payment.amountCents, 0);
    const outstanding = Math.max(invoice.totalCents - settled, 0);

    return (
        <Card>
            <DemoForm doneHref={`${base}/record-payment?done=1`}>
                <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                    <Field label="Amount" htmlFor="amount" hint={`${money(outstanding)} outstanding.`}>
                        <input id="amount" name="amount" type="number" step="0.01" defaultValue={(outstanding / 100).toFixed(2)} className={INPUT} />
                    </Field>
                    <Field label="Received on" htmlFor="received">
                        <input id="received" name="received" type="date" defaultValue="2026-09-06" className={INPUT} />
                    </Field>
                </div>
                <Field label="Method" htmlFor="method">
                    <select id="method" name="method" className={`${INPUT} max-w-sm`}>
                        <option value="transfer">Bank transfer</option>
                        <option value="card">Card</option>
                        <option value="direct_debit">Direct debit</option>
                        <option value="cheque">Cheque</option>
                    </select>
                </Field>
                <Field label="Reference" htmlFor="reference" hint="What appears on the bank statement.">
                    <input id="reference" name="reference" placeholder={invoice.number} className={`${INPUT} max-w-sm`} />
                </Field>
                <SubmitButton testId="confirm-payment">Record payment</SubmitButton>
            </DemoForm>
        </Card>
    );
}
