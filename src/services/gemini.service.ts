const GEMINI_API_KEY = import.meta.env.VITE_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_API_URL;

export async function summarizeWithGemini(
  text: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${GEMINI_API_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize the following content: ${text}`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error", response.status, errorText);
      return "No summary available";
    }

    const data = await response.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return summary ?? "No summary available";
  } catch (error) {
    console.error("Summarize got error :", error);
    return error instanceof Error ? error.message : "Unknown error";
  }
}
