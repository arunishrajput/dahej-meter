const RATES = [
    "MBBS +12%",
    "Sarkari naukri (Grade B) +240%",
    "PhD +35%",
    "Buffalo, milch, per head +16%",
    "Startup equity — not accepted",
    "Green card +60%",
    "Manglik −25%",
    "Snoring, audible from corridor −35%",
    "Cooking, graded out of 100 — asked of one side only",
    "Acreage, irrigated +34%",
    "Government uncle, per uncle +32%",
    "Kindness — no quoted rate",
];

/**
 * A mandi board for human beings. The joke is the register: these are real
 * commodity-ticker conventions applied to people, with two entries at the end
 * that refuse to play along.
 */
const RateTicker = () => {
    const line = RATES.join("   ·   ");

    return (
        <div
            className="group relative overflow-hidden border-y border-border bg-secondary/60 py-2"
            role="marquee"
            aria-label="Today's indicative rates, all of them invented"
        >
            <div className="flex w-max animate-ticker whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground motion-reduce:animate-none group-hover:[animation-play-state:paused]">
                <span className="px-6">
                    <span className="text-marigold">Today's rates</span> · {line} ·{" "}
                </span>
                <span className="px-6" aria-hidden="true">
                    <span className="text-marigold">Today's rates</span> · {line} ·{" "}
                </span>
            </div>
        </div>
    );
};

export default RateTicker;
