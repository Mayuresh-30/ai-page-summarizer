const GEMINI_API_KEY = import.meta.env.VITE_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_API_URL;

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY || !GEMINI_API_URL) {
    throw new Error("Gemini API configuration is missing");
  }

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
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error", response.status, errorText);
    throw new Error("Gemini could not generate a response");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Gemini returned an empty response");
  }

  return text.trim();
}

export async function summarizeWithGemini(
  text: string
): Promise<string> {
  return callGemini(
    [
      "Summarize the webpage content in exactly 3 bullet points.",
      "Keep each bullet short, clear, and clean.",
      "Do not add an intro or closing sentence.",
      "",
      "Webpage content:",
      text
    ].join("\n")
  );
}

export async function askGeminiAboutPage(
  pageText: string,
  question: string
): Promise<string> {
  return callGemini(
    [
      "Answer the user's question using only the webpage content below.",
      "If the answer is not available in the page, say that clearly.",
      "Keep the response concise and useful.",
      "",
      `Question: ${question}`,
      "",
      "Webpage content:",
      pageText
    ].join("\n")
  );
}
