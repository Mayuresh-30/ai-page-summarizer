export enum MessageType {
  EXTRACT_PAGE = "EXTRACT_PAGE",
  SUMMARIZE_TEXT = "SUMMARIZE_TEXT",
  SUMMARY_RESULT = "SUMMARY_RESULT",
  ERROR = "ERROR",
}

export interface SummaryResultPayload {
  summary: string;
}

export interface ExtractPagePayload {
  text: string;
}

export type ExtractPageMessage = {
  type: MessageType.EXTRACT_PAGE;
  payload?: ExtractPagePayload;
};

export type SummarizeTextMessage = {
  type: MessageType.SUMMARIZE_TEXT;
};

export type SummaryResultMessage = {
  type: MessageType.SUMMARY_RESULT;
  payload: SummaryResultPayload;
};

export type ErrorMessage = {
  type: MessageType.ERROR;
  error: string;
};

export type ExtensionMessage =
  | ExtractPageMessage
  | SummarizeTextMessage
  | SummaryResultMessage
  | ErrorMessage;
