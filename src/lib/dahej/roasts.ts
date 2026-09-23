import { FIELD_BY_ID } from "./schema";
import type { Answers, Valuation } from "./types";
import { formatCompact } from "./format";

/**
 * Roasts are rules, not a bag of strings.
 *
 * The original built a list of relevant lines and then picked ONE at random
 * from a pool that also contained six generic filler lines — so a hand-written
 * easter egg (PhD + sarkari naukri) usually lost a coin toss to "Mubarak ho!".
 * Here, specific lines always beat generic ones, and the filler only appears to
 * pad a thin result. Selection is seeded, so a shared link roasts you the same
 * way twice.
 */

interface Roast {
    id: string;
    /** Higher wins. Easter eggs sit at the top. */
    priority: number;
    when: (a: Answers, v: Valuation) => boolean;
    text: (a: Answers, v: Valuation) => string;
}

const ROASTS: Roast[] = [
    // ── Easter eggs ──────────────────────────────────────────────────────────
    {
        id: "jackpot",
        priority: 100,
        when: (a) => a.education === "phd" && a.govtJob === "yes",
        text: () =>
            "PhD *and* sarkari naukri. Somewhere a father-in-law just cancelled three other appointments.",
    },
    {
        id: "nothing",
        priority: 99,
        when: (a) => a.land === 0 && a.relativesInGovernment === 0 && a.govtJob === "no",
        text: () =>
            "No land, no setting, no sarkari naukri. Beta, abhi bhi time hai — ya phir, better idea, abhi bhi choice hai.",
    },
    {
        id: "manglik-nri",
        priority: 98,
        when: (a) => a.kundli === "manglik" && a.nriStatus === "west",
        text: () =>
            "Green card clears immigration but not Mangal. Two pandits are currently reviewing your file.",
    },
    {
        id: "cattle-beats-degree",
        priority: 95,
        when: (_, v) => {
            const rank = (id: string) => v.contributions.findIndex((c) => c.id === id);
            return v.contributions.length > 0 && rank("livestock") < rank("education");
        },
        text: (a) =>
            `Your ${a.livestock} animals out-earned your entire education on this form. Read that back slowly.`,
    },

    // ── Factor-specific ──────────────────────────────────────────────────────
    {
        id: "dominant",
        priority: 80,
        when: (_, v) => v.dominant.id !== "mandi" && Math.abs(v.dominant.share) > 0.15,
        text: (_, v) =>
            `${v.dominant.label} did most of the work here — ${formatCompact(v.dominant.rupees)} of the total. Not your résumé.`,
    },
    {
        id: "govt",
        priority: 70,
        when: (a) => a.govtJob === "yes",
        text: () =>
            "Sarkari naukri detected. The pension outranks the person, as the market intends.",
    },
    {
        id: "tech",
        priority: 55,
        when: (a) => a.profession === "tech" && a.govtJob === "no",
        text: () =>
            "Package is good, but mummy still says 'beta, ek baar government exam de de'. She will say it again at the wedding.",
    },
    {
        id: "zamindar",
        priority: 60,
        when: (a) => a.land > 12,
        text: (a) =>
            `${a.land} acres. Nobody has asked your name yet and the date is already being fixed.`,
    },
    {
        id: "influencer",
        priority: 50,
        when: (a) => a.socialMediaFollowers > 50_000,
        text: () =>
            "Influencer. The in-laws have already asked whether the wedding will 'go on the internet'.",
    },
    {
        id: "cooking",
        priority: 45,
        when: (a) => a.cookingSkills < 30,
        text: () =>
            "Low cooking score — deducted, of course, from exactly one side of this arrangement.",
    },
    {
        id: "snore",
        priority: 45,
        when: (a) => a.snoreLevel > 70,
        text: (_, v) => {
            const snore = v.contributions.find((c) => c.id === "snoreLevel");
            return `Snoring cost you ${formatCompact(Math.abs(snore?.rupees ?? 0))} — the one deduction on this form with any basis in reality.`;
        },
    },
    {
        id: "servants",
        priority: 40,
        when: (a) => a.houseServants >= 4,
        text: (a) =>
            `${a.houseServants} people are employed in your house and somehow it counted as *your* virtue.`,
    },
    {
        id: "dynasty",
        priority: 65,
        when: (_, v) => v.tier.id === "dynasty",
        text: () =>
            "Dynasty grade. A horse has been booked. The horse has not been consulted either.",
    },
    {
        id: "clearance",
        priority: 65,
        when: (_, v) => v.tier.id === "clearance",
        text: () =>
            "Market says: clearance rack. Market is an idiot. Congratulations on the low number.",
    },
];

/** Filler, only used when the rules above produce fewer than three lines. */
const GENERIC = [
    "Your entire worth, according to this form, is a comma placement problem.",
    "Somewhere in a drawing room, this number is being repeated as though it were a fact.",
    "Every figure on this page is made up. So was the original practice.",
    "Assessed in rupees, like a tractor, but with a worse warranty.",
    "The maths checks out. That is the most disturbing part.",
];

export function selectRoasts(answers: Answers, valuation: Valuation, count = 3): string[] {
    const matched = ROASTS.filter((r) => r.when(answers, valuation))
        .sort((a, b) => b.priority - a.priority)
        .map((r) => r.text(answers, valuation));

    // Seeded rotation through the filler, so the same result reads the same way.
    let cursor = valuation.seed % GENERIC.length;
    while (matched.length < count) {
        const line = GENERIC[cursor % GENERIC.length];
        cursor++;
        if (!matched.includes(line)) matched.push(line);
        if (cursor > valuation.seed % GENERIC.length + GENERIC.length) break;
    }

    return matched.slice(0, count);
}

/**
 * The knife twist. Everything the form charged you for is above; this is
 * everything it could not see. Shown verbatim on the result.
 */
export const UNPRICED = [
    { label: "Whether you are kind", value: "not a field" },
    { label: "Whether either of you consented", value: "not a field" },
    { label: "What you are like at 3am in a hospital corridor", value: "not a field" },
    { label: "Whether she wanted to be assessed at all", value: "not a field" },
];

export function unpricedNote(answers: Answers): string {
    const education = FIELD_BY_ID.get("education");
    return `${education?.detail(answers) ?? "Your degree"} was worth less here than your cattle. That is not a bug in this calculator.`;
}
