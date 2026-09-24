import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Field } from "@/lib/dahej/schema";
import type { Answers } from "@/lib/dahej/types";

interface Props {
    field: Field;
    answers: Answers;
    onChange: (value: string | number) => void;
    /** Row number in the section, printed in the margin like a real form. */
    index: number;
}

const FieldControl = ({ field, answers, onChange, index }: Props) => {
    const id = `field-${field.id}`;
    const describedBy = `${id}-aside`;

    return (
        <div className="grid grid-cols-[2rem_1fr] gap-x-3 py-5 sm:grid-cols-[2.5rem_1fr] sm:gap-x-4">
            <span className="stamp-label tabular pt-0.5" aria-hidden="true">
                {String(index).padStart(2, "0")}
            </span>

            <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <Label
                        htmlFor={id}
                        className="font-display text-base font-bold tracking-tight text-ink"
                    >
                        {field.label}
                    </Label>

                    {field.kind === "slider" && (
                        <output
                            htmlFor={id}
                            className="tabular shrink-0 font-mono text-sm font-medium text-violet"
                        >
                            {field.display(answers[field.id] as number)}
                        </output>
                    )}
                </div>

                <p id={describedBy} className="mt-1 text-sm leading-snug text-muted-foreground">
                    {field.aside}
                </p>

                <div className="mt-4">
                    {field.kind === "select" && (
                        <Select
                            value={answers[field.id] as string}
                            onValueChange={onChange}
                        >
                            <SelectTrigger
                                id={id}
                                aria-describedby={describedBy}
                                className="h-11 rounded-sm border-border bg-background font-sans"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-sm">
                                {field.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {field.kind === "choice" && (
                        <div
                            role="radiogroup"
                            aria-label={field.label}
                            aria-describedby={describedBy}
                            id={id}
                            className="inline-flex w-full rounded-sm border border-border p-1 sm:w-auto"
                        >
                            {field.options.map((option) => {
                                const active = answers[field.id] === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        onClick={() => onChange(option.value)}
                                        className={cn(
                                            "flex-1 whitespace-nowrap rounded-[2px] px-4 py-2 text-sm font-medium transition-colors sm:flex-none",
                                            active
                                                ? "bg-violet text-primary-foreground"
                                                : "text-muted-foreground hover:text-foreground",
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {field.kind === "slider" && (
                        <>
                            <Slider
                                id={id}
                                aria-label={field.label}
                                aria-describedby={describedBy}
                                aria-valuetext={field.display(answers[field.id] as number)}
                                value={[answers[field.id] as number]}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                onValueChange={([value]) => onChange(value)}
                                className="py-2"
                            />
                            <div className="mt-2 flex justify-between font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
                                <span>{field.minLabel}</span>
                                <span>{field.maxLabel}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FieldControl;
