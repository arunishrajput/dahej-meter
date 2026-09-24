/**
 * Indian numbering, done properly.
 *
 * The original formatted with a /\B(?=(\d{3})+(?!\d))/g regex, which groups in
 * thousands: ₹1,200,000. In an app written entirely in Hinglish that is the
 * wrong comma pattern — it should be ₹12,00,000. Intl handles the lakh/crore
 * grouping natively.
 */

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatINR(amount: number): string {
    return `₹${inr.format(Math.round(amount))}`;
}

const CRORE = 10_000_000;
const LAKH = 100_000;

/** "₹1.2 crore" — for headlines, where thirteen digits read as noise. */
export function formatCompact(amount: number): string {
    const value = Math.abs(Math.round(amount));
    const sign = amount < 0 ? "-" : "";
    const trim = (n: number) => (n % 1 === 0 ? n.toFixed(0) : n.toFixed(n < 10 ? 2 : 1));

    if (value >= CRORE) return `${sign}₹${trim(value / CRORE)} crore`;
    if (value >= LAKH) return `${sign}₹${trim(value / LAKH)} lakh`;
    return `${sign}${formatINR(value)}`;
}

/** Line items in the breakdown, where the sign carries the meaning. */
export function formatSigned(amount: number): string {
    const rounded = Math.round(amount);
    if (rounded === 0) return "±₹0";
    return `${rounded > 0 ? "+" : "−"}${formatINR(Math.abs(rounded))}`;
}

export function formatMultiplier(multiplier: number): string {
    return `×${multiplier.toFixed(2)}`;
}
