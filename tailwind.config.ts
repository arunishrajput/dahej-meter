import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        container: {
            center: true,
            padding: { DEFAULT: "1.25rem", lg: "2rem" },
            screens: { "2xl": "1180px" },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Named tokens, for the places the shadcn contract has no word for.
                ink: "hsl(var(--ink))",
                "ink-soft": "hsl(var(--ink-soft))",
                paper: "hsl(var(--paper))",
                rule: "hsl(var(--rule))",
                violet: "hsl(var(--violet))",
                marigold: "hsl(var(--marigold))",
                sindoor: "hsl(var(--sindoor))",
                foil: "hsl(var(--foil))",
            },
            fontFamily: {
                display: ['"Bricolage Grotesque"', "Georgia", "serif"],
                sans: ['"Public Sans"', '"Noto Sans Devanagari"', "system-ui", "sans-serif"],
                mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 1px)",
                sm: "calc(var(--radius) - 2px)",
            },
            letterSpacing: {
                tightest: "-0.045em",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                // The signature moment: a rubber stamp coming down on the result.
                "stamp-down": {
                    "0%": { opacity: "0", transform: "rotate(-20deg) scale(2.4)" },
                    "60%": { opacity: "1", transform: "rotate(-11deg) scale(0.94)" },
                    "78%": { transform: "rotate(-11deg) scale(1.04)" },
                    "100%": { opacity: "1", transform: "rotate(-11deg) scale(1)" },
                },
                "sheet-settle": {
                    from: { opacity: "0", transform: "translateY(8px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "bar-extend": {
                    from: { transform: "scaleX(0)" },
                    to: { transform: "scaleX(1)" },
                },
                ticker: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "stamp-down": "stamp-down 520ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both",
                "sheet-settle": "sheet-settle 380ms cubic-bezier(0.2, 0.7, 0.3, 1) both",
                "bar-extend": "bar-extend 620ms cubic-bezier(0.2, 0.8, 0.3, 1) both",
                ticker: "ticker 42s linear infinite",
            },
        },
    },
    plugins: [tailwindcssAnimate],
} satisfies Config;
