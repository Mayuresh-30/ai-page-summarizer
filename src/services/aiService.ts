import { logError, logInfo } from "../utils/logger";

const AI_SUMMARY_ENDPOINT = import.meta.env.VITE_API_URL;
const AI_SUMMARY_KEY = import.meta.env.VITE_API_KEY;

interface SummarizeApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export const summarizeText = async (text: string): Promise<string> => {
  if (!AI_SUMMARY_ENDPOINT || !AI_SUMMARY_KEY) {
    const error = new Error("Missing AI API environment configuration.");
    logError("AI service config is missing VITE_API_URL or VITE_API_KEY", error);
    throw error;
  }

  try {
    const response = await fetch(
      `${AI_SUMMARY_ENDPOINT}?key=${encodeURIComponent(AI_SUMMARY_KEY)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize the following content:\n\n${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI request failed with status ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as SummarizeApiResponse;
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!summary) {
      throw new Error("AI response did not include a summary");
    }

    logInfo("AI summary generated successfully");
    return summary;
  } catch (error) {
    logError("Failed to summarize text in AI service", error);
    throw error;
  }
};
