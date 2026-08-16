# Ledgerline

A fake B2B invoicing product. It exists to be **read and watched by Oorb** —
nothing here is real, and nothing is meant to be.

Two Oorb pipelines need different things from it, which is why it is shaped the
way it is:

- **The App Map** reads this repository over the GitHub API. That is why it is
  public, and why every gate is written as a plain condition a reader can quote.
- **Signals** watches it in a browser. That is why exactly one control is
  broken, and why the forms are longer than they need to be.

## Running it

```bash
npm install
npm run dev        # http://localhost:3001
```

**There is no login.** Open any URL and you are already an owner on the top
plan, so every screen works on a fresh browser — a login wall is a minute of
nothing at the front of every demo.

The gates are still real. To see one refuse you, go to `/sign-in` (linked as
"Switch role or plan" in the sidebar) and become a member on the free plan.

## Pointing it at Oorb Signals

Create `.env.local`:

```
NEXT_PUBLIC_OORB_KEY=pk_your_project_key
NEXT_PUBLIC_OORB_SRC=http://localhost:3000/o.js
```

With either unset the script tag is not rendered at all, so the repo carries no
key of its own.

## What is deliberately here

**Gates, in four shapes**, so anything reading the code has more than one
pattern to recognise:

| Screen | Condition |
| --- | --- |
| everything under `(app)` | `requireSession()` — redirects when signed out |
| `/admin/*` | `session.role !== "owner"`, once, in the layout |
| `/forecasting` | `session.plan !== "scale"` — names the plan |
| `/reports/[reportId]` | `planAtLeast(session.plan, report.minimumPlan)` — compares rank |
| `/settings/api-keys` | plan **and** role, checked in that order |
| `/settings/team`, `/invoices/new` | `session.role === "member"` |

Settings and admin gate at opposite levels on purpose. Admin is owner work
throughout, so one layout gate covers it and a new screen cannot forget. Settings
is open to everyone, so the two screens that are not hold their own gates —
a blanket refusal there would take Profile away from a member too.

**Navigation nobody's route file mentions.** The hrefs live in
`src/components/nav/nav-items.ts`, imported by `sidebar.tsx`, rendered by
`(app)/layout.tsx`. List screens hold no href either — the `<Link>` is inside
`RowLink`. Both are the normal shape of a real app, and both mean a reader has
to follow imports rather than read one file per screen.

**One broken control.** The Export button (`data-testid="export-button"`)
renders, depresses and does nothing. Everything else goes somewhere. That
contrast is the whole value: if several things were dead, a rage-click would
stop meaning anything.

**Forms worth abandoning** on `/sign-up`, `/invoices/new` and
`/settings/notifications` — a form somebody starts and leaves is the only way to
produce a form-abandon signal.

## What is deliberately not here

No database. Every figure is a fixture in `src/lib/data/fixtures.ts`, and the
numbers are stable rather than random: a value that changed on refresh would
look like a live counter and hide the one control that is genuinely broken.

No real authentication. The session is a cookie the sign-in form writes, trusted
completely. The point is to have screens that gate, not a login worth attacking.
