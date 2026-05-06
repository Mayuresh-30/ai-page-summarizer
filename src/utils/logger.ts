export const logInfo = (message: string, context?: unknown): void => {
  if (context !== undefined) {
    console.info(`[AI Page Summarizer] ${message}`, context);
    return;
  }

  console.info(`[AI Page Summarizer] ${message}`);
};

export const logError = (message: string, error?: unknown): void => {
  if (error !== undefined) {
    console.error(`[AI Page Summarizer] ${message}`, error);
    return;
  }

  console.error(`[AI Page Summarizer] ${message}`);
};
