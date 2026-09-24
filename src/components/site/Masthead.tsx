import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DepartmentSeal from "./DepartmentSeal";
import Guilloche from "./Guilloche";
import RateTicker from "./RateTicker";
import ThemeToggle from "./ThemeToggle";

const FILE_NO = `DM/${new Date().getFullYear()}/00421`;

const Masthead = ({ onBegin }: { onBegin: () => void }) => (
    <header className="relative">
        <Guilloche />

        <div className="flex items-center justify-between border-b border-border px-5 py-2.5 lg:px-8">
            <p className="stamp-label">Form 16-D · rev. 3</p>
            <div className="flex items-center gap-4">
                <p className="stamp-label tabular hidden sm:block">File no. {FILE_NO}</p>
                <ThemeToggle />
            </div>
        </div>

        <div className="container py-16 lg:py-24">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-16">
            <div className="max-w-3xl">
                <p className="stamp-label mb-5">Government of Nowhere · Department of Arrangements</p>

                <h1 className="font-display text-[2.75rem] font-extrabold leading-[0.95] tracking-tightest text-ink sm:text-6xl lg:text-7xl">
                    Office of the Registrar
                    <br />
                    of{" "}
                    <span className="relative inline-block">
                        Matrimonial
                        <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-marigold/70" />
                    </span>{" "}
                    Valuation
                </h1>

                <p className="mt-3 devanagari text-lg text-muted-foreground">
                    वैवाहिक मूल्यांकन कार्यालय
                </p>

                <p className="mt-8 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                    This bureau prices a human being in rupees, using the criteria the dowry market
                    actually uses. It will tell you what your cattle are worth next to your
                    doctorate. Then it will void its own certificate, because in this country the
                    arithmetic below has been a crime since 1961.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                        size="lg"
                        onClick={onBegin}
                        className="h-12 rounded-sm px-7 font-mono text-xs font-semibold uppercase tracking-[0.16em]"
                    >
                        Begin assessment
                        <ArrowDown className="ml-2 h-4 w-4" />
                    </Button>
                    <a
                        href="#the-point"
                        className="inline-flex h-12 items-center rounded-sm px-4 font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                        Why this exists
                    </a>
                </div>
            </div>

            {/* The docket block that sits top-right on every real form. */}
            <aside className="hidden lg:block">
                <div className="mx-auto w-40 opacity-70">
                    <DepartmentSeal />
                </div>

                <dl className="mt-8 divide-y divide-border border-y border-border text-xs">
                    {[
                        ["Applicant", "—"],
                        ["Assessed on", new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
                        ["Assessing officer", "Automated"],
                        ["Status", "Awaiting entry"],
                    ].map(([term, value]) => (
                        <div key={term} className="flex items-baseline justify-between gap-3 py-2">
                            <dt className="font-mono uppercase tracking-[0.12em] text-muted-foreground">
                                {term}
                            </dt>
                            <dd className="tabular text-right font-mono text-foreground">{value}</dd>
                        </div>
                    ))}
                </dl>
            </aside>
            </div>
        </div>

        <RateTicker />
    </header>
);

export default Masthead;
