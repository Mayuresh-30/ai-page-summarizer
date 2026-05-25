import { askGeminiAboutPage, summarizeWithGemini } from "../services/gemini.service";

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
        sendResponse({ success: false });
        return;
      }

      const pageText = await chrome.tabs.sendMessage(tab.id, {
        type: "GET_PAGE_TEXT"
      });

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
