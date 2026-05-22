import { useEffect, useRef, useState } from "react";
import { Summary } from "./components/Summary";
import { Footer } from "./components/Footer";
import { LoadingDots } from "./components/LoadingDots";
import useTheme from "./hooks/useTheme";

const REQUEST_TIMEOUT_MS = 8_000;

export default function App() {
  const { theme } = useTheme();
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
        setError(chrome.runtime.lastError.message ?? "Something went wrong");
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
    <div className={`sidebar-root panel-surface ${theme === "dark" ? "dark" : ""}`}>
      <div className="sidebar-header">
        <div className="brand-badge">
          <div className="brand-mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <rect width="24" height="24" rx="8" fill="url(#g)" />
              <path d="M8 12.5L11 15.5L16 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="brand-copy">
            <p className="brand-title">AI Summarizer</p>
            <p className="brand-subtitle">Clean page summaries in a single tap.</p>
          </div>
        </div>

        <ThemeButton />
      </div>

      <main className="sidebar-main">
        <div className="intro-card">
          <p className="intro-copy">
            Quickly summarize the active page and keep the result in a premium, easy-to-read card.
          </p>
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={handleSummarize}
            disabled={loading}
            className="primary-button"
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
        </div>

        {error && (
          <div className="alert-card" role="alert">
            {error}
          </div>
        )}

        {summary ? (
          <Summary text={summary} />
        ) : (
          <div className="empty-state-card">
            <p className="empty-title">Ready when you are</p>
            <p className="empty-copy">
              Tap the button above to generate a concise AI summary for the current tab.
            </p>
          </div>
        )}

        <Footer summary={summary} />
      </main>
    </div>
  );
}

function ThemeButton() {
  const { theme, toggle } = useTheme();
  return (
    <button
      aria-label="Toggle light and dark theme"
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
      onClick={toggle}
      className="theme-toggle"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
