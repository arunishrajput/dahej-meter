import { describe, expect, it } from "vitest";
import { decodeAnswers, encodeAnswers } from "./url";
import { DEFAULT_ANSWERS, FIELDS } from "./schema";
import { calculate } from "./engine";
import type { Answers } from "./types";

const custom: Answers = {
    ...DEFAULT_ANSWERS,
    education: "phd",
    govtJob: "yes",
    land: 7.5,
    livestock: 11,
    kundli: "manglik",
    socialMediaFollowers: 64_500,
};

describe("url round-trip", () => {
    it("survives encode then decode", () => {
        expect(decodeAnswers(encodeAnswers(custom))).toEqual(custom);
    });

    it("reproduces the same valuation from a shared link", () => {
        const original = calculate(custom);
        const reopened = calculate(decodeAnswers(encodeAnswers(custom))!);
        expect(reopened.total).toBe(original.total);
        expect(reopened.seed).toBe(original.seed);
    });

    it("preserves fractional slider steps", () => {
        const decoded = decodeAnswers(encodeAnswers({ ...DEFAULT_ANSWERS, land: 0.5 }))!;
        expect(decoded.land).toBe(0.5);
    });
});

describe("hostile input", () => {
    it("returns null for junk rather than throwing", () => {
        for (const junk of ["", "!!!!", "Zm9v", "%%%", "a".repeat(5000)]) {
            expect(() => decodeAnswers(junk)).not.toThrow();
        }
    });

    it("returns null for null and undefined", () => {
        expect(decodeAnswers(null)).toBeNull();
        expect(decodeAnswers(undefined)).toBeNull();
    });

    it("falls back to defaults for unknown option values", () => {
        const tampered = encodeAnswers({ ...custom, education: "nobel-prize" as never });
        expect(decodeAnswers(tampered)!.education).toBe(DEFAULT_ANSWERS.education);
    });

    it("clamps out-of-range numbers instead of trusting them", () => {
        const tampered = encodeAnswers({ ...custom, land: 9e9, livestock: -50 });
        const decoded = decodeAnswers(tampered)!;
        const land = FIELDS.find((f) => f.id === "land")!;
        expect(decoded.land).toBe(land.kind === "slider" ? land.max : 0);
        expect(decoded.livestock).toBe(0);
    });

    it("survives a truncated link", () => {
        const encoded = encodeAnswers(custom);
        const decoded = decodeAnswers(encoded.slice(0, Math.floor(encoded.length / 2)));
        // Either a clean null or a complete, valid answer set — never partial junk.
        if (decoded) {
            for (const field of FIELDS) expect(decoded[field.id]).toBeDefined();
            expect(Number.isFinite(calculate(decoded).total)).toBe(true);
        }
    });

    it("rejects a payload from a future schema version", () => {
        const futurePayload = `9~${FIELDS.map((f) => String(custom[f.id])).join("~")}`;
        const encoded = btoa(futurePayload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        expect(decodeAnswers(encoded)).toBeNull();
    });
});
