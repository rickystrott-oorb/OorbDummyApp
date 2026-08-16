/**
 * Every row this app renders.
 *
 * Hardcoded on purpose: there is no database, so a screen is exactly as
 * complicated as the code that lays it out. Numbers are stable rather than
 * random — a value that changes on refresh would look like a live counter and
 * hide the one control that is genuinely broken.
 */

export interface Customer {
    id: string;
    name: string;
    domain: string;
    contact: string;
    country: string;
    status: "active" | "trial" | "churned";
    mrrCents: number;
    since: string;
}

export interface Invoice {
    id: string;
    number: string;
    customerId: string;
    issued: string;
    due: string;
    status: "draft" | "sent" | "paid" | "overdue";
    totalCents: number;
    lines: { description: string; quantity: number; unitCents: number }[];
}

export interface Payment {
    id: string;
    invoiceId: string;
    method: "card" | "transfer" | "direct_debit";
    receivedAt: string;
    amountCents: number;
    status: "settled" | "pending" | "failed";
}

export interface Expense {
    id: string;
    vendor: string;
    category: string;
    incurred: string;
    amountCents: number;
    reimbursable: boolean;
}

export interface Report {
    id: string;
    name: string;
    summary: string;
    cadence: "weekly" | "monthly" | "quarterly";
    /** The lowest plan that may open it — the gate each report screen reads. */
    minimumPlan: "free" | "growth" | "scale";
}

export const CUSTOMERS: Customer[] = [
    { id: "c_northwind", name: "Northwind Freight", domain: "northwind.test", contact: "Priya Raman", country: "United Kingdom", status: "active", mrrCents: 480000, since: "2023-04-11" },
    { id: "c_alder", name: "Alder & Coyle", domain: "alderco.test", contact: "Marcus Vane", country: "Ireland", status: "active", mrrCents: 215000, since: "2024-01-22" },
    { id: "c_pellhaus", name: "Pellhaus Manufacturing", domain: "pellhaus.test", contact: "Ingrid Sollberg", country: "Germany", status: "trial", mrrCents: 0, since: "2026-07-02" },
    { id: "c_kestrel", name: "Kestrel Analytics", domain: "kestrel.test", contact: "Tobi Adeyemi", country: "United States", status: "active", mrrCents: 96000, since: "2025-09-30" },
    { id: "c_brackwater", name: "Brackwater Logistics", domain: "brackwater.test", contact: "Elena Duarte", country: "Spain", status: "churned", mrrCents: 0, since: "2022-11-08" },
    { id: "c_orrin", name: "Orrin Health", domain: "orrinhealth.test", contact: "Samuel Okafor", country: "Canada", status: "active", mrrCents: 331000, since: "2024-06-17" },
];

export const INVOICES: Invoice[] = [
    { id: "i_2411", number: "INV-2411", customerId: "c_northwind", issued: "2026-07-01", due: "2026-07-31", status: "paid", totalCents: 480000, lines: [{ description: "Platform subscription — July", quantity: 1, unitCents: 420000 }, { description: "Additional seats", quantity: 4, unitCents: 15000 }] },
    { id: "i_2412", number: "INV-2412", customerId: "c_alder", issued: "2026-07-01", due: "2026-07-31", status: "paid", totalCents: 215000, lines: [{ description: "Platform subscription — July", quantity: 1, unitCents: 215000 }] },
    { id: "i_2413", number: "INV-2413", customerId: "c_kestrel", issued: "2026-07-14", due: "2026-08-13", status: "overdue", totalCents: 96000, lines: [{ description: "Platform subscription — July", quantity: 1, unitCents: 96000 }] },
    { id: "i_2414", number: "INV-2414", customerId: "c_orrin", issued: "2026-08-01", due: "2026-08-31", status: "sent", totalCents: 331000, lines: [{ description: "Platform subscription — August", quantity: 1, unitCents: 295000 }, { description: "Onboarding services", quantity: 1, unitCents: 36000 }] },
    { id: "i_2415", number: "INV-2415", customerId: "c_northwind", issued: "2026-08-01", due: "2026-08-31", status: "sent", totalCents: 495000, lines: [{ description: "Platform subscription — August", quantity: 1, unitCents: 420000 }, { description: "Additional seats", quantity: 5, unitCents: 15000 }] },
    { id: "i_2416", number: "INV-2416", customerId: "c_pellhaus", issued: "2026-08-12", due: "2026-09-11", status: "draft", totalCents: 128000, lines: [{ description: "Pilot — 30 days", quantity: 1, unitCents: 128000 }] },
];

export const PAYMENTS: Payment[] = [
    { id: "p_881", invoiceId: "i_2411", method: "transfer", receivedAt: "2026-07-24", amountCents: 480000, status: "settled" },
    { id: "p_882", invoiceId: "i_2412", method: "direct_debit", receivedAt: "2026-07-29", amountCents: 215000, status: "settled" },
    { id: "p_883", invoiceId: "i_2413", method: "card", receivedAt: "2026-08-14", amountCents: 96000, status: "failed" },
    { id: "p_884", invoiceId: "i_2414", method: "transfer", receivedAt: "2026-08-15", amountCents: 165500, status: "pending" },
];

export const EXPENSES: Expense[] = [
    { id: "e_51", vendor: "Cloudscale", category: "Infrastructure", incurred: "2026-08-01", amountCents: 184200, reimbursable: false },
    { id: "e_52", vendor: "Meridian Analytics", category: "Software", incurred: "2026-08-03", amountCents: 29900, reimbursable: false },
    { id: "e_53", vendor: "Kaldi Coffee", category: "Office", incurred: "2026-08-06", amountCents: 4150, reimbursable: true },
    { id: "e_54", vendor: "Rail & Sleeper", category: "Travel", incurred: "2026-08-09", amountCents: 21800, reimbursable: true },
];

export const REPORTS: Report[] = [
    { id: "r_aging", name: "Receivables aging", summary: "What is owed, and for how long.", cadence: "weekly", minimumPlan: "free" },
    { id: "r_cohort", name: "Revenue cohorts", summary: "Retained revenue by the month a customer signed.", cadence: "monthly", minimumPlan: "growth" },
    { id: "r_churn", name: "Churn drivers", summary: "Which accounts left, and what preceded it.", cadence: "monthly", minimumPlan: "growth" },
    { id: "r_forecast", name: "Cash forecast", summary: "Modelled collections for the next two quarters.", cadence: "quarterly", minimumPlan: "scale" },
];

/** "$4,800.00" — invoices are always shown in full, never abbreviated. */
export function money(cents: number): string {
    return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function customerById(id: string): Customer | undefined {
    return CUSTOMERS.find((customer) => customer.id === id);
}

export function invoiceById(id: string): Invoice | undefined {
    return INVOICES.find((invoice) => invoice.id === id);
}

export function paymentById(id: string): Payment | undefined {
    return PAYMENTS.find((payment) => payment.id === id);
}

export function reportById(id: string): Report | undefined {
    return REPORTS.find((report) => report.id === id);
}

export function invoicesForCustomer(customerId: string): Invoice[] {
    return INVOICES.filter((invoice) => invoice.customerId === customerId);
}
