import { useState } from "react";
import { summarizeCurrentPage } from "../services/chrome.service";

export function useSummarizer() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarize = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await summarizeCurrentPage();

      setSummary(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    summary,
    loading,
    error,
    summarize
  };
}