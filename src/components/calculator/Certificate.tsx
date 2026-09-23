import { useMemo, useState } from "react";
import { Check, Link2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Guilloche from "@/components/site/Guilloche";
import { useCountUp } from "@/hooks/use-count-up";
import { calculate } from "@/lib/dahej/engine";
import { formatCompact, formatINR } from "@/lib/dahej/format";
import { selectRoasts, UNPRICED, unpricedNote } from "@/lib/dahej/roasts";
import { resultUrl } from "@/lib/dahej/url";
import type { Answers } from "@/lib/dahej/types";
import Schedule from "./Schedule";
import VoidStamp from "./VoidStamp";

const Certificate = ({ answers, onReset }: { answers: Answers; onReset: () => void }) => {
    const valuation = useMemo(() => calculate(answers), [answers]);
    const roasts = useMemo(() => selectRoasts(answers, valuation), [answers, valuation]);
    const counted = useCountUp(valuation.total);
    const [copied, setCopied] = useState(false);

    const share = async () => {
        const url = resultUrl(answers);
        const text = `This bureau values me at ${formatCompact(valuation.total)}. ${valuation.dominant.label} counted for more than my education. Both facts are the joke.`;

        // navigator.share rejects with AbortError when the sheet is dismissed —
        // a cancellation, not a failure, so it must not fall through to a toast.
        if (navigator.share) {
            try {
                await navigator.share({ title: "Dahej Meter", text, url });
                return;
            } catch (error) {
                if ((error as Error)?.name === "AbortError") return;
            }
        }

        try {
            await navigator.clipboard.writeText(`${text} ${url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2400);
        } catch {
            // Clipboard is unavailable over plain http and in some embeds.
            window.prompt("Copy your result link", `${text} ${url}`);
        }
    };

    return (
        <section id="certificate" className="container scroll-mt-8 py-16 lg:py-24">
            <div className="sheet animate-sheet-settle overflow-hidden">
                <Guilloche />

                {/* ── Head ─────────────────────────────────────────────────── */}
                <div className="relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-14">
                    <VoidStamp />

                    <p className="stamp-label">Certificate of valuation</p>
                    <div className="foil-rule mx-auto mt-3 h-px w-24" />

                    <p
                        className="tabular mt-8 font-display text-[2.5rem] font-extrabold leading-none tracking-tightest text-ink sm:text-6xl lg:text-7xl"
                        aria-live="polite"
                    >
                        {formatINR(counted)}
                    </p>
                    <p className="mt-3 font-mono text-sm text-muted-foreground">
                        {formatCompact(valuation.total)}
                    </p>

                    <div className="mt-8 inline-flex flex-col items-center">
                        <p className="font-display text-xl font-bold tracking-tight text-ink">
                            {valuation.tier.label}
                        </p>
                        <p className="devanagari mt-0.5 text-sm text-marigold">
                            {valuation.tier.hindi}
                        </p>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                            {valuation.tier.blurb}
                        </p>
                    </div>
                </div>

                {/* ── Schedule ─────────────────────────────────────────────── */}
                <div className="border-t border-border px-6 py-10 sm:px-10">
                    <Schedule valuation={valuation} />
                </div>

                {/* ── Not assessed ─────────────────────────────────────────── */}
                <div className="border-t border-border bg-secondary/40 px-6 py-10 sm:px-10">
                    <p className="stamp-label">Not assessed</p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                        {unpricedNote(answers)}
                    </p>

                    <dl className="mt-6 divide-y divide-border/60 border-y border-border/60">
                        {UNPRICED.map((item) => (
                            <div
                                key={item.label}
                                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
                            >
                                <dt className="text-sm text-ink">{item.label}</dt>
                                <dd className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                    {item.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* ── Remarks ──────────────────────────────────────────────── */}
                <div className="border-t border-border px-6 py-10 sm:px-10">
                    <p className="stamp-label">Remarks of the registrar</p>
                    <ul className="mt-4 space-y-4">
                        {roasts.map((roast) => (
                            <li key={roast} className="flex gap-3">
                                <span
                                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-marigold"
                                    aria-hidden="true"
                                />
                                <p className="text-[0.9375rem] leading-relaxed text-ink">{roast}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Actions ──────────────────────────────────────────────── */}
                <div className="flex flex-col gap-3 border-t border-border px-6 py-8 sm:flex-row sm:px-10">
                    <Button
                        onClick={share}
                        className="h-11 flex-1 rounded-sm font-mono text-xs font-semibold uppercase tracking-[0.16em]"
                    >
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Link copied
                            </>
                        ) : (
                            <>
                                <Link2 className="mr-2 h-4 w-4" />
                                Copy result link
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onReset}
                        className="h-11 flex-1 rounded-sm font-mono text-xs font-semibold uppercase tracking-[0.16em]"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Assess again
                    </Button>
                </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
                The link carries your answers, so anyone who opens it sees this exact certificate.
            </p>
        </section>
    );
};

export default Certificate;
