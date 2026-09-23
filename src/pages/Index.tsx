import { useCallback, useEffect, useState } from "react";
import Assessment from "@/components/calculator/Assessment";
import Certificate from "@/components/calculator/Certificate";
import Masthead from "@/components/site/Masthead";
import RealityCheck from "@/components/site/RealityCheck";
import SiteFooter from "@/components/site/SiteFooter";
import { DEFAULT_ANSWERS } from "@/lib/dahej/schema";
import { decodeAnswers, encodeAnswers } from "@/lib/dahej/url";
import type { Answers, FactorId } from "@/lib/dahej/types";

const Index = () => {
    // A shared link opens straight on the certificate it encodes.
    const [shared] = useState(() =>
        typeof window === "undefined"
            ? null
            : decodeAnswers(new URLSearchParams(window.location.search).get("r")),
    );

    const [answers, setAnswers] = useState<Answers>(shared ?? DEFAULT_ANSWERS);
    const [issued, setIssued] = useState(Boolean(shared));

    const update = useCallback((id: FactorId, value: string | number) => {
        setAnswers((previous) => ({ ...previous, [id]: value }));
    }, []);

    const scrollTo = (selector: string) => {
        document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const issue = () => {
        setIssued(true);
        // Put the answers in the address bar so a reload, a bookmark or a
        // pasted link all reproduce this exact certificate.
        window.history.replaceState(null, "", `?r=${encodeAnswers(answers)}`);
    };

    const reset = () => {
        setIssued(false);
        window.history.replaceState(null, "", window.location.pathname);
        scrollTo("#assessment");
    };

    // Scroll to the certificate once it has actually rendered.
    useEffect(() => {
        if (issued && !shared) scrollTo("#certificate");
    }, [issued, shared]);

    return (
        <div className="flex min-h-screen flex-col">
            <a
                href="#assessment"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-violet focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
            >
                Skip to the form
            </a>

            <Masthead onBegin={() => scrollTo("#assessment")} />

            <main>
                {issued ? (
                    <Certificate answers={answers} onReset={reset} />
                ) : (
                    <Assessment answers={answers} onChange={update} onSubmit={issue} />
                )}

                <RealityCheck />
            </main>

            <SiteFooter />
        </div>
    );
};

export default Index;
