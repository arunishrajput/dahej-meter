import { Link } from "react-router-dom";
import Guilloche from "@/components/site/Guilloche";

const NotFound = () => (
    <div className="flex min-h-screen flex-col">
        <Guilloche />

        <main className="container flex flex-1 items-center py-24">
            <div className="max-w-lg">
                <p className="stamp-label">Form not on record</p>
                <p className="tabular mt-4 font-display text-7xl font-extrabold leading-none tracking-tightest text-ink">
                    404
                </p>
                <p className="mt-6 text-base leading-relaxed text-ink-soft">
                    No such file exists in this department. Given what the department does, that is
                    arguably the correct outcome.
                </p>
                <Link
                    to="/"
                    className="mt-8 inline-flex h-11 items-center rounded-sm bg-violet px-6 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                    Back to the registrar
                </Link>
            </div>
        </main>
    </div>
);

export default NotFound;
