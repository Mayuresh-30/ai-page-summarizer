import {
  ExtensionMessage,
  ExtractPageMessage,
  MessageType,
} from "../messaging/messageTypes";
import { logError, logInfo } from "../utils/logger";
import { extractPageText } from "./extractor";

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: ExtensionMessage) => void
  ) => {
    if (message.type !== MessageType.EXTRACT_PAGE) {
      return;
    }

    try {
      const text = extractPageText();
      logInfo("Page text extracted in content script");
      sendResponse({
        type: MessageType.EXTRACT_PAGE,
        payload: { text },
      } as ExtractPageMessage);
    } catch (error) {
      logError("Failed to extract page text", error);
      sendResponse({
        type: MessageType.ERROR,
        error: "Unable to extract page text from this page.",
      });
    }

    return true;
  }
);