import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/60 px-6 py-10 text-center">
      
      <div className="mb-4 rounded-2xl bg-violet-500/10 p-3">
        <Sparkles className="h-6 w-6 text-violet-400" />
      </div>

      <h2 className="text-sm font-semibold text-white">
        Ready to summarize
      </h2>

      <p className="mt-2 text-xs leading-relaxed text-zinc-400">
        Open an article, blog, or documentation page and generate an instant AI summary.
      </p>
    </div>
  );
}