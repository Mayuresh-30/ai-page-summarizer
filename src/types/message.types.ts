export type ExtensionMessage =
  | { type: "SUMMARIZE_PAGE" }
  | { type: "GET_PAGE_TEXT" };