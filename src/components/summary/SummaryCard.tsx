type Props = {
  summary: string;
};

export function SummaryCard({ summary }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
      
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">
          AI Summary
        </h2>

        <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] font-medium text-violet-300">
          Generated
        </span>
      </div>

      <p className="text-sm leading-7 text-zinc-300">
        {summary}
      </p>
    </div>
  );
}