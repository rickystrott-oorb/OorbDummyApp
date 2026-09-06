import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { invoiceById } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "Edit line" };

/**
 * One line, editable. Four clicks from the sidebar: Invoices → the invoice →
 * Lines → Edit. Saving confirms and offers the way back.
 */
export default async function EditLinePage({
    params,
    searchParams,
}: {
    params: Promise<{ invoiceId: string; line: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { invoiceId, line: lineParam } = await params;
    const invoice = invoiceById(invoiceId);
    if (!invoice) notFound();

    const index = Number(lineParam) - 1;
    const line = invoice.lines[index];
    if (!line) notFound();

    const { done } = await searchParams;
    const back = `/invoices/${invoice.id}/lines`;

    if (done) {
        return (
            <Done
                title="Line saved"
                detail={`"${line.description}" on ${invoice.number} was updated. Nothing is stored in this demonstration.`}
                back={{ href: back, label: "Back to lines" }}
            />
        );
    }

    return (
        <Card>
            <DemoForm doneHref={`/invoices/${invoice.id}/lines/${index + 1}?done=1`}>
                <Field label="Description" htmlFor="description">
                    <input id="description" name="description" defaultValue={line.description} className={`${INPUT} max-w-lg`} />
                </Field>
                <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                    <Field label="Quantity" htmlFor="quantity">
                        <input id="quantity" name="quantity" type="number" min={1} defaultValue={line.quantity} className={INPUT} />
                    </Field>
                    <Field label="Unit price" htmlFor="unit" hint="In dollars, before tax.">
                        <input id="unit" name="unit" type="number" step="0.01" defaultValue={(line.unitCents / 100).toFixed(2)} className={INPUT} />
                    </Field>
                </div>
                <SubmitButton testId="save-line">Save line</SubmitButton>
            </DemoForm>
        </Card>
    );
}
