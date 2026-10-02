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
    submittedBy: string;
    status: "submitted" | "approved" | "reimbursed";
    receipt: string | null;
    notes: string;
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

const SEED_INVOICES: Invoice[] = [
    { id: "i_2411", number: "INV-2411", customerId: "c_northwind", issued: "2026-07-01", due: "2026-07-31", status: "paid", totalCents: 480000, lines: [{ description: "Platform subscription — July", quantity: 1, unitCents: 420000 }, { description: "Additional seats", quantity: 4, unitCents: 15000 }] },
    { id: "i_2412", number: "INV-2412", customerId: "c_alder", issued: "2026-07-01", due: "2026-07-31", status: "paid", totalCents: 215000, lines: [{ description: "Platform subscription — July", quantity: 1, unitCents: 215000 }] },
    { id: "i_2413", number: "INV-2413", customerId: "c_kestrel", issued: "2026-07-14", due: "2026-08-13", status: "overdue", totalCents: 96000, lines: [{ description: "Platform subscription — July", quantity: 1, unitCents: 96000 }] },
    { id: "i_2414", number: "INV-2414", customerId: "c_orrin", issued: "2026-08-01", due: "2026-08-31", status: "sent", totalCents: 331000, lines: [{ description: "Platform subscription — August", quantity: 1, unitCents: 295000 }, { description: "Onboarding services", quantity: 1, unitCents: 36000 }] },
    { id: "i_2415", number: "INV-2415", customerId: "c_northwind", issued: "2026-08-01", due: "2026-08-31", status: "sent", totalCents: 495000, lines: [{ description: "Platform subscription — August", quantity: 1, unitCents: 420000 }, { description: "Additional seats", quantity: 5, unitCents: 15000 }] },
    { id: "i_2416", number: "INV-2416", customerId: "c_pellhaus", issued: "2026-08-12", due: "2026-09-11", status: "draft", totalCents: 128000, lines: [{ description: "Pilot — 30 days", quantity: 1, unitCents: 128000 }] },
];

/**
 * The invoices, as a PSEUDO-DATABASE: an array held on `globalThis`.
 *
 * Seeded from the fixtures above and appended to by the New invoice form, so
 * the dashboard's Outstanding figure can be moved by hand — which is what a
 * number-on-the-customer's-screen feature needs to be tested against. On
 * `globalThis` rather than at module scope because the dev server re-evaluates
 * this module on every edit, and an invoice that vanished whenever a file was
 * saved would be no test at all. It still resets when the server restarts;
 * nothing here is persistence.
 */
const invoiceStore = globalThis as typeof globalThis & { __ledgerlineInvoices?: Invoice[] };
export const INVOICES: Invoice[] = (invoiceStore.__ledgerlineInvoices ??= SEED_INVOICES.map((invoice) => ({
    ...invoice,
})));

/** Appends one invoice with the next number in the series, and returns it. */
export function addInvoice(input: {
    customerId: string;
    issued: string;
    due: string;
    status: Invoice["status"];
    totalCents: number;
    description: string;
}): Invoice {
    const next =
        INVOICES.reduce((highest, invoice) => Math.max(highest, Number(invoice.number.replace(/\D/g, "")) || 0), 0) + 1;
    const invoice: Invoice = {
        id: `i_${next}`,
        number: `INV-${next}`,
        customerId: input.customerId,
        issued: input.issued,
        due: input.due,
        status: input.status,
        totalCents: input.totalCents,
        lines: [{ description: input.description, quantity: 1, unitCents: input.totalCents }],
    };
    INVOICES.push(invoice);
    return invoice;
}

export const PAYMENTS: Payment[] = [
    { id: "p_881", invoiceId: "i_2411", method: "transfer", receivedAt: "2026-07-24", amountCents: 480000, status: "settled" },
    { id: "p_882", invoiceId: "i_2412", method: "direct_debit", receivedAt: "2026-07-29", amountCents: 215000, status: "settled" },
    { id: "p_883", invoiceId: "i_2413", method: "card", receivedAt: "2026-08-14", amountCents: 96000, status: "failed" },
    { id: "p_884", invoiceId: "i_2414", method: "transfer", receivedAt: "2026-08-15", amountCents: 165500, status: "pending" },
];

