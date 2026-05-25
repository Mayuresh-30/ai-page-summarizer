
import { Moon, Sparkles, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type HeaderProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

const Header = ({ isDark, onToggleTheme }: HeaderProps) => {
  return (
    <header className="border-b border-zinc-200 bg-white/95 px-4 py-3 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />
          </span>
          <div>
            <h1 className="text-base font-semibold leading-5">Moyy Ai</h1>
            <p className="text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
              Page assistant
            </p>
          </div>
        </div>

        <Button
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          onClick={onToggleTheme}
          size="icon"
          type="button"
          variant="outline"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>

      <p className="mt-3 text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Ask Moyy about this Page
      </p>
    </header>
  );
};

export default Header;
