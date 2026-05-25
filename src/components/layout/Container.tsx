import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  Bot,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";

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
      <div className="flex h-[640px] w-[420px] overflow-hidden bg-zinc-50 text-zinc-950 shadow-2xl dark:bg-zinc-950 dark:text-zinc-50">
        <aside className="flex w-12 flex-col items-center gap-3 border-r border-zinc-200 bg-white px-2 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
            <Bot className="h-4 w-4" />
          </div>
          <div className="h-px w-6 bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <MessageSquareText className="h-4 w-4" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            isDark={isDark}
            onToggleTheme={() => setIsDark((current) => !current)}
          />

          <main className="flex min-h-0 flex-1 flex-col">
            <section className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
              <Button
                className="h-11 w-full bg-sky-600 text-sm font-semibold text-white shadow-sm shadow-sky-600/20 hover:bg-sky-700 dark:bg-sky-400 dark:text-zinc-950 dark:shadow-sky-400/10 dark:hover:bg-sky-300"
                disabled={loadingMode !== null}
                onClick={handleSummarize}
                type="button"
              >
                {loadingMode === "summary" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {loadingMode === "summary" ? "Summarizing page" : "Summarize in 3 bullets"}
              </Button>
            </section>

            <section className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-zinc-50 px-4 py-4 dark:bg-zinc-950">
            {messages.length === 0 && !error ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="max-w-[250px]">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <Sparkles className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Ready to read this page
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    Summarize it or ask a focused question from the input below.
                  </p>
                </div>
              </div>
            ) : null}

            {messages.map((message) => (
              <article
                className={cn(
                  "max-w-[88%] rounded-lg px-3.5 py-2.5 text-sm leading-6 shadow-sm",
                  message.role === "user"
                    ? "ml-auto bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                )}
                key={message.id}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </article>
            ))}

            {loadingMode === "ask" ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Moyy is reading
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
              <div className="flex items-end gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 shadow-sm transition focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 dark:border-zinc-800 dark:bg-zinc-900">
                <textarea
                  className="max-h-28 min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm leading-6 text-zinc-950 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed dark:text-zinc-50 dark:placeholder:text-zinc-500"
                  disabled={loadingMode !== null}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder="Ask Moyy about this page..."
                  rows={1}
                  value={query}
                />
                <Button
                  aria-label="Send question"
                  className="h-10 w-10 bg-sky-600 text-white shadow-sm hover:bg-sky-700 disabled:opacity-40 dark:bg-sky-400 dark:text-zinc-950 dark:hover:bg-sky-300"
                  disabled={!canSend}
                  size="icon"
                  type="submit"
                >
                  {loadingMode === "ask" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Container;
