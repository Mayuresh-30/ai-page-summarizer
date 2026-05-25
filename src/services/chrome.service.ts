export async function summarizeCurrentPage(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "SUMMARIZE_PAGE" },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error(
              chrome.runtime.lastError.message ||
                "Chrome runtime error"
            )
          );
          return;
        }

        if (!response?.success) {
          reject(
            new Error(
              response?.error ||
                "Failed to summarize page"
            )
          );
          return;
        }

        resolve(response.data);
      }
    );
  });
}

export async function askCurrentPage(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "ASK_PAGE", question },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error(
              chrome.runtime.lastError.message ||
                "Chrome runtime error"
            )
          );
          return;
        }

        if (!response?.success) {
          reject(
            new Error(
              response?.error ||
                "Failed to ask about page"
            )
          );
          return;
        }

        resolve(response.data);
      }
    );
  });
}
