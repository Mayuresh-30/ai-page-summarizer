import { AlertCircle } from "lucide-react";

type Props = {
  message: string;
};

export function ErrorState({ message }: Props) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
      <div className="flex items-start gap-3">
        
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

        <div>
          <h3 className="text-sm font-semibold text-red-300">
            Failed to summarize
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-red-200/80">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}