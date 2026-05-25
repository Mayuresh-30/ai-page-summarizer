import { Copy } from "lucide-react";

type Props = {
  summary: string;
};

export function SummaryAction({ summary }: Props) {
  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
  };

  return (
    <button
      onClick={copySummary}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-violet-500 hover:bg-violet-500/10"
    >
      <Copy className="h-4 w-4" />
      Copy Summary
    </button>
  );
}