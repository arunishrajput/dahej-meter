import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Counts a figure up on reveal — a valuation should arrive the way a total
 * arrives on a machine, not appear fully formed. Snaps straight to the target
 * when the user has asked for reduced motion.
 */
export function useCountUp(target: number, duration = 1100): number {
    const reduced = useReducedMotion();
    const [value, setValue] = useState(reduced ? target : 0);
    const frame = useRef<number>();

    useEffect(() => {
        if (reduced) {
            setValue(target);
            return;
        }

        const start = performance.now();
        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            // Ease-out quint: fast arrival, long settle. Reads as a counter
            // slowing down rather than a linear crawl.
            const eased = 1 - Math.pow(1 - progress, 5);
            setValue(Math.round(target * eased));
            if (progress < 1) frame.current = requestAnimationFrame(tick);
        };

        frame.current = requestAnimationFrame(tick);
        return () => {
            if (frame.current) cancelAnimationFrame(frame.current);
        };
    }, [target, duration, reduced]);

    return value;
}
