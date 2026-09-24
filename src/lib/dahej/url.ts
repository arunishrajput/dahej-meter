import { DEFAULT_ANSWERS, FIELDS } from "./schema";
import type { Answers } from "./types";

/**
 * Answers <-> URL.
 *
 * Because the engine is deterministic, encoding the answers in the link makes a
 * shared result reproducible: open someone's link and you see their exact
 * figure and breakdown. Values are positional, so the payload stays short.
 *
 * Decoding treats the input as hostile — links get truncated, hand-edited and
 * mangled by chat apps — and falls back to the default for any field it cannot
 * validate, rather than letting NaN reach the engine.
 */

const VERSION = "1";
const SEPARATOR = "~";

function toBase64Url(input: string): string {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

export function encodeAnswers(answers: Answers): string {
    const payload = FIELDS.map((f) => String(answers[f.id])).join(SEPARATOR);
    return toBase64Url(`${VERSION}${SEPARATOR}${payload}`);
}

export function decodeAnswers(encoded: string | null | undefined): Answers | null {
    if (!encoded) return null;

    let parts: string[];
    try {
        parts = fromBase64Url(encoded).split(SEPARATOR);
    } catch {
        return null;
    }

    const [version, ...values] = parts;
    if (version !== VERSION) return null;

    const answers = { ...DEFAULT_ANSWERS };
    FIELDS.forEach((field, index) => {
        const raw = values[index];
        if (raw === undefined) return;

        if (field.kind === "slider") {
            const parsed = Number(raw);
            if (!Number.isFinite(parsed)) return;
            const clamped = Math.min(field.max, Math.max(field.min, parsed));
            const snapped = field.min + Math.round((clamped - field.min) / field.step) * field.step;
            // Re-round: floating point steps like 0.5 accumulate visible dust.
            (answers[field.id] as number) = Math.round(snapped * 100) / 100;
        } else if (field.options.some((o) => o.value === raw)) {
            (answers[field.id] as string) = raw;
        }
    });

    return answers;
}

export function resultUrl(answers: Answers, origin?: string): string {
    const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
    return `${base}/?r=${encodeAnswers(answers)}`;
}
