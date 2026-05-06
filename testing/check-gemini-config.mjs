import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env");

const parseEnv = (content) => {
  const lines = content.split(/\r?\n/);
  const entries = lines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const firstEquals = line.indexOf("=");
      if (firstEquals === -1) {
        return [line, ""];
      }
      const key = line.slice(0, firstEquals).trim();
      const value = line.slice(firstEquals + 1).trim();
      return [key, value];
    });

  return Object.fromEntries(entries);
};

const maskKey = (key) => {
  if (!key) return "";
  if (key.length <= 8) return "********";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
};

const run = async () => {
  const envContent = await readFile(envPath, "utf-8");
  const env = parseEnv(envContent);

  const apiKey = env.VITE_API_KEY;
  const apiUrl = env.VITE_API_URL;

  if (!apiKey || !apiUrl) {
    console.error("Missing VITE_API_KEY or VITE_API_URL in .env");
    process.exit(1);
  }

  console.log("Testing Gemini configuration...");
  console.log(`API URL: ${apiUrl}`);
  console.log(`API Key: ${maskKey(apiKey)}`);

  const response = await fetch(`${apiUrl}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: "Reply exactly with: OK",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`API test failed with status ${response.status}`);
    console.error(body);
    process.exit(1);
  }

  const data = await response.json();
  const modelText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!modelText) {
    console.error("API responded but no text was returned.");
    process.exit(1);
  }

  console.log("API test succeeded.");
  console.log(`Model response: ${modelText}`);
};

run().catch((error) => {
  console.error("API test crashed.");
  console.error(error);
  process.exit(1);
});
