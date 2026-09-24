import Guilloche from "./Guilloche";

const SiteFooter = () => (
    <footer className="mt-auto">
        <Guilloche className="rotate-180" />

        <div className="container flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="font-display text-lg font-extrabold tracking-tightest text-ink">
                    Dahej Meter
                </p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                    A satire. No valuation here is real, endorsed, or repeatable in front of a
                    magistrate. Nothing you enter leaves your browser.
                </p>
            </div>

            <div className="text-xs text-muted-foreground sm:text-right">
                <p className="tabular font-mono">
                    © {new Date().getFullYear()} · Form 16-D · rev. 3
                </p>
                <p className="mt-1">
                    Built by{" "}
                    <a
                        href="https://github.com/arunishrajput"
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground underline underline-offset-4 hover:text-violet"
                    >
                        Arunish Rajput
                    </a>
                </p>
            </div>
        </div>
    </footer>
);

export default SiteFooter;
