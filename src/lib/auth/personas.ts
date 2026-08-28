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

export interface Persona {
    userId: string;
    name: string;
    email: string;
    company: string;
    role: Role;
    plan: Plan;
    /** What this one is for, shown beside the button. */
    demonstrates: string;
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
];

/** The persona for an address, when the form was filled from the list. */
export function findPersona(email: string): Persona | undefined {
    const needle = email.trim().toLowerCase();
    return PERSONAS.find((persona) => persona.email === needle);
}
