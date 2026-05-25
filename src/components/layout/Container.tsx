import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, Loader2, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { askCurrentPage, summarizeCurrentPage } from "@/services/chrome.service";
import { cn } from "@/lib/utils";
import Header from "./Header";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const Container = () => {
  const [isDark, setIsDark] = useState(true);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");
  const [loadingMode, setLoadingMode] = useState<"ask" | "summary" | null>(null);

  const canSend = query.trim().length > 0 && loadingMode === null;

  const nextMessageId = useMemo(() => {
    return messages.length === 0
      ? 1
      : Math.max(...messages.map((message) => message.id)) + 1;
  }, [messages]);

  const runRequest = async (
    request: () => Promise<string>,
    mode: "ask" | "summary",
    userMessage?: string
  ) => {
    setError("");
    setLoadingMode(mode);

    if (userMessage) {
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId,
          role: "user",
          content: userMessage
        }
      ]);
    }

    try {
      const result = await request();

      setMessages((current) => [
        ...current,
        {
          id: Date.now(),
          role: "assistant",
          content: result
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingMode(null);
    }
  };

  const handleAsk = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = query.trim();
    if (!question || loadingMode) return;

    setQuery("");
    void runRequest(() => askCurrentPage(question), "ask", question);
  };

  const handleSummarize = () => {
    if (loadingMode) return;
    void runRequest(() => summarizeCurrentPage(), "summary");
  };

  return (
    <div className={cn(isDark && "dark")}>
      <div className="flex h-[620px] w-[400px] flex-col overflow-hidden bg-zinc-50 text-zinc-950 shadow-2xl dark:bg-zinc-950 dark:text-zinc-50">
        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((current) => !current)}
        />

        <main className="flex min-h-0 flex-1 flex-col">
          <section className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <Button
              className="h-9 flex-1 bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:text-zinc-950 dark:hover:bg-sky-400"
              disabled={loadingMode !== null}
              onClick={handleSummarize}
              type="button"
            >
              {loadingMode === "summary" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Summarize
            </Button>
          </section>

          <section className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && !error ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    <Sparkles className="size-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Ready for this page.
                  </p>
                </div>
              </div>
            ) : null}

            {messages.map((message) => (
              <article
                className={cn(
                  "max-w-[88%] rounded-lg px-3 py-2 text-sm leading-6",
                  message.role === "user"
                    ? "ml-auto bg-sky-600 text-white dark:bg-sky-500 dark:text-zinc-950"
                    : "border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                )}
                key={message.id}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </article>
            ))}

            {loadingMode === "ask" ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <Loader2 className="size-4 animate-spin" />
                Thinking
              </div>
            ) : null}

            {error ? (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}
          </section>

          <form
            className="border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
            onSubmit={handleAsk}
          >
            <div className="flex items-end gap-2">
              <textarea
                className="max-h-28 min-h-11 flex-1 resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm leading-6 text-zinc-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                disabled={loadingMode !== null}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Ask about this page..."
                rows={1}
                value={query}
              />
              <Button
                aria-label="Send question"
                className="size-11 bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                disabled={!canSend}
                size="icon"
                type="submit"
              >
                {loadingMode === "ask" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Container;
