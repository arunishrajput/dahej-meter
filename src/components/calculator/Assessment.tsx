import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Stamp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculate } from "@/lib/dahej/engine";
import { FIELDS_BY_SECTION } from "@/lib/dahej/schema";
import type { Answers, FactorId } from "@/lib/dahej/types";
import { cn } from "@/lib/utils";
import FieldControl from "./FieldControl";
import RunningTotal from "./RunningTotal";

interface Props {
    answers: Answers;
    onChange: (id: FactorId, value: string | number) => void;
    onSubmit: () => void;
}

const Assessment = ({ answers, onChange, onSubmit }: Props) => {
    const [step, setStep] = useState(0);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const mounted = useRef(false);

    const section = FIELDS_BY_SECTION[step];
    const isLast = step === FIELDS_BY_SECTION.length - 1;

    // Recomputed on every change — the engine is pure and cheap enough to run
    // inline, so the provisional figure never lags the control that moved it.
    const valuation = useMemo(() => calculate(answers), [answers]);

    // Move focus to the new part heading so keyboard and screen-reader users
    // are not left at the bottom of the form after "Continue".
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        headingRef.current?.focus();
    }, [step]);

    return (
        <section
            id="assessment"
            className="container scroll-mt-8 pb-32 pt-16 lg:pb-24 lg:pt-24"
        >
            <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-14">
                <div className="min-w-0">
                    {/* Part rail — a real sequence, so numbering carries meaning. */}
                    <ol className="mb-10 flex flex-wrap gap-x-6 gap-y-2" aria-label="Parts of the form">
                        {FIELDS_BY_SECTION.map((entry, index) => {
                            const state =
                                index === step ? "current" : index < step ? "done" : "upcoming";
                            return (
                                <li key={entry.id}>
                                    <button
                                        type="button"
                                        onClick={() => setStep(index)}
                                        aria-current={index === step ? "step" : undefined}
                                        className={cn(
                                            "group flex items-baseline gap-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
                                            state === "current" && "text-violet",
                                            state === "done" && "text-foreground",
                                            state === "upcoming" && "text-muted-foreground hover:text-foreground",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-block h-1.5 w-1.5 rounded-full",
                                                state === "current" ? "bg-violet" : "bg-border",
                                            )}
                                            aria-hidden="true"
                                        />
                                        Part {String.fromCharCode(65 + index)}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>

                    <div key={section.id} className="animate-sheet-settle">
                        <h2
                            ref={headingRef}
                            tabIndex={-1}
                            className="font-display text-3xl font-extrabold tracking-tightest text-ink outline-none sm:text-4xl"
                        >
                            {section.title}
                        </h2>
                        <p className="devanagari mt-1 text-sm text-muted-foreground">
                            {section.hindi}
                        </p>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                            {section.blurb}
                        </p>

                        <div className="mt-8 divide-y divide-border border-y border-border">
                            {section.fields.map((field, index) => (
                                <FieldControl
                                    key={field.id}
                                    field={field}
                                    answers={answers}
                                    index={index + 1}
                                    onChange={(value) => onChange(field.id, value)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="h-11 rounded-sm font-mono text-xs uppercase tracking-[0.16em] disabled:opacity-0"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>

                        <Button
                            onClick={() => (isLast ? onSubmit() : setStep((s) => s + 1))}
                            className="h-11 rounded-sm px-6 font-mono text-xs font-semibold uppercase tracking-[0.16em]"
                        >
                            {isLast ? "Issue certificate" : `Continue to Part ${String.fromCharCode(66 + step)}`}
                            {isLast ? (
                                <Stamp className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                <aside className="hidden lg:sticky lg:top-8 lg:block">
                    <RunningTotal valuation={valuation} />
                </aside>
            </div>

            <RunningTotal valuation={valuation} variant="bar" />
        </section>
    );
};

export default Assessment;
