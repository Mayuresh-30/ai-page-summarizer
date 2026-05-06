import { useState } from "react";
import {
  ErrorMessage,
  MessageType,
  SummarizeTextMessage,
  SummaryResultMessage,
} from "../messaging/messageTypes";

const App = () => {
  const [summary, setSummary] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSummarizePage = async (): Promise<void> => {
    setIsLoading(true);
    setError("");
    setSummary("");

    try {
      const response = (await chrome.runtime.sendMessage({
        type: MessageType.SUMMARIZE_TEXT,
      } as SummarizeTextMessage)) as SummaryResultMessage | ErrorMessage;

      if (response.type === MessageType.ERROR) {
        setError(response.error);
        return;
      }

      setSummary(response.payload.summary);
    } catch (_error) {
      setError("Failed to communicate with extension background service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ width: 340, padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginTop: 0, fontSize: 18 }}>AI Page Summarizer</h1>
      <button
        type="button"
        onClick={() => void handleSummarizePage()}
        disabled={isLoading}
        style={{ padding: "8px 12px", cursor: isLoading ? "wait" : "pointer" }}
      >
        {isLoading ? "Summarizing..." : "Summarize Page"}
      </button>

      {error ? (
        <p style={{ color: "#b00020", marginTop: 12 }}>{error}</p>
      ) : null}

      {summary ? (
        <section style={{ marginTop: 12 }}>
          <h2 style={{ fontSize: 14, marginBottom: 8 }}>Summary</h2>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{summary}</p>
        </section>
      ) : null}
    </main>
  );
};

export default App;
