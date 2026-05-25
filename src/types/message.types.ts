export type ExtensionMessage =
  | { type: "SUMMARIZE_PAGE" }
  | { type: "ASK_PAGE"; question: string }
  | { type: "GET_PAGE_TEXT" };
