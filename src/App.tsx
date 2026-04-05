import { useEffect, useRef, useState } from "react";
import { Summary } from "./components/Summary";
import { Footer } from "./components/Footer";
import { LoadingDots } from "./components/LoadingDots";

const REQUEST_TIMEOUT_MS = 8_000;

export default function App() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const sessionRef = useRef({ id: 0, timedOut: false });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const clearRequestTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleSummarize = () => {
    const id = ++sessionRef.current.id;
    sessionRef.current.timedOut = false;

    clearRequestTimeout();
    setLoading(true);
    setError("");

    timeoutRef.current = setTimeout(() => {
      if (sessionRef.current.id !== id) return;
      sessionRef.current.timedOut = true;
      timeoutRef.current = null;
      setLoading(false);
      setError(
        "Request timed out after 8 seconds — no result. This page may have no readable text, or the network or API is slow."
      );
    }, REQUEST_TIMEOUT_MS);

    chrome.runtime.sendMessage({ type: "SUMMARIZE_PAGE" }, (response) => {
      clearRequestTimeout();

      if (sessionRef.current.id !== id) return;
      if (sessionRef.current.timedOut) return;

      if (chrome.runtime.lastError) {
        setError(
          chrome.runtime.lastError.message ?? "Something went wrong"
        );
        setLoading(false);
        return;
      }

      if (response?.success) {
        setError("");
        setSummary(response.data);
      } else {
        setError(
          "Could not summarize this page — no usable text or the summary request failed."
        );
      }

      setLoading(false);
    });
  };

  return (
    <div className="w-[min(100vw,22rem)] px-4 py-4 text-left text-zinc-800 antialiased dark:text-zinc-100">
      <header className="mb-4">
        <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
          AI Summarizer
        </h1>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          Dont need to read the whole Page We are here to Summarize
        </p>
      </header>

      <button
        type="button"
        onClick={handleSummarize}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-zinc-900"
      >
        {loading ? (
          <>
            <span className="transition-opacity">Summarizing</span>
            <LoadingDots />
          </>
        ) : (
          "Summarize page"
        )}
      </button>

      {error && (
        <p
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      )}

      {summary && <Summary text={summary} />}

      <Footer summary={summary} />
    </div>
  );
}
