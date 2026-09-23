import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatCompact, formatINR } from "@/lib/dahej/format";
import { cn } from "@/lib/utils";
import type { Valuation } from "@/lib/dahej/types";

/**
 * A provisional figure that updates as the form is filled.
 *
 * This is the reason the engine had to become deterministic and cheap: it now
 * runs on every keystroke and drag, so you watch a slider move the price of a
 * person in real time. That discomfort is the design intent.
 */
const RunningTotal = ({
    valuation,
    variant = "panel",
}: {
    valuation: Valuation;
    /** "bar" is the compact mobile version, pinned above the thumb. */
    variant?: "panel" | "bar";
}) => {
    const previous = useRef(valuation.total);
    const [direction, setDirection] = useState<"up" | "down" | null>(null);

    useEffect(() => {
        if (valuation.total === previous.current) return;
        setDirection(valuation.total > previous.current ? "up" : "down");
        previous.current = valuation.total;
        const timer = setTimeout(() => setDirection(null), 700);
        return () => clearTimeout(timer);
    }, [valuation.total]);

    const Arrow = direction === "down" ? TrendingDown : TrendingUp;

    if (variant === "bar") {
        return (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm lg:hidden">
                <div className="flex items-center justify-between gap-4 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
                    <div className="min-w-0">
                        <p className="stamp-label">Provisional</p>
                        <p
                            className="tabular truncate font-display text-xl font-extrabold leading-tight tracking-tightest text-ink"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {formatINR(valuation.total)}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-right">
                        <div className="min-w-0">
                            <p className="stamp-label">Leading</p>
                            <p className="truncate text-xs font-medium text-ink">
                                {valuation.dominant.label}
                            </p>
                        </div>
                        {direction && (
                            <Arrow
                                className={cn(
                                    "h-3.5 w-3.5 shrink-0",
                                    direction === "up" ? "text-marigold" : "text-sindoor",
                                )}
                                aria-hidden="true"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sheet p-5">
            <p className="stamp-label">Provisional valuation</p>

            <p
                className="tabular mt-3 font-display text-3xl font-extrabold leading-none tracking-tightest text-ink"
                aria-live="polite"
                aria-atomic="true"
            >
                {formatINR(valuation.total)}
            </p>

            <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                    {formatCompact(valuation.total)}
                </span>
                {direction && (
                    <Arrow
                        className={cn(
                            "h-3.5 w-3.5",
                            direction === "up" ? "text-marigold" : "text-sindoor",
                        )}
                        aria-hidden="true"
                    />
                )}
            </div>

            <div className="hairline mt-4 pt-4">
                <p className="stamp-label mb-1.5">Leading factor</p>
                <p className="text-sm font-medium text-ink">{valuation.dominant.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    {valuation.dominant.detail}
                </p>
            </div>

            <p className="mt-4 text-xs leading-snug text-muted-foreground">
                Not binding. Not legal. Not a real assessment of anybody.
            </p>
        </div>
    );
};

export default RunningTotal;
