export const extractPageText = (): string => {
  return document.body?.innerText ?? "";
};
