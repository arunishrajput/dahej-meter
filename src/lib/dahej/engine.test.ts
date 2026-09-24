import { describe, expect, it } from "vitest";
import { BASE_VALUE, calculate, hashAnswers, tierFor } from "./engine";
import { DEFAULT_ANSWERS, FIELDS } from "./schema";
import type { Answers } from "./types";

const minimal: Answers = {
    education: "no-degree",
    profession: "other",
    govtJob: "no",
    nriStatus: "none",
    socialMediaFollowers: 0,
    land: 0,
    livestock: 0,
    ancestralProperty: "none",
    vehicles: 0,
    familyBusiness: "no",
    cookingSkills: 0,
    traditionValues: 0,
    relativesInGovernment: 0,
    houseServants: 0,
    kundli: "manglik",
    snoreLevel: 100,
};

const maximal: Answers = {
    education: "phd",
    profession: "government",
    govtJob: "yes",
    nriStatus: "west",
    socialMediaFollowers: 100_000,
    land: 20,
    livestock: 15,
    ancestralProperty: "haveli",
    vehicles: 6,
    familyBusiness: "yes",
    cookingSkills: 100,
    traditionValues: 100,
    relativesInGovernment: 10,
    houseServants: 8,
    kundli: "clean",
    snoreLevel: 0,
};

describe("determinism", () => {
    it("returns the same figure for the same answers", () => {
        const runs = Array.from({ length: 10 }, () => calculate(DEFAULT_ANSWERS).total);
        expect(new Set(runs).size).toBe(1);
    });

    it("returns a different figure when an answer changes", () => {
        const before = calculate(DEFAULT_ANSWERS).total;
        const after = calculate({ ...DEFAULT_ANSWERS, govtJob: "yes" }).total;
        expect(after).not.toBe(before);
    });

    it("hashes every field, so no answer is silently ignored", () => {
        const base = hashAnswers(DEFAULT_ANSWERS);
        for (const field of FIELDS) {
            const mutated = { ...DEFAULT_ANSWERS };
            const current = mutated[field.id];
            mutated[field.id] = (
                typeof current === "number" ? current + 1 : `${current}-x`
            ) as never;
            expect(hashAnswers(mutated), field.id).not.toBe(base);
        }
    });
});

describe("range", () => {
    it("keeps the worst case embarrassing but plausible", () => {
        const { total } = calculate(minimal);
        expect(total).toBeGreaterThan(10_000);
        expect(total).toBeLessThan(BASE_VALUE);
    });

    // A perfect-score profile should land in the tens of crores: absurd, but a
    // number a reader can still parse. The original engine's linear chain hit
    // ~31,000 crore, which stops reading as a joke and starts reading as a bug.
    it("keeps the best case a joke rather than a national budget", () => {
        const { total } = calculate(maximal);
        expect(total).toBeGreaterThan(50_000_000);
        expect(total).toBeLessThan(400_000_000);
    });
});

describe("monotonicity", () => {
    it("never pays less for more land", () => {
        let previous = 0;
        for (let land = 0; land <= 20; land += 0.5) {
            // Hold the seed-sensitive mandi wobble aside by comparing the
            // pre-wobble product instead of the rounded total.
            const value = FIELDS.find((f) => f.id === "land")!.multiplier({
                ...DEFAULT_ANSWERS,
                land,
            });
            expect(value).toBeGreaterThanOrEqual(previous);
            previous = value;
        }
    });

    it("penalises snoring, monotonically", () => {
        const field = FIELDS.find((f) => f.id === "snoreLevel")!;
        expect(field.multiplier({ ...DEFAULT_ANSWERS, snoreLevel: 100 })).toBeLessThan(
            field.multiplier({ ...DEFAULT_ANSWERS, snoreLevel: 0 }),
        );
    });
});

describe("breakdown", () => {
    it("reconciles: base plus every line item equals the total", () => {
        for (const answers of [minimal, DEFAULT_ANSWERS, maximal]) {
            const { total, base, contributions } = calculate(answers);
            const summed = contributions.reduce((sum, c) => sum + c.rupees, base);
            expect(Math.abs(summed - total)).toBeLessThan(1);
        }
    });

    it("lists a line item for every field, plus the mandi rate", () => {
        expect(calculate(DEFAULT_ANSWERS).contributions).toHaveLength(FIELDS.length + 1);
    });

    it("reports deductions as negative rupees", () => {
        const { contributions } = calculate({ ...DEFAULT_ANSWERS, snoreLevel: 100 });
        const snore = contributions.find((c) => c.id === "snoreLevel")!;
        expect(snore.multiplier).toBeLessThan(1);
        expect(snore.rupees).toBeLessThan(0);
    });

    it("names a sarkari naukri as the dominant factor when little else applies", () => {
        const { dominant } = calculate({ ...minimal, govtJob: "yes", snoreLevel: 0 });
        expect(dominant.id).toBe("govtJob");
    });

    it("ranks cattle above a doctorate, which is the entire joke", () => {
        const answers: Answers = { ...minimal, education: "phd", livestock: 12 };
        const { contributions } = calculate(answers);
        const rank = (id: string) => contributions.findIndex((c) => c.id === id);
        expect(rank("livestock")).toBeLessThan(rank("education"));
    });
});

// Regression: the market wobble is meant to be +/-8%. An arithmetic slip once
// made it span 0.92x to 2.52x, so "mandi rate index" swamped every real factor
// and became the leading head on most results.
describe("mandi rate index", () => {
    const sample = (): Answers[] => {
        const educations = ["no-degree", "high-school", "bachelors", "masters", "phd"];
        return educations.flatMap((education) =>
            [0, 5, 10, 15, 20].map((land) => ({ ...DEFAULT_ANSWERS, education, land })),
        );
    };

    it("stays inside +/-8%", () => {
        for (const answers of sample()) {
            const mandi = calculate(answers).contributions.find((c) => c.id === "mandi")!;
            expect(mandi.multiplier).toBeGreaterThanOrEqual(0.92);
            expect(mandi.multiplier).toBeLessThanOrEqual(1.08);
        }
    });

    it("never outranks a real factor", () => {
        for (const answers of sample()) {
            expect(calculate(answers).dominant.id).not.toBe("mandi");
        }
    });
});

describe("tiers", () => {
    it("covers the full range without gaps", () => {
        const probes = [0, 1_000, 1_199_999, 1_200_000, 3_500_000, 8_500_000, 20_000_000, 1e12];
        for (const probe of probes) expect(tierFor(probe)).toBeDefined();
    });

    it("escalates with the figure", () => {
        expect(tierFor(1_000).id).toBe("clearance");
        expect(tierFor(2_000_000).id).toBe("negotiable");
        expect(tierFor(5_000_000).id).toBe("respectable");
        expect(tierFor(1e9).id).toBe("dynasty");
    });
});
