import { askGeminiAboutPage, summarizeWithGemini } from "../services/gemini.service";

const MAX_PAGE_TEXT_LENGTH = 4_800;

function limitPageText(text: string): string {
  return text.length <= MAX_PAGE_TEXT_LENGTH
    ? text
    : text.slice(0, MAX_PAGE_TEXT_LENGTH);
}

function extractPageTextInTab(): string {
  const blockSelector =
    "h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, td, th, figcaption, dd, dt, caption, address";

  const normalizeWhitespace = (text: string) => text.replace(/\s+/g, " ").trim();
  const root =
    document.querySelector(
      "main, article, [role='main'], #main, #content, .article-body, .post-content"
    ) ?? document.body;

  if (!root) return "";

  const blocks = Array.from(root.querySelectorAll(blockSelector));
  const outerBlocks = blocks.filter(
    (el) => !blocks.some((other) => other !== el && other.contains(el))
  );

  const lines: string[] = [];
  const seen = new Set<string>();

  for (const el of outerBlocks) {
    const text = normalizeWhitespace((el as HTMLElement).innerText ?? "");
    if (!text || seen.has(text)) continue;
    seen.add(text);
    lines.push(text);
  }

  const structured = lines.join("\n\n");
  const fallback = document.body?.innerText?.trim() ?? "";

  return structured.length >= 80 ? structured : fallback;
}

async function getActiveTabText(tabId: number): Promise<string> {
  try {
    const pageText = await chrome.tabs.sendMessage(tabId, {
      type: "GET_PAGE_TEXT"
    });

    if (typeof pageText === "string" && pageText.trim().length > 0) {
      return limitPageText(pageText);
    }
  } catch (error) {
    console.warn("Content script message failed, falling back to scripting", error);
  }

  const [injectedResult] = await chrome.scripting.executeScript({
    target: { tabId },
    func: extractPageTextInTab
  });

  const pageText = injectedResult?.result;

  if (typeof pageText !== "string" || pageText.trim().length === 0) {
    throw new Error("No readable text found on this page");
  }

  return limitPageText(pageText);
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type !== "SUMMARIZE_PAGE" && message.type !== "ASK_PAGE") {
    return;
  }


  void (async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab?.id) {
        sendResponse({
          success: false,
          error: "No active tab found"
        });
        return;
      }

      if (
        tab.url?.startsWith("chrome://") ||
        tab.url?.startsWith("edge://") ||
        tab.url?.startsWith("chrome-extension://")
      ) {
        sendResponse({
          success: false,
          error: "Chrome blocks extensions from reading this page. Try a normal website tab."
        });
        return;
      }

      const pageText = await getActiveTabText(tab.id);

      const result =
        message.type === "ASK_PAGE"
          ? await askGeminiAboutPage(pageText, message.question)
          : await summarizeWithGemini(pageText);

      if (!result) {
        sendResponse({ success: false });
        return;
      }

      sendResponse({
        success: true,
        data: result
      });
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : "Request failed"
      });
    }
  })();

  return true;
});