export const EXPENSES: Expense[] = [
    { id: "e_51", vendor: "Cloudscale", category: "Infrastructure", incurred: "2026-08-01", amountCents: 184200, reimbursable: false, submittedBy: "Ravi Chandra", status: "approved", receipt: "cloudscale-2026-08.pdf", notes: "August compute and storage. Up 6% on July after the Orrin onboarding." },
    { id: "e_52", vendor: "Meridian Analytics", category: "Software", incurred: "2026-08-03", amountCents: 29900, reimbursable: false, submittedBy: "Dana Whitfield", status: "approved", receipt: "meridian-invoice-4471.pdf", notes: "Annual seat for the finance dashboard." },
    { id: "e_53", vendor: "Kaldi Coffee", category: "Office", incurred: "2026-08-06", amountCents: 4150, reimbursable: true, submittedBy: "Mei Lin", status: "submitted", receipt: "IMG_2231.jpg", notes: "Client meeting with Alder & Coyle." },
    { id: "e_54", vendor: "Rail & Sleeper", category: "Travel", incurred: "2026-08-09", amountCents: 21800, reimbursable: true, submittedBy: "Joss Kerrigan", status: "submitted", receipt: null, notes: "Return to Manchester for the Pellhaus pilot kickoff. Receipt to follow." },
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

// ---------------------------------------------------------------------------
// The second layer: what sits behind a row once somebody opens it.
//
// Every list above has a detail page, and every detail page has something to
// do — a contact to edit, a payment to record, a schedule to set up. That is
// deliberate: a walkthrough is only worth recording over a flow that goes
// somewhere, and a flat app has nowhere to go.
// ---------------------------------------------------------------------------

export interface Contact {
    id: string;
    customerId: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    /** Who invoices are addressed to. Exactly one per customer. */
    primary: boolean;
}

export const CONTACTS: Contact[] = [
    { id: "ct_priya", customerId: "c_northwind", name: "Priya Raman", email: "priya@northwind.test", role: "Finance Director", phone: "+44 20 7946 0921", primary: true },
    { id: "ct_owen", customerId: "c_northwind", name: "Owen Gallagher", email: "owen@northwind.test", role: "Accounts Payable", phone: "+44 20 7946 0934", primary: false },
    { id: "ct_marcus", customerId: "c_alder", name: "Marcus Vane", email: "marcus@alderco.test", role: "Managing Partner", phone: "+353 1 555 0142", primary: true },
    { id: "ct_sinead", customerId: "c_alder", name: "Sinéad Coyle", email: "sinead@alderco.test", role: "Bookkeeper", phone: "+353 1 555 0147", primary: false },
    { id: "ct_ingrid", customerId: "c_pellhaus", name: "Ingrid Sollberg", email: "ingrid@pellhaus.test", role: "Controller", phone: "+49 30 555 0188", primary: true },
    { id: "ct_tobi", customerId: "c_kestrel", name: "Tobi Adeyemi", email: "tobi@kestrel.test", role: "COO", phone: "+1 415 555 0163", primary: true },
    { id: "ct_elena", customerId: "c_brackwater", name: "Elena Duarte", email: "elena@brackwater.test", role: "Head of Operations", phone: "+34 91 555 0119", primary: true },
    { id: "ct_samuel", customerId: "c_orrin", name: "Samuel Okafor", email: "samuel@orrinhealth.test", role: "CFO", phone: "+1 416 555 0102", primary: true },
    { id: "ct_leah", customerId: "c_orrin", name: "Leah Brandt", email: "leah@orrinhealth.test", role: "Accounts Payable", phone: "+1 416 555 0115", primary: false },
];

export interface CustomerNote {
    id: string;
    customerId: string;
    at: string;
    by: string;
    body: string;
}

export const CUSTOMER_NOTES: CustomerNote[] = [
    { id: "n_1", customerId: "c_northwind", at: "2026-08-02", by: "Dana Whitfield", body: "Five extra seats from August — Priya confirmed by email." },
    { id: "n_2", customerId: "c_northwind", at: "2026-06-19", by: "Ravi Chandra", body: "Renewal signed for another 12 months at the same rate." },
    { id: "n_3", customerId: "c_kestrel", at: "2026-08-15", by: "Dana Whitfield", body: "Card declined on INV-2413. Tobi is getting a new card issued." },
    { id: "n_4", customerId: "c_pellhaus", at: "2026-07-02", by: "Ravi Chandra", body: "Thirty-day pilot. Decision expected mid-September." },
    { id: "n_5", customerId: "c_orrin", at: "2026-08-01", by: "Dana Whitfield", body: "Onboarding services billed separately on INV-2414." },
];

export interface InvoiceEvent {
    at: string;
    what: string;
    who: string;
}

export const INVOICE_ACTIVITY: Record<string, InvoiceEvent[]> = {
    i_2411: [
        { at: "2026-07-01", what: "Issued", who: "Dana Whitfield" },
        { at: "2026-07-01", what: "Sent to priya@northwind.test", who: "Ledgerline" },
        { at: "2026-07-03", what: "Opened by the customer", who: "Priya Raman" },
        { at: "2026-07-24", what: "Paid in full by bank transfer", who: "Ledgerline" },
    ],
    i_2413: [
        { at: "2026-07-14", what: "Issued", who: "Ravi Chandra" },
        { at: "2026-07-14", what: "Sent to tobi@kestrel.test", who: "Ledgerline" },
        { at: "2026-08-14", what: "Card payment failed — declined", who: "Ledgerline" },
        { at: "2026-08-15", what: "Marked overdue", who: "Ledgerline" },
    ],
    i_2415: [
        { at: "2026-08-01", what: "Issued", who: "Dana Whitfield" },
        { at: "2026-08-01", what: "Sent to priya@northwind.test", who: "Ledgerline" },
        { at: "2026-08-04", what: "Opened by the customer", who: "Owen Gallagher" },
    ],
};

export interface ReportSchedule {
    id: string;
    reportId: string;
    cadence: "weekly" | "monthly" | "quarterly";
    day: string;
    recipients: string[];
    nextRun: string;
}

export const REPORT_SCHEDULES: ReportSchedule[] = [
    { id: "s_1", reportId: "r_aging", cadence: "weekly", day: "Monday", recipients: ["dana@northwind.test", "ravi@northwind.test"], nextRun: "2026-09-07" },
    { id: "s_2", reportId: "r_cohort", cadence: "monthly", day: "1st", recipients: ["dana@northwind.test"], nextRun: "2026-10-01" },
];

export interface ReportRun {
    id: string;
    reportId: string;
    ranAt: string;
    trigger: "schedule" | "manual";
    rows: number;
}

export const REPORT_RUNS: ReportRun[] = [
    { id: "run_9031", reportId: "r_aging", ranAt: "2026-08-31 08:00", trigger: "schedule", rows: 6 },
    { id: "run_9024", reportId: "r_aging", ranAt: "2026-08-24 08:00", trigger: "schedule", rows: 6 },
    { id: "run_9017", reportId: "r_aging", ranAt: "2026-08-19 14:12", trigger: "manual", rows: 5 },
    { id: "run_9001", reportId: "r_cohort", ranAt: "2026-08-01 08:00", trigger: "schedule", rows: 4 },
    { id: "run_8998", reportId: "r_churn", ranAt: "2026-08-01 08:00", trigger: "schedule", rows: 1 },
];

export interface ApiKey {
    id: string;
    label: string;
    prefix: string;
    created: string;
    lastUsed: string;
    scopes: string[];
}

export const API_SCOPES = [
    { id: "invoices:read", label: "Read invoices", detail: "List and open invoices and their lines." },
    { id: "invoices:write", label: "Raise invoices", detail: "Create drafts and send them." },
    { id: "payments:read", label: "Read payments", detail: "See what has settled, and what failed." },
    { id: "customers:read", label: "Read customers", detail: "Names, contacts and billing settings." },
    { id: "reports:run", label: "Run reports", detail: "Trigger a report and fetch its rows." },
];

export const API_KEYS: ApiKey[] = [
    { id: "k_live", label: "Production", prefix: "lk_live_9f2a…", created: "2025-11-04", lastUsed: "2 hours ago", scopes: ["invoices:read", "payments:read", "customers:read"] },
    { id: "k_test", label: "Sandbox", prefix: "lk_test_41c8…", created: "2025-11-04", lastUsed: "never", scopes: ["invoices:read", "invoices:write", "payments:read", "customers:read", "reports:run"] },
];

export function contactById(id: string): Contact | undefined {
    return CONTACTS.find((contact) => contact.id === id);
}

export function contactsForCustomer(customerId: string): Contact[] {
    return CONTACTS.filter((contact) => contact.customerId === customerId);
}

export function notesForCustomer(customerId: string): CustomerNote[] {
    return CUSTOMER_NOTES.filter((note) => note.customerId === customerId);
}

export function paymentsForInvoice(invoiceId: string): Payment[] {
    return PAYMENTS.filter((payment) => payment.invoiceId === invoiceId);
}

export function activityForInvoice(invoiceId: string): InvoiceEvent[] {
    return INVOICE_ACTIVITY[invoiceId] ?? [];
}

export function schedulesForReport(reportId: string): ReportSchedule[] {
    return REPORT_SCHEDULES.filter((schedule) => schedule.reportId === reportId);
}

export function runsForReport(reportId: string): ReportRun[] {
    return REPORT_RUNS.filter((run) => run.reportId === reportId);
}

export function runById(id: string): ReportRun | undefined {
    return REPORT_RUNS.find((run) => run.id === id);
}

export function expenseById(id: string): Expense | undefined {
    return EXPENSES.find((expense) => expense.id === id);
}

export function apiKeyById(id: string): ApiKey | undefined {
    return API_KEYS.find((key) => key.id === id);
}
