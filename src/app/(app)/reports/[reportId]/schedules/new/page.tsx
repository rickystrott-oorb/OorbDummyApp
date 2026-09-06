import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { reportById } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "New schedule" };

/** Having the report sent without anyone remembering to run it. */
export default async function NewSchedulePage({
    params,
    searchParams,
}: {
    params: Promise<{ reportId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { reportId } = await params;
    const report = reportById(reportId);
    if (!report) notFound();

    const { done } = await searchParams;
    const base = `/reports/${report.id}/schedules`;

    if (done) {
        return (
            <Done
                title="Schedule saved"
                detail={`${report.name} will be sent on that cadence. Nothing is stored in this demonstration.`}
                back={{ href: base, label: "Back to schedules" }}
            />
        );
    }

    return (
        <Card>
            <DemoForm doneHref={`${base}/new?done=1`}>
                <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                    <Field label="Cadence" htmlFor="cadence">
                        <select id="cadence" name="cadence" defaultValue={report.cadence} className={INPUT}>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                        </select>
                    </Field>
                    <Field label="Send at" htmlFor="time">
                        <input id="time" name="time" type="time" defaultValue="08:00" className={INPUT} />
                    </Field>
                </div>
                <Field label="Recipients" htmlFor="recipients" hint="One address per line.">
                    <textarea id="recipients" name="recipients" rows={3} defaultValue="dana@northwind.test" className={`${INPUT} max-w-lg`} />
                </Field>
                <Field label="Format" htmlFor="format">
                    <select id="format" name="format" defaultValue="PDF" className={`${INPUT} max-w-sm`}>
                        <option>PDF</option>
                        <option>CSV</option>
                        <option>Link only</option>
                    </select>
                </Field>
                <SubmitButton testId="save-schedule">Save schedule</SubmitButton>
            </DemoForm>
        </Card>
    );
}
