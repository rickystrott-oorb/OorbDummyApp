import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { invoiceById, money, paymentById } from "@/lib/data/fixtures";
import { Badge, Card, PageHeader, RowLink } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Payment" };

/** One payment, and the invoice it belongs to. */
export default async function PaymentDetailPage({
    params,
}: {
    params: Promise<{ paymentId: string }>;
}) {
    const { paymentId } = await params;
    const payment = paymentById(paymentId);
    if (!payment) notFound();

    const invoice = invoiceById(payment.invoiceId);

    return (
        <>
            <PageHeader title={money(payment.amountCents)} description={`Received ${payment.receivedAt}`} />

            <Card>
                <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt>
                        <dd className="mt-1">
                            <Badge value={payment.status} />
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Method</dt>
                        <dd className="mt-1 text-sm text-slate-700">
                            {payment.method.replace(/_/g, " ")}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Invoice</dt>
                        <dd className="mt-1 text-sm">
                            {invoice ? (
                                <RowLink href={`/invoices/${invoice.id}`}>{invoice.number}</RowLink>
                            ) : (
                                "—"
                            )}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reference</dt>
                        <dd className="mt-1 text-sm text-slate-700">{payment.id}</dd>
                    </div>
                </dl>

                {payment.status === "failed" && (
                    <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        The card was declined. The invoice went overdue the following day.
                    </p>
                )}
            </Card>
        </>
    );
}
