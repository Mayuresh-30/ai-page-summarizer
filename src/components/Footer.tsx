export function Footer({ summary }: { summary: string }) {
  const copy = () => {
    void navigator.clipboard.writeText(summary);
  };

  if (!summary) return null;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={copy}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-violet-300 hover:bg-violet-50/80 hover:text-violet-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-violet-500 dark:hover:bg-violet-950/40 dark:hover:text-violet-200"
      >
        Copy summary
      </button>
    </div>
  );
}
