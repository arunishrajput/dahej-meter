import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const next = resolvedTheme === "dark" ? "light" : "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-sm text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(next)}
            aria-label={`Switch to ${next} mode`}
        >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
        </Button>
    );
};

export default ThemeToggle;
