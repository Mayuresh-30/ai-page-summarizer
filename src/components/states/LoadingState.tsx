export function LoadingState() {
  return (
    <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="space-y-3 animate-pulse">
        <div className="h-4 w-1/3 rounded bg-zinc-700" />
        <div className="h-3 w-full rounded bg-zinc-800" />
        <div className="h-3 w-5/6 rounded bg-zinc-800" />
        <div className="h-3 w-4/6 rounded bg-zinc-800" />
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        AI is analyzing the page content...
      </p>
    </div>
  );
}