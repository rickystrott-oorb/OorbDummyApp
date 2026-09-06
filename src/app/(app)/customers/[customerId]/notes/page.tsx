import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { customerById, notesForCustomer } from "@/lib/data/fixtures";
import { Card, Done, Field, INPUT, SubmitButton } from "@/components/ui/primitives";
import { DemoForm } from "@/components/ui/demo-form";

export const metadata: Metadata = { title: "Notes" };

/** What the team has written down about the customer, newest first. */
export default async function CustomerNotesPage({
    params,
    searchParams,
}: {
    params: Promise<{ customerId: string }>;
    searchParams: Promise<{ done?: string }>;
}) {
    const { customerId } = await params;
    const customer = customerById(customerId);
    if (!customer) notFound();

    const { done } = await searchParams;
    const base = `/customers/${customer.id}/notes`;
    const notes = notesForCustomer(customer.id);

    return (
        <>
            {done ? (
                <Done
                    title="Note added"
                    detail="It is on the record for the rest of the team. Nothing is stored in this demonstration."
                    back={{ href: base, label: "Back to notes" }}
                />
            ) : (
                <Card>
                    <DemoForm doneHref={`${base}?done=1`}>
                        <Field label="Add a note" htmlFor="body">
                            <textarea id="body" name="body" rows={3} placeholder="What was agreed, and with whom." className={`${INPUT} max-w-lg`} />
                        </Field>
                        <SubmitButton testId="save-note">Add note</SubmitButton>
                    </DemoForm>
                </Card>
            )}

            <Card>
                {notes.length === 0 ? (
                    <p className="text-sm text-slate-600">Nothing written about {customer.name} yet.</p>
                ) : (
                    <ol className="divide-y divide-slate-100">
                        {notes.map((note) => (
                            <li key={note.id} className="py-3 first:pt-0 last:pb-0">
                                <p className="text-sm text-slate-700">{note.body}</p>
                                <p className="mt-1 text-xs text-slate-400">
                                    {note.by} · {note.at}
                                </p>
                            </li>
                        ))}
                    </ol>
                )}
            </Card>
        </>
    );
}
