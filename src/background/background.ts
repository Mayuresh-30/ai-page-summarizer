import { summarizeWithGemini } from "../services/gemini.service";

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type !== "SUMMARIZE_PAGE") {
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

      const summary = await summarizeWithGemini(pageText);

      if (!summary) {
        sendResponse({ success: false });
        return;
      }

      sendResponse({
        success: true,
        data: summary
      });
    } catch {
      sendResponse({ success: false });
    }
  })();

  return true;
});