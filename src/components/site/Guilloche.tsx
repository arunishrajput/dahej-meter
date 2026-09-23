/**
 * The engine-turned border printed along the top of security paper. Purely
 * decorative, so it is hidden from assistive tech — but it is the single
 * cheapest cue that says "official document" before a word is read.
 */
const Guilloche = ({ className = "" }: { className?: string }) => (
    <svg
        aria-hidden="true"
        className={`h-3 w-full text-foil ${className}`}
        preserveAspectRatio="none"
        viewBox="0 0 240 12"
    >
        <defs>
            <pattern id="guilloche" width="24" height="12" patternUnits="userSpaceOnUse">
                <path
                    d="M0 6 Q6 0 12 6 T24 6 M0 6 Q6 12 12 6 T24 6"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.55"
                    strokeWidth="0.8"
                />
                <circle cx="12" cy="6" r="1.1" fill="currentColor" fillOpacity="0.35" />
            </pattern>
        </defs>
        <rect width="240" height="12" fill="url(#guilloche)" />
    </svg>
);

export default Guilloche;
