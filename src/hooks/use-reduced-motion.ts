import { useEffect, useState } from "react";

/**
 * Tracks the user's motion preference live, so a mid-session change in system
 * settings is honoured without a reload.
 */
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(() =>
        typeof window === "undefined"
            ? false
            : window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReduced(query.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    return reduced;
}
