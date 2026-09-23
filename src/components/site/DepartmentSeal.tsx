/**
 * The registrar's seal, as embossed on the top-right of every official form.
 *
 * It exists to fill the masthead's right column with something from the
 * subject's own world rather than an illustration — and the text around the
 * ring is where the bureau admits what it is.
 */
const DepartmentSeal = () => (
    <svg
        viewBox="0 0 200 200"
        className="h-full w-full text-foil"
        role="img"
        aria-label="Seal of the Office of the Registrar of Matrimonial Valuation, established 1961, no authority whatsoever"
    >
        <defs>
            <path
                id="seal-ring"
                d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0"
                fill="none"
            />
        </defs>

        <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />

        {/* Ticks around the ring, like a milled coin edge. */}
        {Array.from({ length: 60 }).map((_, i) => (
            <line
                key={i}
                x1="100"
                y1="14"
                x2="100"
                y2="19"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1"
                transform={`rotate(${i * 6} 100 100)`}
            />
        ))}

        <text
            className="font-mono"
            fill="currentColor"
            fontSize="10.5"
            letterSpacing="2.4"
            textAnchor="middle"
        >
            <textPath href="#seal-ring" startOffset="50%">
                · NO AUTHORITY WHATSOEVER · EST. 1961 · VOID ON ISSUE
            </textPath>
        </text>

        <g textAnchor="middle" fill="currentColor">
            <text x="100" y="88" className="font-display" fontSize="30" fontWeight="800">
                16-D
            </text>
            <text x="100" y="108" className="font-mono" fontSize="8.5" letterSpacing="1.8">
                REGISTRAR OF
            </text>
            <text x="100" y="120" className="font-mono" fontSize="8.5" letterSpacing="1.8">
                MATRIMONIAL
            </text>
            <text x="100" y="132" className="font-mono" fontSize="8.5" letterSpacing="1.8">
                VALUATION
            </text>
        </g>
    </svg>
);

export default DepartmentSeal;
