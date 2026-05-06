import { ExtensionMessage, MessageType } from "../messaging/messageTypes";
import { logError, logInfo } from "../utils/logger";
import { handleSummarizeRequest } from "./messageHandler";

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: ExtensionMessage) => void
  ) => {
    if (message.type !== MessageType.SUMMARIZE_TEXT) {
      return;
    }

    const processSummaryRequest = async (): Promise<void> => {
      try {
        logInfo("Received summarize request from popup");
        const response = await handleSummarizeRequest();
        sendResponse(response);
      } catch (error) {
        logError("Unhandled error in background summarize flow", error);
        sendResponse({
          type: MessageType.ERROR,
          error: "Unexpected error while processing summarize request.",
        });
      }
    };

    void processSummaryRequest();
    return true;
  }
);