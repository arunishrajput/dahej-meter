import { FIELDS } from "./schema";
import type { Answers, Contribution, Tier, Valuation } from "./types";

/** Every candidate starts here, before the market has an opinion. */
export const BASE_VALUE = 200_000;

export const TIERS: Tier[] = [
    {
        id: "clearance",
        label: "Clearance Rack",
        hindi: "चल जाएगा",
        blurb: "The aunties are already looking at the next profile.",
        min: 0,
    },
    {
        id: "negotiable",
        label: "Negotiable",
        hindi: "बात हो सकती है",
        blurb: "Enough to start the conversation, not enough to end it.",
        min: 1_200_000,
    },
    {
        id: "respectable",
        label: "Respectable Rishta",
        hindi: "अच्छा है",
        blurb: "Your biodata gets forwarded without editing.",
        min: 3_500_000,
    },
    {
        id: "premium",
        label: "Premium Listing",
        hindi: "बहुत बढ़िया",
        blurb: "Three families are currently pretending not to be interested.",
        min: 8_500_000,
    },
    {
        id: "dynasty",
        label: "Dynasty Grade",
        hindi: "राजा बेटा",
        blurb: "A tent, a horse, and 1,200 people who have never met you.",
        min: 20_000_000,
    },
];

/**
 * FNV-1a over the answers. Gives us a stable pseudo-random seed: the same
 * answers always produce the same number, so a shared result is reproducible.
 * The original used Math.random(), which meant two people with identical
 * answers got different figures and nobody could check anyone's homework.
 */
export function hashAnswers(answers: Answers): number {
    const serialised = FIELDS.map((f) => `${f.id}:${answers[f.id]}`).join("|");
    let hash = 0x811c9dc5;
    for (let i = 0; i < serialised.length; i++) {
        hash ^= serialised.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
}

/**
 * The "mandi rate" — a deterministic ±8% wobble, presented as market
 * fluctuation. It is a line item in the breakdown rather than a hidden fudge
 * factor, so the figures on screen always reconcile.
 */
function mandiMultiplier(seed: number): number {
    return 0.92 + (seed % 161) / 1000;
}

export function tierFor(total: number): Tier {
    let match = TIERS[0];
    for (const tier of TIERS) if (total >= tier.min) match = tier;
    return match;
}

/**
 * Turn multipliers into rupees.
 *
 * Because the factors compose multiplicatively, "how much did cattle add?" has
 * no single answer. We attribute in log space: each factor's weight is
 * ln(multiplier), and those weights sum exactly to ln(total / base). Splitting
 * the gain by that ratio means the line items add back up to the total, and a
 * multiplier below 1 falls out naturally as a deduction.
 */
function attribute(
    entries: { id: Contribution["id"]; label: string; detail: string; multiplier: number }[],
    base: number,
    total: number,
): Contribution[] {
    const weights = entries.map((e) => Math.log(Math.max(e.multiplier, 1e-6)));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const absWeight = weights.reduce((sum, w) => sum + Math.abs(w), 0);
    const gain = total - base;

    return entries
        .map((entry, i) => ({
            ...entry,
            rupees: Math.abs(totalWeight) < 1e-9 ? 0 : (gain * weights[i]) / totalWeight,
            share: absWeight < 1e-9 ? 0 : weights[i] / absWeight,
        }))
        .sort((a, b) => Math.abs(b.share) - Math.abs(a.share));
}

export function calculate(answers: Answers): Valuation {
    const seed = hashAnswers(answers);
    const mandi = mandiMultiplier(seed);

    const entries = [
        ...FIELDS.map((field) => ({
            id: field.id as Contribution["id"],
            label: field.label,
            detail: field.detail(answers),
            multiplier: field.multiplier(answers),
        })),
        {
            id: "mandi" as const,
            label: "Mandi rate index",
            detail: `Today's market: ${mandi >= 1 ? "+" : ""}${((mandi - 1) * 100).toFixed(1)}%`,
            multiplier: mandi,
        },
    ];

    const raw = entries.reduce((value, entry) => value * entry.multiplier, BASE_VALUE);
    // Round to the nearest thousand — nobody haggles in rupees at this scale.
    const total = Math.max(1000, Math.round(raw / 1000) * 1000);
    const contributions = attribute(entries, BASE_VALUE, total);

    return {
        total,
        base: BASE_VALUE,
        contributions,
        dominant: contributions[0],
        tier: tierFor(total),
        seed,
    };
}
