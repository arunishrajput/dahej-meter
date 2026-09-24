import { Phone, Scale } from "lucide-react";

/**
 * The one section on this site that is not joking.
 *
 * A satire about dowry that ends on a punchline leaves the reader where it
 * found them. The disclaimer this replaces said "just laugh and enjoy" in grey
 * 12px at the top of the page, which is where disclaimers go to be ignored.
 */

const LAW = [
    {
        cite: "Dowry Prohibition Act, 1961 · s.3",
        text: "Giving or taking dowry is a criminal offence, and the law reaches both families — the one that demands and the one that agrees to pay.",
    },
    {
        cite: "Dowry Prohibition Act, 1961 · s.4",
        text: "Merely demanding dowry is itself punishable. No money has to change hands for an offence to have been committed.",
    },
    {
        cite: "Bharatiya Nyaya Sanhita, 2023 · s.85",
        text: "Cruelty by a husband or his relatives, including harassment to coerce a dowry demand, is a criminal offence. This replaced s.498A of the IPC in 2024.",
    },
    {
        cite: "Bharatiya Nyaya Sanhita, 2023 · s.80",
        text: "Where a woman dies unnaturally within seven years of marriage and had faced dowry-related cruelty, the law treats it as dowry death. This replaced s.304B of the IPC.",
    },
];

const HELPLINES = [
    { number: "181", label: "Women Helpline (all-India)" },
    { number: "1091", label: "Women in distress" },
    { number: "112", label: "Emergency response" },
];

const RealityCheck = () => (
    <section id="the-point" className="scroll-mt-8 border-y border-border bg-secondary/40">
        <div className="container py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
                <div className="max-w-2xl">
                    <p className="stamp-label">The part that is not a joke</p>

                    <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tightest text-ink sm:text-4xl">
                        Every number on this site is invented. The practice it is imitating is not.
                    </h2>

                    <div className="mt-6 space-y-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                        <p>
                            Dowry has been illegal in India since 1961, and it continues anyway —
                            renamed as gifts, as "shagun", as what the boy's side simply expects.
                            The National Crime Records Bureau still counts dowry deaths in the
                            thousands every year, and those are only the ones recorded as such.
                        </p>
                        <p>
                            The form you just filled in is absurd because it is honest about what
                            the market weighs. It asks about cattle and land and how well someone
                            cooks, and it never asks whether either person wanted any of this. When
                            the arithmetic feels insulting, that is the arithmetic working exactly
                            as intended.
                        </p>
                    </div>

                    <ul className="mt-10 space-y-5">
                        {LAW.map((entry) => (
                            <li key={entry.cite} className="border-l-2 border-violet/50 pl-4">
                                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-violet">
                                    {entry.cite}
                                </p>
                                <p className="mt-1.5 text-sm leading-relaxed text-ink">
                                    {entry.text}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                        <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>
                            Summarised in plain words, and not legal advice. For anything real,
                            speak to a lawyer or a legal aid service.
                        </span>
                    </p>
                </div>

                <aside className="sheet h-fit p-6 lg:sticky lg:top-8">
                    <p className="stamp-label flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                        If this is not hypothetical
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                        If you or someone you know is facing a dowry demand or harassment, these
                        lines are free and work across India.
                    </p>

                    <ul className="mt-5 divide-y divide-border border-y border-border">
                        {HELPLINES.map((line) => (
                            <li key={line.number} className="flex items-baseline gap-4 py-3">
                                <a
                                    href={`tel:${line.number}`}
                                    className="tabular font-display text-2xl font-extrabold tracking-tight text-violet underline-offset-4 hover:underline"
                                >
                                    {line.number}
                                </a>
                                <span className="text-xs leading-snug text-muted-foreground">
                                    {line.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    </section>
);

export default RealityCheck;
