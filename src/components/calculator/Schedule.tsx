import { formatINR, formatMultiplier, formatSigned } from "@/lib/dahej/format";
import { cn } from "@/lib/utils";
import type { Valuation } from "@/lib/dahej/types";

/**
 * The breakdown, as a registrar's schedule.
 *
 * The original showed a single number and no working. Showing the working is
 * what makes the point land: the reader can see, line by line, that a sarkari
 * naukri outweighed a doctorate. Bars are scaled to the largest absolute share
 * so the dominant factor is unmissable.
 */
const Schedule = ({ valuation }: { valuation: Valuation }) => {
    const peak = Math.max(...valuation.contributions.map((c) => Math.abs(c.share)), 0.0001);

    return (
        <div>
            <div className="flex items-baseline justify-between gap-4">
                <p className="stamp-label">Schedule of assessment</p>
                <p className="stamp-label">16 heads + market index</p>
            </div>

            <table className="mt-4 w-full border-collapse text-left">
                <caption className="sr-only">
                    Every factor in the valuation, its multiplier, and the rupees attributed to it.
                </caption>
                <thead>
                    <tr className="border-y border-border">
                        <th scope="col" className="stamp-label py-2 pr-3 font-medium">
                            Head
                        </th>
                        <th scope="col" className="stamp-label hidden py-2 pr-3 font-medium sm:table-cell">
                            Rate
                        </th>
                        <th scope="col" className="stamp-label py-2 text-right font-medium">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-border/60">
                        <td className="py-2.5 pr-3">
                            <span className="text-sm font-medium text-ink">Base value</span>
                            <span className="block text-xs text-muted-foreground">
                                Every candidate starts here
                            </span>
                        </td>
                        <td className="tabular hidden py-2.5 pr-3 font-mono text-xs text-muted-foreground sm:table-cell">
                            ×1.00
                        </td>
                        <td className="tabular py-2.5 text-right font-mono text-sm text-ink">
                            {formatINR(valuation.base)}
                        </td>
                    </tr>

                    {valuation.contributions.map((row, index) => {
                        const negative = row.rupees < 0;
                        // Heads the answers left at neutral. Still listed — the
                        // form did consider them — but they get no bar and no
                        // emphasis, or four ×1.00 rows drown the real signal.
                        const inert = Math.abs(row.share) < 0.005;
                        const width = `${Math.max(2, (Math.abs(row.share) / peak) * 100)}%`;

                        return (
                            <tr key={row.id} className="border-b border-border/60">
                                <td className="py-2.5 pr-3 align-top">
                                    <span
                                        className={cn(
                                            "text-sm font-medium",
                                            inert ? "text-muted-foreground" : "text-ink",
                                        )}
                                    >
                                        {row.label}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {row.detail}
                                    </span>
                                    {!inert && (
                                        <span
                                            className="mt-1.5 block h-[3px] w-full overflow-hidden rounded-full bg-border/50"
                                            aria-hidden="true"
                                        >
                                            <span
                                                className={cn(
                                                    "block h-full origin-left animate-bar-extend rounded-full",
                                                    negative ? "bg-sindoor" : "bg-violet",
                                                )}
                                                style={{
                                                    width,
                                                    animationDelay: `${Math.min(index * 40, 480)}ms`,
                                                }}
                                            />
                                        </span>
                                    )}
                                </td>
                                <td className="tabular hidden py-2.5 pr-3 align-top font-mono text-xs text-muted-foreground sm:table-cell">
                                    {formatMultiplier(row.multiplier)}
                                </td>
                                <td
                                    className={cn(
                                        "tabular py-2.5 text-right align-top font-mono text-sm",
                                        negative && "text-sindoor",
                                        inert && "text-muted-foreground",
                                        !negative && !inert && "text-ink",
                                    )}
                                >
                                    {formatSigned(row.rupees)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <th scope="row" className="py-3 pr-3 text-left">
                            <span className="font-display text-base font-bold text-ink">
                                Assessed total
                            </span>
                        </th>
                        <td className="hidden sm:table-cell" />
                        <td className="tabular py-3 text-right font-mono text-base font-semibold text-ink">
                            {formatINR(valuation.total)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default Schedule;
