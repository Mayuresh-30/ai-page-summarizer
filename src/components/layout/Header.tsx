
import { Moon, PanelRightOpen, Sparkles, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type HeaderProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

const Header = ({ isDark, onToggleTheme }: HeaderProps) => {
  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-3 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-[15px] font-semibold leading-5">Moyy Ai</h1>
            <p className="flex items-center gap-1.5 text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
              <PanelRightOpen className="h-3 w-3" />
              Sidebar assistant
            </p>
          </div>
        </div>

        <Button
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="h-9 w-9 border-zinc-200 bg-zinc-50 text-zinc-700 shadow-none hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          onClick={onToggleTheme}
          size="icon"
          type="button"
          variant="outline"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        Ask Moyy about this Page
      </p>
    </header>
  );
};

export default Header;
