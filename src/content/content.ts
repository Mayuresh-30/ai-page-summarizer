import { extractReadablePageText } from "../utils/extractPageText";
import { limitText } from "../utils/textLimiter";

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === "GET_PAGE_TEXT") {
    const structured = extractReadablePageText();
    const fallback = document.body?.innerText?.trim() ?? "";
    const pageText = structured.length >= 80 ? structured : fallback;
    sendResponse(limitText(pageText));
  }
});