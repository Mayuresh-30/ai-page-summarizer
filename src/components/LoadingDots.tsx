export function LoadingDots() {
  return (
    <span
      className="inline-flex items-end gap-1 py-0.5"
      aria-hidden
    >
      <span className="loading-dot loading-dot-1" />
      <span className="loading-dot loading-dot-2" />
      <span className="loading-dot loading-dot-3" />
    </span>
  );
}
