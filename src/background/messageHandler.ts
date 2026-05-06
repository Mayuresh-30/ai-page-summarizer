import {
  ErrorMessage,
  ExtractPageMessage,
  MessageType,
  SummaryResultMessage,
} from "../messaging/messageTypes";
import { summarizeText } from "../services/aiService";
import { logError, logInfo } from "../utils/logger";

const getActiveTabId = async (): Promise<number> => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTabId = tabs[0]?.id;

  if (activeTabId === undefined) {
    throw new Error("No active tab found");
  }

  return activeTabId;
};

const extractTextFromPage = async (tabId: number): Promise<string> => {
  const extractionResponse = (await chrome.tabs.sendMessage(tabId, {
    type: MessageType.EXTRACT_PAGE,
  })) as ExtractPageMessage | ErrorMessage;

  if (extractionResponse.type === MessageType.ERROR || !extractionResponse.payload?.text) {
    throw new Error(extractionResponse.error ?? "Failed to extract text from page");
  }

  return extractionResponse.payload.text;
};

export const handleSummarizeRequest = async (): Promise<
  SummaryResultMessage | ErrorMessage
> => {
  const tabId = await getActiveTabId();
  logInfo("Active tab found for summary request", { tabId });

  const pageText = await extractTextFromPage(tabId);

  if (!pageText.trim()) {
    return {
      type: MessageType.ERROR,
      error: "No readable text found on this page.",
    };
  }

  try {
    const summary = await summarizeText(pageText);
    return {
      type: MessageType.SUMMARY_RESULT,
      payload: { summary },
    };
  } catch (error) {
    logError("Summary generation failed in background handler", error);
    return {
      type: MessageType.ERROR,
      error: "Unable to summarize this page right now.",
    };
  }
};
