export function Summary({ text }: { text: string }) {
  return (
    <section className="mt-4 rounded-lg border border-zinc-200/80 bg-zinc-50/80 p-3 dark:border-zinc-700 dark:bg-zinc-900/50">
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Summary
      </h2>
      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{text}</p>
    </section>
  );
}
