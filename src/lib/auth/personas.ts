import type { Plan, Role } from "./session";

/**
 * People to be, across several customers.
 *
 * WHY MORE THAN ONE COMPANY. Oorb resolves the company a visitor belongs to
 * from their email DOMAIN, so a single persona could only ever demonstrate the
 * happy path. These four cover every case that resolution has:
 *
 * - `dana@northwind.test` — a contact Oorb knows, at a company it knows.
 * - `marcus@northwind.test` — a colleague at the same company, so two people's
 *   friction rolls up to one account.
 * - `newstarter@saltmarsh.test` — nobody Oorb has been told about, at a domain
 *   it recognises: the company resolves, the contact stays null.
 * - `someone@gmail.com` — a personal address, which matches nothing and must
 *   stay unmatched rather than being guessed at.
 *
 * The emails use `.test`, which is reserved by RFC 2606 and can never be a real
 * domain — nothing here can accidentally address a live person.
 */

/** A customer workspace a person can act inside. */
export interface Account {
    /** The app's own id — what `identify({ account: { id } })` sends. */
    id: string;
    domain: string;
    name: string;
}

export interface Persona {
    userId: string;
    name: string;
    email: string;
    company: string;
    role: Role;
    plan: Plan;
    /** What this one is for, shown beside the button. */
    demonstrates: string;
    /**
     * Workspaces this person can switch between. Only the consultant has
     * these: an ordinary user's single company is implied by their email, and
     * leaving `accounts` off is what keeps those personas exercising the
     * domain-resolution path rather than the account-hint one.
     */
    accounts?: Account[];
}

export const PERSONAS: Persona[] = [
    {
        userId: "u_1",
        name: "Dana Whitfield",
        email: "dana@northwind.test",
        company: "Northwind Freight",
        role: "owner",
        plan: "scale",
        demonstrates: "A known contact at a known company",
    },
    {
        userId: "u_2",
        name: "Marcus Reed",
        email: "marcus@northwind.test",
        company: "Northwind Freight",
        role: "member",
        plan: "scale",
        demonstrates: "A colleague — same company, second person",
    },
    {
        userId: "u_3",
        name: "Priya Nair",
        email: "newstarter@saltmarsh.test",
        company: "Saltmarsh Analytics",
        role: "admin",
        plan: "growth",
        demonstrates: "Unknown person, known domain — company only",
    },
    {
        userId: "u_4",
        name: "Sam Okafor",
        email: "someone@gmail.com",
        company: "—",
        role: "member",
        plan: "free",
        demonstrates: "Personal address — matches nothing",
    },
    /**
     * Nothing in Oorb at all: a person from a company nobody has added. The
     * case a brand-new sign-up is — and the one Oorb has to PROMPT about,
     * because no domain match can quietly file them anywhere.
     */
    {
        userId: "u_6",
        name: "Tomas Reyes",
        email: "tomas@harborlight.test",
        company: "Harborlight Shipping",
        role: "owner",
        plan: "growth",
        demonstrates: "Unknown person, unknown company — nothing in Oorb yet",
    },
    /**
     * The case that breaks email-domain resolution. One address, working
     * inside two different customers' workspaces; `brightconsulting.test`
     * is nobody's company. Oorb has to be TOLD which workspace is open.
     */
    {
        userId: "u_5",
        name: "Alex Chen",
        email: "alex@brightconsulting.test",
        company: "Bright Consulting",
        role: "admin",
        plan: "scale",
        demonstrates: "A consultant inside two customers' workspaces",
        accounts: [
            { id: "ws_northwind", domain: "northwind.test", name: "Northwind Freight" },
            { id: "ws_levis", domain: "levis.test", name: "Levis" },
        ],
    },
];

/** The persona for an address, when the form was filled from the list. */
export function findPersona(email: string): Persona | undefined {
    const needle = email.trim().toLowerCase();
    return PERSONAS.find((persona) => persona.email === needle);
}
