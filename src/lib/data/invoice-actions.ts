"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/session";

import { CUSTOMERS, addInvoice, type Invoice } from "./fixtures";

const STATUSES: Invoice["status"][] = ["sent", "draft", "overdue", "paid"];
const TERM_DAYS: Record<string, number> = { "Net 30": 30, "Net 14": 14, "Due on receipt": 0 };

/**
 * Raise an invoice into the in-memory store.
 *
 * The same role gate the page shows: a member can read the ledger and cannot
 * bill against it, and the action checks that itself rather than trusting
 * that the form was never rendered. Lands on the dashboard, because the
 * figure there is what the invoice was raised to move.
 */
export async function createInvoiceAction(formData: FormData): Promise<void> {
    const session = await requireSession();
    if (session.role === "member") redirect("/invoices/new");

    const customerId = String(formData.get("customer") ?? "");
    const amount = Number(String(formData.get("amount") ?? "").replace(/[$,\s]/g, ""));
    const status = String(formData.get("status") ?? "sent") as Invoice["status"];
    if (
        !CUSTOMERS.some((customer) => customer.id === customerId) ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        amount > 10_000_000 ||
        !STATUSES.includes(status)
    ) {
        redirect("/invoices/new?error=1");
    }

    const issued = /^\d{4}-\d{2}-\d{2}$/.test(String(formData.get("issued") ?? ""))
        ? String(formData.get("issued"))
        : new Date().toISOString().slice(0, 10);
    const due = new Date(`${issued}T00:00:00Z`);
    due.setUTCDate(due.getUTCDate() + (TERM_DAYS[String(formData.get("terms") ?? "")] ?? 30));

    addInvoice({
        customerId,
        issued,
        due: due.toISOString().slice(0, 10),
        status,
        totalCents: Math.round(amount * 100),
        description: String(formData.get("description") ?? "").trim().slice(0, 120) || "Platform subscription",
    });

    revalidatePath("/dashboard");
    revalidatePath("/invoices");
    redirect("/dashboard");
}
