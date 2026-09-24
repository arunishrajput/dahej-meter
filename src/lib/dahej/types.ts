/**
 * Core types for the (entirely satirical) valuation engine.
 *
 * The whole point of this app is that the numbers are grotesque. The code that
 * produces them, however, should not be: the engine is pure, deterministic and
 * testable, and every rupee it reports can be traced back to a named factor.
 */

export interface Answers {
    // Part A — the candidate
    education: string;
    profession: string;
    govtJob: string;
    nriStatus: string;
    socialMediaFollowers: number;
    // Part B — zameen, jaayadaad, janwar
    land: number;
    livestock: number;
    ancestralProperty: string;
    vehicles: number;
    familyBusiness: string;
    // Part C — the "sanskaar" audit
    cookingSkills: number;
    traditionValues: number;
    relativesInGovernment: number;
    houseServants: number;
    kundli: string;
    snoreLevel: number;
}

export type FactorId = keyof Answers;

export type SectionId = "candidate" | "assets" | "sanskaar";

/** One factor's share of the final number, as shown in the breakdown. */
export interface Contribution {
    id: FactorId | "mandi";
    label: string;
    /** What the candidate actually answered, humanised. */
    detail: string;
    /** The raw multiplier this factor applied (1 = no effect). */
    multiplier: number;
    /** Rupees attributed to this factor. Negative means it cost you money. */
    rupees: number;
    /** Signed share of the total movement, in [-1, 1]. Used for bar widths. */
    share: number;
}

export interface Tier {
    id: string;
    label: string;
    hindi: string;
    blurb: string;
    /** Inclusive lower bound, in rupees. */
    min: number;
}

export interface Valuation {
    /** Final, rounded figure in rupees. */
    total: number;
    /** The starting figure every candidate is worth before any factor applies. */
    base: number;
    /** Every factor, sorted by absolute impact, biggest first. */
    contributions: Contribution[];
    /** The single factor that moved the number most. The punchline. */
    dominant: Contribution;
    tier: Tier;
    /** Stable hash of the answers. Same answers in, same number out. */
    seed: number;
}
