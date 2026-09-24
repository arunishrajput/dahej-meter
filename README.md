# Dahej Meter

**A satirical valuation bureau for human beings — which voids its own certificate.**

You fill in a government-looking form. It prices you in rupees using the criteria the
dowry market actually uses: land, cattle, a sarkari naukri, how well you cook, how many
relatives are "in service". Then it shows you the working, line by line, so you can see
exactly which of those outweighed your education. Then it stamps the certificate VOID
under the Dowry Prohibition Act, 1961.

The joke is the ranking. The ranking is real.

---

## What it does

- **16 weighted factors** across three parts of a form, each with an honest breakdown of
  what it contributed in rupees.
- **A live provisional figure** that moves as you drag a slider — watching a number for a
  person go up in real time is the point.
- **A schedule of assessment** showing every factor's multiplier and rupee attribution,
  sorted by impact. Deductions are shown in red. The totals reconcile.
- **Roasts that actually match your answers**, chosen by rule and priority rather than at
  random.
- **A "not assessed" section** listing what the form could not see.
- **A reality check** with the relevant law and working helpline numbers.
- **Shareable, reproducible results** — the link carries your answers, so anyone who opens
  it sees your exact certificate.

## Running it

```sh
git clone https://github.com/arunishrajput/dahej-meter.git
cd dahej-meter
npm install
npm run dev          # http://localhost:8080
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm test` | Run the engine and URL test suites |
| `npm run typecheck` | Typecheck without emitting |
| `npm run lint` | ESLint |

## How the valuation works

The scoring lives in `src/lib/dahej/` and is pure, deterministic and covered by tests. No
React, no DOM, no randomness.

- **`schema.ts`** — the single source of truth. Every factor is one object holding its
  label, its control type, and its multiplier function. The form renders from it and the
  engine scores from it, so adding a factor is one edit in one file.
- **`engine.ts`** — turns answers into a valuation. Factors compose multiplicatively on a
  base of ₹2,00,000.
- **`roasts.ts`** — rule-based remarks. Specific lines always beat generic filler.
- **`url.ts`** — compact, validated encoding of answers into a shareable link.

Two decisions worth explaining:

**It is deterministic.** The same answers always produce the same figure. A seeded hash of
the answers drives a ±8% "mandi rate index", which appears as a visible line item rather
than a hidden fudge factor. Previously a `Math.random()` call meant two people with
identical answers got different numbers and no result could be checked or meaningfully
shared.

**The breakdown reconciles.** Because factors multiply, "how much did the cattle add?" has
no obvious answer. Each factor is attributed in log space — its weight is `ln(multiplier)`,
and those weights sum exactly to `ln(total / base)`. Splitting the gain by that ratio means
the line items add back up to the total, and a multiplier below 1 falls out naturally as a
deduction. That is why the schedule column sums correctly.

Curves use diminishing returns (`sqrt`) on countable assets. A perfect-score profile lands
in the tens of crores — absurd, but still a number you can read.

## Design

Built on the visual language the subject actually comes from: judicial stamp paper (pale
sage, not cream), the violet of cyclostyle duplicating ink, marigold and gold foil from
wedding cards, and sindoor red reserved for the void stamp and deductions. Bricolage
Grotesque for display, Public Sans for body, IBM Plex Mono for every figure.

Dark mode is the same office after hours. Reduced motion is respected throughout — there
is no confetti, because the number is not a prize.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Vitest

## Disclaimer

Satire. Nothing here is a real valuation, a real rate, or legal advice, and nothing you
enter leaves your browser.

Dowry has been illegal in India since the Dowry Prohibition Act, 1961 — giving it, taking
it, and merely demanding it. If any of this is not hypothetical for you: **181** (Women
Helpline), **1091** (women in distress), **112** (emergency).

---

Built by [Arunish Rajput](https://github.com/arunishrajput).
