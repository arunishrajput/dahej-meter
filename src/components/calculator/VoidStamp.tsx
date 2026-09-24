/**
 * The signature element.
 *
 * The certificate is what the user just spent three parts of a form earning,
 * and this lands on it and cancels it. That undercut is the argument of the
 * whole site, so it gets the only real piece of motion and the only use of
 * sindoor red at size.
 *
 * Placement is bottom-right, where a clerk's stamp actually falls — centring it
 * covers the very figure it is there to void.
 */
const VoidStamp = () => (
    <div className="pointer-events-none absolute bottom-3 right-3 z-10 origin-bottom-right scale-[0.66] select-none sm:bottom-6 sm:right-8 sm:scale-90 lg:scale-100">
        <div
            className="animate-stamp-down rounded-sm border-[3px] border-sindoor/75 px-5 py-2.5 text-center opacity-90 mix-blend-multiply dark:mix-blend-screen"
            role="img"
            aria-label="Certificate marked void under the Dowry Prohibition Act, 1961"
        >
            <p className="devanagari text-lg font-bold leading-none text-sindoor/90">शून्य</p>
            <p className="font-display text-4xl font-extrabold leading-none tracking-[0.18em] text-sindoor/90">
                VOID
            </p>
            <p className="mt-1 font-mono text-[0.5rem] uppercase leading-tight tracking-[0.08em] text-sindoor/75">
                Dowry Prohibition Act, 1961 · s.3
            </p>
        </div>
    </div>
);

export default VoidStamp;
